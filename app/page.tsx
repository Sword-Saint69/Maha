'use client';

import { FloatingDock } from "@/components/ui/floating-dock";
import MusicCardGrid from "@/components/music-card-grid";
import MusicPlayer from "@/components/music-player";
import SettingsPage from "@/components/settings-page";
import StatsPage from "@/components/stats-page";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TracingBeam } from "@/components/ui/tracing-beam";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import type { MusicFile } from "@/electron/electron.d";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconSettings,
  IconHome,
  IconFolder,
  IconInfoCircle,
  IconChartBar,
} from "@tabler/icons-react";

export default function Home() {
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [filteredMusicFiles, setFilteredMusicFiles] = useState<MusicFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentView, setCurrentView] = useState<'home' | 'settings' | 'about' | 'stats'>('home');

  // Load music files from localStorage on mount
  useEffect(() => {
    const loadMusicLibrary = async () => {
      const savedPath = localStorage.getItem('musicFolderPath');
      if (savedPath && typeof window !== 'undefined' && window.electron) {
        setIsLoading(true);
        try {
          const result = await window.electron.scanMusicFolder(savedPath);
          if (result.success && result.files) {
            setMusicFiles(result.files);
            setFilteredMusicFiles(result.files);
          }
        } catch (error) {
          console.error('Error loading music library:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMusicLibrary();
  }, []);

  // Filter music files when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMusicFiles(musicFiles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = musicFiles.filter(file => 
        file.title.toLowerCase().includes(query) ||
        file.artist.toLowerCase().includes(query) ||
        file.album.toLowerCase().includes(query)
      );
      setFilteredMusicFiles(filtered);
    }
  }, [searchQuery, musicFiles]);

  const handleMusicFolderSelect = async () => {
    // Check if running in Electron environment
    if (typeof window !== 'undefined' && window.electron && window.electron.selectMusicFolder) {
      try {
        const result = await window.electron.selectMusicFolder();
        if (result.success && result.path) {
          console.log('Selected music folder:', result.path);
          // Store the folder path for future use
          localStorage.setItem('musicFolderPath', result.path);
          
          // Scan the folder for music files
          setIsLoading(true);
          try {
            const scanResult = await window.electron.scanMusicFolder(result.path);
            if (scanResult.success && scanResult.files) {
              setMusicFiles(scanResult.files);
              setFilteredMusicFiles(scanResult.files);
              alert(`Successfully loaded ${scanResult.files.length} music files!`);
            } else {
              alert(`Error scanning folder: ${scanResult.error || 'Unknown error'}`);
            }
          } catch (scanError) {
            console.error('Error scanning folder:', scanError);
            alert(`Error scanning folder: ${scanError}`);
          }
          setIsLoading(false);
        } else {
          console.log('Folder selection cancelled');
        }
      } catch (error) {
        console.error('Error selecting music folder:', error);
        alert(`Error selecting folder: ${error}\n\nPlease check the console for more details.`);
        setIsLoading(false);
      }
    } else {
      // Fallback for web browser (development)
      console.warn('Not running in Electron environment');
      alert('⚠️ Music folder selection is only available in the Electron app.\n\nPlease run: bun run electron:dev');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is handled by the useEffect watching searchQuery
  };

  const handlePlayTrack = (track: MusicFile) => {
    const index = filteredMusicFiles.findIndex(f => f.filePath === track.filePath);
    setCurrentTrack(track);
    setCurrentTrackIndex(index);
  };

  const handleNext = () => {
    if (filteredMusicFiles.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % filteredMusicFiles.length;
    setCurrentTrack(filteredMusicFiles[nextIndex]);
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (filteredMusicFiles.length === 0) return;
    const prevIndex = currentTrackIndex === 0 ? filteredMusicFiles.length - 1 : currentTrackIndex - 1;
    setCurrentTrack(filteredMusicFiles[prevIndex]);
    setCurrentTrackIndex(prevIndex);
  };

  const handleSocialClick = async (url: string) => {
    if (typeof window !== 'undefined' && window.electron && window.electron.openExternal) {
      try {
        await window.electron.openExternal(url);
      } catch (error) {
        console.error('Error opening external URL:', error);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const searchPlaceholders = [
    "Search for songs...",
    "Find your favorite artist...",
    "Look for albums...",
    "Search playlists...",
    "Discover new music...",
  ];

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => setCurrentView('home'),
    },
    {
      title: "Music Folder",
      icon: (
        <IconFolder className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: handleMusicFolderSelect,
    },
    {
      title: "Statistics",
      icon: (
        <IconChartBar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => setCurrentView('stats'),
    },
    {
      title: "About",
      icon: (
        <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => setCurrentView('about'),
    },
    {
      title: "Settings",
      icon: (
        <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => setCurrentView('settings'),
    },
    {
      title: "Instagram",
      icon: (
        <IconBrandInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => handleSocialClick('https://instagram.com/_gouth.ammmm'),
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => handleSocialClick('https://github.com/Sword-saint69'),
    },
  ];

  return (
    <ThemeProvider>
      <div className="relative min-h-screen text-white flex flex-col items-center justify-start pt-16 pl-24 pb-32" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="absolute top-6 left-28 w-48 h-20 z-10">
          <TextHoverEffect text="MAHA" />
        </div>
        
        {currentView === 'home' ? (
          <>
            <div className="w-full max-w-3xl px-4 mb-12 relative z-10">
              <PlaceholdersAndVanishInput
                placeholders={searchPlaceholders}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
              />
            </div>
            
            <div className="w-full max-w-7xl px-6 mb-24 relative z-10">
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-lg font-medium text-neutral-300">Loading your music library...</p>
                  </div>
                </div>
              ) : (
                <>
                  {searchQuery && (
                    <div className="mb-4 text-sm text-neutral-400">
                      {filteredMusicFiles.length} result{filteredMusicFiles.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </div>
                  )}
                  <MusicCardGrid musicFiles={filteredMusicFiles} onPlayTrack={handlePlayTrack} />
                </>
              )}
            </div>
          </>
        ) : currentView === 'settings' ? (
          <TracingBeam className="px-6">
            <SettingsPage />
          </TracingBeam>
        ) : currentView === 'stats' ? (
          <div className="px-6">
            <StatsPage allTracks={musicFiles} onPlayTrack={handlePlayTrack} />
          </div>
        ) : (
          <TracingBeam className="px-6">
            <div className="w-full max-w-4xl mx-auto px-6 py-8">
              <div className="text-center py-12">
                <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  About Maha Music Player
                </h1>
                <p className="text-xl mb-12" style={{ color: 'var(--text-secondary)' }}>
                  A powerful, feature-rich music player built with modern web technologies
                </p>
              </div>

              {/* Features Section */}
              <div className="mb-12 p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Advanced Music Library Management',
                    'Detailed Listening Statistics',
                    'Customizable Themes',
                    'Audio Enhancement Controls',
                    'Playlist Management',
                    'Smart Search & Filters',
                    'High-Performance Playback',
                    'Beautiful Modern UI'
                  ].map((feature, index) => (
                    <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <p style={{ color: 'var(--text-primary)' }}>{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-12 p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Built With</h2>
                <div className="flex flex-wrap gap-3">
                  {['Next.js', 'React', 'TypeScript', 'Electron', 'Tailwind CSS', 'Howler.js', 'Motion'].map((tech) => (
                    <span 
                      key={tech}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Made with Love */}
              <div className="text-center py-8 px-6 rounded-lg mb-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Made with ❤️ by Goutham
                  </h2>
                  <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Passionate about creating beautiful music experiences
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={() => handleSocialClick('https://github.com/Sword-saint69')}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <IconBrandGithub className="w-6 h-6" />
                    <span className="font-medium">GitHub</span>
                  </button>
                  <button
                    onClick={() => handleSocialClick('https://instagram.com/_gouth.ammmm')}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <IconBrandInstagram className="w-6 h-6" />
                    <span className="font-medium">Instagram</span>
                  </button>
                </div>

                {/* Links Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <IconBrandGithub className="w-4 h-4" />
                    <a 
                      href="https://github.com/Sword-saint69" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      github.com/Sword-saint69
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <IconBrandInstagram className="w-4 h-4" />
                    <a 
                      href="https://instagram.com/_gouth.ammmm" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      instagram.com/_gouth.ammmm
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center py-6">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  © 2024 Maha Music Player. All rights reserved.
                </p>
              </div>
            </div>
          </TracingBeam>
        )}
        
        <FloatingDock items={links} />
        <MusicPlayer 
          currentTrack={currentTrack} 
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </ThemeProvider>
  );
}
