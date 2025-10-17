"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { IconPlayerPlay } from "@tabler/icons-react";
import type { MusicFile } from "@/electron/electron.d";

interface MusicCardGridProps {
  musicFiles: MusicFile[];
  onPlayTrack?: (track: MusicFile) => void;
}

export default function MusicCardGrid({ musicFiles, onPlayTrack }: MusicCardGridProps) {
  const [active, setActive] = useState<MusicFile | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&auto=format&fit=crop&q=60";

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-6 right-6 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full h-10 w-10 transition-colors border border-white/20"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-2xl h-full md:h-fit md:max-h-[85vh] flex flex-col bg-gradient-to-br from-neutral-900 to-black border border-neutral-800/50 sm:rounded-2xl overflow-hidden shadow-2xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`} className="relative">
                <img
                  width={500}
                  height={500}
                  src={active.coverArt || defaultCover}
                  alt={active.title}
                  className="w-full h-96 sm:rounded-t-2xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </motion.div>

              <div className="relative -mt-20 z-10">
                <div className="flex justify-between items-start p-6 pb-4">
                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-white text-2xl mb-2 drop-shadow-lg"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`artist-${active.artist}-${id}`}
                      className="text-neutral-300 text-lg drop-shadow-md"
                    >
                      {active.artist}
                    </motion.p>
                  </div>

                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 flex items-center gap-2"
                    onClick={() => {
                      setActive(null);
                      onPlayTrack && onPlayTrack(active);
                    }}
                  >
                    <IconPlayerPlay className="w-5 h-5" />
                    Play Now
                  </motion.button>
                </div>
                <div className="px-6 pb-6">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-5 space-y-3 border border-neutral-700/50"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-700/50">
                      <span className="font-semibold text-neutral-400 text-sm">Album</span>
                      <span className="text-white font-medium">{active.album}</span>
                    </div>
                    {active.year && (
                      <div className="flex justify-between items-center pb-3 border-b border-neutral-700/50">
                        <span className="font-semibold text-neutral-400 text-sm">Year</span>
                        <span className="text-white font-medium">{active.year}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-700/50">
                      <span className="font-semibold text-neutral-400 text-sm">Duration</span>
                      <span className="text-white font-medium">{formatDuration(active.duration)}</span>
                    </div>
                    <div className="flex justify-between items-start pt-1">
                      <span className="font-semibold text-neutral-400 text-sm">File</span>
                      <span className="text-neutral-500 text-xs text-right max-w-md truncate font-mono">{active.filePath}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      
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
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={`${card.filePath}-${id}`}
              onClick={() => setActive(card)}
              className="group p-4 flex flex-col bg-neutral-900/40 hover:bg-neutral-800/60 rounded-xl cursor-pointer transition-all duration-300 border border-neutral-800/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm"
            >
              <div className="flex gap-3 flex-col w-full">
                <motion.div layoutId={`image-${card.title}-${id}`} className="relative overflow-hidden rounded-lg">
                  <img
                    width={200}
                    height={200}
                    src={card.coverArt || defaultCover}
                    alt={card.title}
                    className="h-44 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 right-2 bg-purple-500/90 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <IconPlayerPlay className="w-4 h-4" />
                  </div>
                </motion.div>
                <div className="flex flex-col gap-1">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="font-semibold text-neutral-200 text-sm truncate group-hover:text-purple-400 transition-colors"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`artist-${card.artist}-${id}`}
                    className="text-neutral-500 text-xs truncate group-hover:text-neutral-400 transition-colors"
                  >
                    {card.artist}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </ul>
      )}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
