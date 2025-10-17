"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { MusicFile } from "@/electron/electron.d";

interface MusicCardGridProps {
  musicFiles: MusicFile[];
}

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
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
            >
                <img
                  width={500}
                  height={500}
                  src={active.coverArt || defaultCover}
                  alt={active.title}
                />
              </motion.div>

                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`artist-${active.artist}-${id}`}
                    >
                      {active.artist}
                    </motion.p>
                  </div>

                  <motion.button
                    layout
                  >
                  </motion.button>
                </div>
                  <motion.div
                    layout
                  >
                    </div>
                    {active.year && (
                      </div>
                    )}
                    </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      
      {musicFiles.length === 0 ? (
        </div>
      ) : (
          {musicFiles.map((card) => (
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={`${card.filePath}-${id}`}
              onClick={() => setActive(card)}
            >
              <div className="flex gap-3 flex-col w-full">
                  <img
                    width={200}
                    height={200}
                    src={card.coverArt || defaultCover}
                    alt={card.title}
                  />
                </motion.div>
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`artist-${card.artist}-${id}`}
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
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
