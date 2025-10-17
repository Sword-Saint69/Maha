const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Example: send message to main process
  send: (channel, data) => {
    // Whitelist channels
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  // Example: receive message from main process
  receive: (channel, func) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  // Add music player specific APIs here
  player: {
    // Example methods for future implementation
    play: () => ipcRenderer.invoke('player:play'),
    pause: () => ipcRenderer.invoke('player:pause'),
    stop: () => ipcRenderer.invoke('player:stop'),
    setVolume: (volume) => ipcRenderer.invoke('player:setVolume', volume),
    loadFile: () => ipcRenderer.invoke('dialog:openFile'),
  },
  // Music folder selection
  selectMusicFolder: () => ipcRenderer.invoke('dialog:openMusicFolder'),
  // Music folder scanning
  scanMusicFolder: (folderPath) => ipcRenderer.invoke('music:scanFolder', folderPath),
});
