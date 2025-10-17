# Development Guide - Maha Music Player

## Quick Start

### 1. Web Development Mode (Recommended for UI work)
```bash
bun run dev
```
Then open http://localhost:3000 in your browser.

### 2. Electron Development Mode (Full desktop app)
```bash
bun run electron:dev
```
This starts both Next.js dev server and Electron app.

## Project Architecture

### Frontend (Next.js)
- **Location**: `app/` directory
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

### Desktop Layer (Electron)
- **Main Process**: `electron/main.js`
- **Preload Script**: `electron/preload.js`
- **Type Definitions**: `electron/electron.d.ts`

## Communication Between Electron & Next.js

### Using the Electron API in React Components

```typescript
// Example: Using the player API
'use client';

export default function Player() {
  const handlePlay = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      await window.electron.player.play();
    }
  };

  return (
    <button onClick={handlePlay}>Play</button>
  );
}
```

### Adding New IPC Methods

1. **Update preload.js**:
```javascript
contextBridge.exposeInMainWorld('electron', {
  player: {
    newMethod: () => ipcRenderer.invoke('player:newMethod'),
  },
});
```

2. **Update electron.d.ts**:
```typescript
export interface ElectronAPI {
  player: {
    newMethod: () => Promise<void>;
  };
}
```

3. **Handle in main.js**:
```javascript
const { ipcMain } = require('electron');

ipcMain.handle('player:newMethod', async () => {
  // Implementation
});
```

## Building for Production

### 1. Build Next.js
```bash
bun run build
```

### 2. Package Electron App
```bash
bun run electron:build
```

Output will be in `dist/` directory.

## Debugging

### Next.js (Browser)
- Use browser DevTools as normal
- Server logs appear in terminal

### Electron
- Main process logs: Check terminal
- Renderer process: DevTools opens automatically in dev mode
- Manual DevTools: `mainWindow.webContents.openDevTools()`

## Common Tasks

### Add a New Page
1. Create file in `app/` directory (e.g., `app/library/page.tsx`)
2. The route will be automatically available at `/library`

### Add New Dependencies
```bash
bun add package-name           # Production dependency
bun add -d package-name        # Development dependency
```

### Update Electron Window Settings
Edit `electron/main.js` in the `createWindow()` function.

### Change Build Configuration
Edit the `"build"` section in `package.json`.

## Tips

1. **Hot Reload**: Next.js supports HMR - your changes appear instantly
2. **Type Safety**: Always define types in TypeScript for better development experience
3. **Client Components**: Use `'use client'` directive when using browser APIs or hooks
4. **Electron API**: Always check `window.electron` exists before using

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Electron Not Starting
1. Make sure Next.js dev server is running first
2. Wait for "Ready" message before Electron launches
3. Check `electron/main.js` for errors

### Build Fails
1. Clean build directories: `rm -rf .next dist`
2. Reinstall dependencies: `rm -rf node_modules && bun install`
3. Check `next.config.ts` configuration

## Next Steps

1. Implement audio player functionality
2. Add file system access for music library
3. Create playlist management
4. Add audio visualizations
5. Implement settings and preferences
6. Add keyboard shortcuts

Happy coding! 🎵
