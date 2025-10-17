export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Maha Music Player
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Your personal music experience powered by Electron.js and Next.js
          </p>
          
          <div className="flex gap-4 items-center justify-center mt-12">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
              Open Music Library
            </button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">
              Settings
            </button>
          </div>

          <div className="mt-16 p-6 bg-white/5 backdrop-blur-sm rounded-lg max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">🎵 Features Coming Soon:</h2>
            <ul className="text-left space-y-2 text-gray-300">
              <li>✨ Beautiful audio player interface</li>
              <li>📁 Local music library management</li>
              <li>🎨 Custom themes and visualizations</li>
              <li>🎧 High-quality audio playback</li>
              <li>📝 Playlist creation and management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
