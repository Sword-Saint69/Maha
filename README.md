# 🎵 Maha Music Player

A beautiful desktop music player built with **Electron.js** and **Next.js**.

## 🚀 Tech Stack

- **Electron.js** - Desktop application framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern styling
- **Bun** - Fast JavaScript runtime and package manager

## 📦 Installation

```bash
# Install dependencies
bun install
```

## 🛠️ Development

### Run Next.js only (web mode)
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Electron + Next.js (desktop mode)
```bash
bun run electron:dev
```
This will start the Next.js dev server and launch the Electron app.

## 🏗️ Build

### Build Next.js
```bash
bun run build
```

### Build Electron app (package)
```bash
bun run electron:build
```
This creates a distributable Electron app in the `dist/` directory.

### Create package without installer
```bash
bun run package
```

## 📁 Project Structure

```
maha/
├── app/                  # Next.js App Router pages
├── electron/            # Electron main process files
│   ├── main.js         # Electron main process
│   ├── preload.js      # Preload script for IPC
│   └── electron.d.ts   # TypeScript definitions
├── public/             # Static assets
├── .next/              # Next.js build output
├── dist/               # Electron build output
└── package.json        # Project configuration
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Next.js dev server |
| `bun run build` | Build Next.js for production |
| `bun run electron` | Run Electron (requires built Next.js) |
| `bun run electron:dev` | Run Electron + Next.js in dev mode |
| `bun run electron:build` | Build complete Electron app |
| `bun run package` | Package app without installer |
| `bun run dist` | Create distributable packages |

## 🎨 Features

- ✨ Modern UI with Tailwind CSS
- 🎧 Electron desktop integration
- ⚡ Fast development with Bun
- 🔥 Hot Module Replacement (HMR)
- 📱 Responsive design
- 🎯 TypeScript support

## 🔧 Configuration

- **Next.js config**: `next.config.ts`
- **Electron config**: `electron/main.js`
- **Build config**: `package.json` (under "build" section)
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `postcss.config.mjs`

## 📝 License

MIT

---

Built with ❤️ using Electron.js and Next.js
