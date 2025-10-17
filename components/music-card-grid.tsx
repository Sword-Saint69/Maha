"use client";

import React, { useId } from "react";
import { IconPlayerPlay } from "@tabler/icons-react";
import type { MusicFile } from "@/electron/electron.d";

interface MusicCardGridProps {
  musicFiles: MusicFile[];
  onPlayTrack?: (track: MusicFile) => void;
}

export default function MusicCardGrid({ musicFiles, onPlayTrack }: MusicCardGridProps) {
  const id = useId();
  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&auto=format&fit=crop&q=60";

  return (
    <>
      {musicFiles.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6">
            <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-neutral-300 mb-2">No music files found</p>
          <p className="text-sm text-neutral-500">Select a music folder from the dock to get started</p>
        </div>
      ) : (
        <ul className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-start gap-4">
          {musicFiles.map((card) => (
            <div
              key={`${card.filePath}-${id}`}
              className="group p-4 flex flex-col bg-neutral-900/40 hover:bg-neutral-800/60 rounded-xl transition-all duration-300 border border-neutral-800/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm"
            >
              <div className="flex gap-3 flex-col w-full">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    width={200}
                    height={200}
                    src={card.coverArt || defaultCover}
                    alt={card.title}
                    className="h-44 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={() => onPlayTrack && onPlayTrack(card)}
                    className="absolute bottom-2 right-2 bg-purple-500/90 hover:bg-purple-600 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110 active:scale-95"
                    title="Play"
                  >
                    <IconPlayerPlay className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-neutral-200 text-sm truncate group-hover:text-purple-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-neutral-500 text-xs truncate group-hover:text-neutral-400 transition-colors">
                    {card.artist}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}
