"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import type { MusicFile } from "@/electron/electron.d";
import { StatsManager } from "@/lib/music-library";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";

interface MusicPlayerProps {
  currentTrack: MusicFile | null;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MusicPlayer({ currentTrack, onNext, onPrevious }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeAmplification, setVolumeAmplification] = useState(100);
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load volume amplification from localStorage
  useEffect(() => {
    const savedAmplification = localStorage.getItem('volumeAmplification');
    if (savedAmplification) {
      setVolumeAmplification(parseInt(savedAmplification));
    }

    // Listen for volume amplification changes
    const handleAmplificationChange = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setVolumeAmplification(customEvent.detail);
    };

    window.addEventListener('volumeAmplificationChanged', handleAmplificationChange);
    return () => {
      window.removeEventListener('volumeAmplificationChanged', handleAmplificationChange);
    };
  }, []);

  useEffect(() => {
    if (currentTrack) {
      console.log('Loading track:', currentTrack.title, 'from:', currentTrack.filePath);
      
      // Stop and unload previous sound
      if (soundRef.current) {
        soundRef.current.unload();
      }

      // Create new sound
      const sound = new Howl({
        src: [currentTrack.filePath],
        html5: true,
        volume: (volume * volumeAmplification) / 100,
        format: ['mp3', 'm4a', 'flac', 'wav', 'ogg', 'aac'],
        onplay: () => {
          console.log('Playing:', currentTrack.title);
          setIsPlaying(true);
          startProgressInterval();
          // Track play count
          StatsManager.incrementPlayCount(currentTrack.filePath);
        },
        onpause: () => {
          setIsPlaying(false);
          stopProgressInterval();
        },
        onend: () => {
          setIsPlaying(false);
          stopProgressInterval();
          onNext();
        },
        onload: () => {
          console.log('Audio loaded successfully');
        },
        onloaderror: (_id: number, error: unknown) => {
          console.error('Error loading audio:', error);
          console.error('Failed to load:', currentTrack.filePath);
          console.error('Track info:', currentTrack);
        },
        onplayerror: (_id: number, error: unknown) => {
          console.error('Error playing audio:', error);
          console.error('Track:', currentTrack.title);
        },
      });

      soundRef.current = sound;
      sound.play();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      stopProgressInterval();
    };
  }, [currentTrack, volume, volumeAmplification]);

  const startProgressInterval = () => {
    stopProgressInterval();
    progressIntervalRef.current = setInterval(() => {
      if (soundRef.current && soundRef.current.playing()) {
        setCurrentTime(soundRef.current.seek() as number);
      }
    }, 100);
  };

  const stopProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      // Apply volume amplification
      const amplifiedVolume = (newVolume * volumeAmplification) / 100;
      soundRef.current.volume(amplifiedVolume);
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  // Update volume when amplification changes
  useEffect(() => {
    if (soundRef.current && !isMuted) {
      const amplifiedVolume = (volume * volumeAmplification) / 100;
      soundRef.current.volume(amplifiedVolume);
    }
  }, [volumeAmplification]);

  const toggleMute = () => {
    if (soundRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      soundRef.current.volume(newMutedState ? 0 : volume);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (soundRef.current && currentTrack) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      const newTime = percent * currentTrack.duration;
      soundRef.current.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&h=80&auto=format&fit=crop&q=60";

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-neutral-900 to-neutral-900/95 backdrop-blur-xl border-t border-neutral-800/50 px-6 py-4 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        {/* Album Art & Track Info */}
        <div className="flex items-center gap-4 min-w-[280px]">
          <div className="relative group">
            <img
              src={currentTrack.coverArt || defaultCover}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-lg object-cover shadow-lg ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate hover:text-purple-400 transition-colors cursor-default">
              {currentTrack.title}
            </div>
            <div className="text-xs text-neutral-400 truncate hover:text-neutral-300 transition-colors cursor-default">
              {currentTrack.artist}
            </div>
            {currentTrack.album && (
              <div className="text-xs text-neutral-500 truncate">
                {currentTrack.album}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="flex items-center gap-6">
            <button
              onClick={onPrevious}
              className="text-neutral-400 hover:text-white hover:scale-110 transition-all duration-200 active:scale-95"
              title="Previous"
            >
              <IconPlayerSkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-3 hover:scale-110 transition-all duration-200 active:scale-95 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <IconPlayerPause className="w-7 h-7" />
              ) : (
                <IconPlayerPlay className="w-7 h-7" />
              )}
            </button>
            <button
              onClick={onNext}
              className="text-neutral-400 hover:text-white hover:scale-110 transition-all duration-200 active:scale-95"
              title="Next"
            >
              <IconPlayerSkipForward className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xl flex items-center gap-3">
            <span className="text-xs font-medium text-neutral-400 w-12 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-1.5 bg-neutral-700/50 rounded-full cursor-pointer group relative overflow-hidden"
              onClick={handleProgressClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative transition-all duration-150"
                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ring-4 ring-purple-500/30" />
              </div>
            </div>
            <span className="text-xs font-medium text-neutral-400 w-12 tabular-nums">
              {formatTime(currentTrack.duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white hover:scale-110 transition-all duration-200 active:scale-95"
          >
            {isMuted || volume === 0 ? (
              <IconVolumeOff className="w-5 h-5" />
            ) : (
              <IconVolume className="w-5 h-5" />
            )}
          </button>
          <div className="relative group flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-neutral-700/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:ring-4 [&::-webkit-slider-thumb]:ring-purple-500/0 hover:[&::-webkit-slider-thumb]:ring-purple-500/30"
              style={{
                background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(236, 72, 153) ${(isMuted ? 0 : volume) * 100}%, rgb(64, 64, 64) ${(isMuted ? 0 : volume) * 100}%, rgb(64, 64, 64) 100%)`
              }}
            />
          </div>
          <span className="text-xs font-medium text-neutral-500 w-8 tabular-nums">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
