"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { MusicFile } from "@/electron/electron.d";

interface MusicCardGridProps {
  musicFiles: MusicFile[];
}

export default function MusicCardGrid({ musicFiles }: MusicCardGridProps) {
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
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={500}
                  height={500}
                  src={active.coverArt || defaultCover}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 text-xl"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`artist-${active.artist}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base mt-1"
                    >
                      {active.artist}
                    </motion.p>
                  </div>

                  <motion.button
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 hover:bg-green-600 text-white transition-colors"
                    onClick={() => console.log('Play:', active.filePath)}
                  >
                    Play
                  </motion.button>
                </div>
                <div className="pt-4 relative px-4 pb-8">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 dark:text-neutral-400 text-sm space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">Album:</span>
                      <span>{active.album}</span>
                    </div>
                    {active.year && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Year:</span>
                        <span>{active.year}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold">Duration:</span>
                      <span>{formatDuration(active.duration)}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-semibold">File:</span>
                      <span className="text-xs text-right max-w-[300px] truncate">{active.filePath}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      
      {musicFiles.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <p className="text-lg">No music files found</p>
          <p className="text-sm mt-2">Select a music folder to get started</p>
        </div>
      ) : (
        <ul className="max-w-4xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start gap-4">
          {musicFiles.map((card) => (
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={`${card.filePath}-${id}`}
              onClick={() => setActive(card)}
              className="p-3 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors"
            >
              <div className="flex gap-3 flex-col w-full">
                <motion.div layoutId={`image-${card.title}-${id}`}>
                  <img
                    width={200}
                    height={200}
                    src={card.coverArt || defaultCover}
                    alt={card.title}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm truncate"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`artist-${card.artist}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400 text-xs truncate"
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
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
