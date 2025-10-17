"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import type { MusicFile } from "@/electron/electron.d";
import { StatsManager } from "@/lib/music-library";
import { useTheme } from "@/contexts/ThemeContext";
import Equalizer from "./equalizer";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconVolume,
  IconVolumeOff,
  IconGauge,
} from "@tabler/icons-react";

interface MusicPlayerProps {
  currentTrack: MusicFile | null;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MusicPlayer({ currentTrack, onNext, onPrevious }: MusicPlayerProps) {
  const { playerStyle } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeAmplification, setVolumeAmplification] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load volume amplification from localStorage
  useEffect(() => {
    const savedAmplification = localStorage.getItem('volumeAmplification');
    if (savedAmplification) {
      setVolumeAmplification(parseInt(savedAmplification));
    }

    const savedSpeed = localStorage.getItem('playbackSpeed');
    if (savedSpeed) {
      setPlaybackSpeed(parseFloat(savedSpeed));
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
        volume: Math.min(1.0, (volume * volumeAmplification) / 100),
        rate: playbackSpeed,
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
  }, [currentTrack, volume, volumeAmplification, playbackSpeed]);

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
      // Apply volume amplification, clamped to max 1.0
      const amplifiedVolume = Math.min(1.0, (newVolume * volumeAmplification) / 100);
      soundRef.current.volume(amplifiedVolume);
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  // Update volume when amplification changes
  useEffect(() => {
    if (soundRef.current && !isMuted) {
      const amplifiedVolume = Math.min(1.0, (volume * volumeAmplification) / 100);
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

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    localStorage.setItem('playbackSpeed', speed.toString());
    if (soundRef.current) {
      soundRef.current.rate(speed);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&h=80&auto=format&fit=crop&q=60";

  // Get player style classes
  const getPlayerClasses = () => {
    switch (playerStyle) {
      case 'minimal':
        return 'py-2 bg-black/95';
      case 'compact':
        return 'py-3 bg-neutral-950';
      case 'expanded':
        return 'py-8 bg-gradient-to-t from-purple-950/30 via-black to-black';
      case 'glassmorphism':
        return 'py-4 backdrop-blur-3xl bg-white/5 border-t-2 border-white/10';
      case 'neon':
        return 'py-4 bg-black shadow-[0_-5px_50px_rgba(139,92,246,0.5)] border-t-2 border-purple-500';
      case 'retro':
        return 'py-5 bg-gradient-to-r from-purple-900 via-pink-800 to-orange-700 border-t-4 border-cyan-400';
      case 'material':
        return 'py-4 bg-neutral-900 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]';
      case 'neumorphism':
        return 'py-5 bg-neutral-800 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(255,255,255,0.1)]';
      case 'brutalist':
        return 'py-4 bg-white text-black border-t-8 border-black';
      case 'vinyl':
        return 'py-5 bg-gradient-to-b from-amber-900 to-amber-950 border-t-4 border-amber-600';
      case 'futuristic':
        return 'py-4 bg-gradient-to-t from-cyan-950 via-blue-950 to-black border-t-2 border-cyan-400 shadow-[0_-5px_30px_rgba(0,255,255,0.3)]';
      case 'minimalist-pro':
        return 'py-2 bg-white border-t border-gray-200';
      case 'ambient':
        return 'py-6 bg-gradient-to-t from-indigo-950/40 via-purple-950/20 to-transparent backdrop-blur-2xl';
      case 'disco':
        return 'py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 animate-gradient-x';
      case 'terminal':
        return 'py-3 bg-black border-t-2 border-green-500 font-mono';
      default:
        return 'py-4 bg-gradient-to-t from-black via-neutral-900 to-neutral-900/95';
    }
  };

  const getAlbumArtClasses = () => {
    const baseClasses = {
      'minimal': 'w-10 h-10',
      'compact': 'w-14 h-14',
      'expanded': 'w-24 h-24',
      'vinyl': `w-20 h-20 rounded-full border-4 border-amber-700 ${isPlaying ? 'animate-spin-slow' : ''}`,
      'neon': 'w-16 h-16 shadow-[0_0_30px_rgba(139,92,246,0.8)] ring-4 ring-purple-500',
      'brutalist': 'w-16 h-16 border-4 border-black',
      'glassmorphism': 'w-16 h-16 ring-2 ring-white/30',
      'retro': 'w-16 h-16 border-2 border-cyan-400',
      'terminal': 'w-12 h-12 border border-green-500',
      'futuristic': 'w-16 h-16 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]',
      'minimalist-pro': 'w-14 h-14 rounded-sm',
    };
    return baseClasses[playerStyle as keyof typeof baseClasses] || 'w-16 h-16';
  };

  const getTextColor = () => {
    switch (playerStyle) {
      case 'brutalist':
        return 'text-black';
      case 'minimalist-pro':
        return 'text-neutral-900';
      case 'terminal':
        return 'text-green-400';
      case 'retro':
        return 'text-cyan-200';
      default:
        return 'text-white';
    }
  };

  const getSecondaryTextColor = () => {
    switch (playerStyle) {
      case 'brutalist':
        return 'text-neutral-700';
      case 'minimalist-pro':
        return 'text-neutral-600';
      case 'terminal':
        return 'text-green-600';
      case 'retro':
        return 'text-cyan-400';
      default:
        return 'text-neutral-400';
    }
  };

  const getPlayButtonClasses = () => {
    switch (playerStyle) {
      case 'neon':
        return 'bg-purple-500 hover:bg-purple-600 shadow-[0_0_40px_rgba(139,92,246,1)] ring-4 ring-purple-400';
      case 'retro':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 shadow-[0_0_20px_rgba(236,72,153,0.8)]';
      case 'brutalist':
        return 'bg-black text-white hover:bg-neutral-800 border-4 border-white rounded-none';
      case 'glassmorphism':
        return 'bg-white/30 backdrop-blur-xl border-2 border-white/50 hover:bg-white/40 shadow-lg';
      case 'minimal':
        return 'bg-neutral-800 hover:bg-neutral-700 text-white shadow-sm';
      case 'vinyl':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-xl';
      case 'futuristic':
        return 'bg-cyan-500 hover:bg-cyan-600 text-black shadow-[0_0_30px_rgba(0,255,255,0.8)] ring-2 ring-cyan-400';
      case 'terminal':
        return 'bg-green-500 hover:bg-green-600 text-black font-mono rounded-none';
      case 'disco':
        return 'bg-white text-purple-600 hover:bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.8)]';
      case 'minimalist-pro':
        return 'bg-black text-white hover:bg-neutral-800 rounded-full shadow-md';
      default:
        return 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
    }
  };

  if (!currentTrack) {
    return null;
  }

  // Check if current style is coming soon
  const comingSoonStyles = ['aqua', 'cosmic', 'paper', 'holographic'];
  const isComingSoon = comingSoonStyles.includes(playerStyle);

  return (
    <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t border-neutral-800/50 px-6 z-50 shadow-2xl ${getPlayerClasses()} relative`}>
      {isComingSoon && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">🚧 Coming Soon 🚧</div>
            <div className="text-sm text-neutral-400">This player style is under development</div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        {/* Album Art & Track Info */}
        <div className="flex items-center gap-4 min-w-[280px]">
          <div className="relative group">
            <img
              src={currentTrack.coverArt || defaultCover}
              alt={currentTrack.title}
              className={`${getAlbumArtClasses()} rounded-lg object-cover shadow-lg ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300`}
              onError={(e) => {
                console.log('Cover art failed to load in player for:', currentTrack.title);
                (e.target as HTMLImageElement).src = defaultCover;
              }}
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
              className={`${getPlayButtonClasses()} text-white rounded-full p-3 hover:scale-110 transition-all duration-200 active:scale-95 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50`}
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

        {/* Speed Control & Equalizer */}
        <div className="flex items-center gap-2">
          {/* Playback Speed Control */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedControl(!showSpeedControl)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: playbackSpeed !== 1.0 ? 'var(--color-primary)' : 'var(--bg-secondary)',
                color: playbackSpeed !== 1.0 ? 'white' : 'var(--text-primary)',
              }}
              title="Playback Speed"
            >
              <IconGauge className="w-4 h-4" />
              <span>{playbackSpeed.toFixed(1)}x</span>
            </button>
            {showSpeedControl && (
              <div
                className="absolute bottom-full right-0 mb-2 p-3 rounded-lg shadow-xl border z-50"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  width: '180px',
                }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Playback Speed
                </p>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        handleSpeedChange(speed);
                        setShowSpeedControl(false);
                      }}
                      className="px-2 py-1 rounded text-xs font-medium transition-all"
                      style={{
                        backgroundColor: playbackSpeed === speed ? 'var(--color-primary)' : 'var(--bg-secondary)',
                        color: playbackSpeed === speed ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="2.0"
                  step="0.05"
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-700/50 rounded-full appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Equalizer */}
          <Equalizer />
        </div>
      </div>
    </div>
  );
}
