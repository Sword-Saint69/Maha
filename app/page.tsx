'use client';

import { FloatingDock } from "@/components/ui/floating-dock";
import MusicCardGrid from "@/components/music-card-grid";
import MusicPlayer from "@/components/music-player";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState, useEffect } from "react";
import type { MusicFile } from "@/electron/electron.d";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconFolder,
  IconTerminal2,
} from "@tabler/icons-react";

export default function Home() {
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

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
    console.log('Search value:', e.target.value);
    // TODO: Implement search functionality
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Search submitted');
    // TODO: Implement search submit functionality
  };

  const handlePlayTrack = (track: MusicFile) => {
    const index = musicFiles.findIndex(f => f.filePath === track.filePath);
    setCurrentTrack(track);
    setCurrentTrackIndex(index);
  };

  const handleNext = () => {
    if (musicFiles.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % musicFiles.length;
    setCurrentTrack(musicFiles[nextIndex]);
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (musicFiles.length === 0) return;
    const prevIndex = currentTrackIndex === 0 ? musicFiles.length - 1 : currentTrackIndex - 1;
    setCurrentTrack(musicFiles[prevIndex]);
    setCurrentTrackIndex(prevIndex);
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
    },
    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
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
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-neutral-950 to-purple-950/20 text-white flex flex-col items-center justify-start pt-16 pl-24 pb-32">
      {/* Animated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="absolute top-6 left-28 w-48 h-20 z-10">
        <TextHoverEffect text="MAHA" />
      </div>
      
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
          <MusicCardGrid musicFiles={musicFiles} onPlayTrack={handlePlayTrack} />
        )}
      </div>
      
      <FloatingDock items={links} />
      <MusicPlayer 
        currentTrack={currentTrack} 
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}
