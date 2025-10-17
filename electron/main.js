const { app, BrowserWindow, ipcMain, dialog, protocol, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const mm = require('music-metadata');

let mainWindow;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // Allow loading local files
    },
    titleBarStyle: 'hiddenInset', // For macOS styled title bar
    backgroundColor: '#000000',
    show: false, // Don't show until ready
  });

  // Load the app
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../.next/server/app/index.html')}`;

  mainWindow.loadURL(startURL);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Register custom protocol for serving local audio files
  protocol.registerFileProtocol('media-file', (request, callback) => {
    const url = request.url.replace('media-file://', '');
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      console.error('Error serving media file:', error);
      return callback({ error: -2 });
    }
  });

  createWindow();

  // IPC Handlers
  ipcMain.handle('dialog:openMusicFolder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Music Folder',
      buttonLabel: 'Select Folder',
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, path: result.filePaths[0] };
    }
    return { success: false, path: null };
  });

  // Open external URL in default browser
  ipcMain.handle('shell:openExternal', async (event, url) => {
    try {
      await shell.openExternal(url);
      return { success: true };
    } catch (error) {
      console.error('Error opening external URL:', error);
      return { success: false, error: error.message };
    }
  });

  // Scan music folder and extract metadata
  ipcMain.handle('music:scanFolder', async (event, folderPath) => {
    try {
      console.log('Scanning folder:', folderPath);
      const musicFiles = [];
      const files = await fs.readdir(folderPath);
      console.log(`Found ${files.length} files in folder`);
      
      const supportedFormats = ['.mp3', '.m4a', '.flac', '.wav', '.ogg', '.aac'];
      
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const ext = path.extname(file).toLowerCase();
        
        if (supportedFormats.includes(ext)) {
          try {
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
              console.log(`Processing: ${file}`);
              const metadata = await mm.parseFile(filePath);
              const coverArt = metadata.common.picture && metadata.common.picture[0]
                ? `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}`
                : null;
              
              musicFiles.push({
                title: metadata.common.title || path.basename(file, ext),
                artist: metadata.common.artist || 'Unknown Artist',
                album: metadata.common.album || 'Unknown Album',
                duration: metadata.format.duration || 0,
                filePath: `media-file://${filePath}`,
                coverArt: coverArt,
                year: metadata.common.year || null,
              });
            }
          } catch (error) {
            console.error(`Error reading metadata for ${file}:`, error.message);
          }
        }
      }
      
      console.log(`Successfully processed ${musicFiles.length} music files`);
      return { success: true, files: musicFiles };
    } catch (error) {
      console.error('Error scanning folder:', error);
      return { success: false, error: error.message };
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
