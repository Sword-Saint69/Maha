'use client';

import { FloatingDock } from "@/components/ui/floating-dock";
import Carousel from "@/components/ui/carousel";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
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
    if (typeof window !== 'undefined' && window.electron) {
      try {
        const result = await window.electron.selectMusicFolder();
        if (result.success && result.path) {
          console.log('Selected music folder:', result.path);
          // Store the folder path for future use
          localStorage.setItem('musicFolderPath', result.path);
          // TODO: Scan folder for music files and update library
          alert(`Music folder selected: ${result.path}`);
        }
      } catch (error) {
        console.error('Error selecting music folder:', error);
      }
    } else {
      // Fallback for web browser (development)
      alert('Folder selection is only available in the Electron app');
    }
  };

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

  const carouselSlides = [
    {
      title: "Slide 1",
      button: "Learn More",
      src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Slide 2",
      button: "Explore",
      src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Slide 3",
      button: "Discover",
      src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-start pt-16">
      <div className="absolute top-4 left-4 w-48 h-24">
        <TextHoverEffect text="MAHA" />
      </div>
      <div className="mt-8">
        <Carousel slides={carouselSlides} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center pb-8">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
