'use client';

import { FloatingDock } from "@/components/ui/floating-dock";
import ExpandableCardDemo from "@/components/expandable-card-demo-grid";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconFolder,
  IconTerminal2,
} from "@tabler/icons-react";

export default function Home() {
  const handleMusicFolderSelect = async () => {
    // Check if running in Electron environment
    if (typeof window !== 'undefined' && window.electron && window.electron.selectMusicFolder) {
      try {
        const result = await window.electron.selectMusicFolder();
        if (result.success && result.path) {
          console.log('Selected music folder:', result.path);
          // Store the folder path for future use
          localStorage.setItem('musicFolderPath', result.path);
          // TODO: Scan folder for music files and update library
          alert(`Music folder selected: ${result.path}`);
        } else {
          console.log('Folder selection cancelled');
        }
      } catch (error) {
        console.error('Error selecting music folder:', error);
        alert('Error selecting folder. Please try again.');
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
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-start pt-16">
      <div className="absolute top-4 left-4 w-48 h-24">
        <TextHoverEffect text="MAHA" />
      </div>
      <div className="w-full max-w-2xl px-4 mb-8">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />
      </div>
      <div className="w-full max-w-4xl px-4 mb-24">
        <ExpandableCardDemo />
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center pb-8">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
