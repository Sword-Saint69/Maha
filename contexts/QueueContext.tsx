"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MusicFile, PlaybackState } from '@/electron/electron.d';

interface QueueContextType {
  queue: MusicFile[];
  currentIndex: number;
  currentTrack: MusicFile | null;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  playbackSpeed: number;
  originalQueue: MusicFile[]; // For shuffle
  
  // Queue actions
  setQueue: (tracks: MusicFile[], startIndex?: number) => void;
  addToQueue: (tracks: MusicFile | MusicFile[]) => void;
  playNext: (tracks: MusicFile | MusicFile[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  
  // Playback controls
  playTrack: (track: MusicFile) => void;
  playTrackAt: (index: number) => void;
  next: () => void;
  previous: () => void;
  
  // Playback settings
  toggleShuffle: () => void;
  setRepeat: (mode: 'none' | 'one' | 'all') => void;
  setPlaybackSpeed: (speed: number) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueueState] = useState<MusicFile[]>([]);
  const [originalQueue, setOriginalQueue] = useState<MusicFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeatState] = useState<'none' | 'one' | 'all'>('none');
  const [playbackSpeed, setPlaybackSpeedState] = useState(1.0);

  const currentTrack = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem('maha_queue_state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setQueueState(state.queue || []);
        setOriginalQueue(state.originalQueue || []);
        setCurrentIndex(state.currentIndex || -1);
        setShuffle(state.shuffle || false);
        setRepeatState(state.repeat || 'none');
        setPlaybackSpeedState(state.playbackSpeed || 1.0);
      } catch (e) {
        console.error('Failed to load queue state:', e);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    const state = {
      queue,
      originalQueue,
      currentIndex,
      shuffle,
      repeat,
      playbackSpeed,
    };
    localStorage.setItem('maha_queue_state', JSON.stringify(state));
  }, [queue, originalQueue, currentIndex, shuffle, repeat, playbackSpeed]);

  const shuffleArray = useCallback((array: MusicFile[]): MusicFile[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const setQueue = useCallback((tracks: MusicFile[], startIndex: number = 0) => {
    setOriginalQueue(tracks);
    if (shuffle) {
      const shuffled = shuffleArray(tracks);
      setQueueState(shuffled);
      setCurrentIndex(0);
    } else {
      setQueueState(tracks);
      setCurrentIndex(startIndex);
    }
  }, [shuffle, shuffleArray]);

  const addToQueue = useCallback((tracks: MusicFile | MusicFile[]) => {
    const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
    setQueueState(prev => [...prev, ...tracksArray]);
    setOriginalQueue(prev => [...prev, ...tracksArray]);
  }, []);

  const playNext = useCallback((tracks: MusicFile | MusicFile[]) => {
    const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
    setQueueState(prev => {
      const newQueue = [...prev];
      newQueue.splice(currentIndex + 1, 0, ...tracksArray);
      return newQueue;
    });
    setOriginalQueue(prev => {
      const newQueue = [...prev];
      newQueue.splice(currentIndex + 1, 0, ...tracksArray);
      return newQueue;
    });
  }, [currentIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueueState(prev => {
      const newQueue = [...prev];
      newQueue.splice(index, 1);
      return newQueue;
    });
    
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    } else if (index === currentIndex) {
      // Current track removed, don't change index (next track takes its place)
    }
  }, [currentIndex]);

  const clearQueue = useCallback(() => {
    setQueueState([]);
    setOriginalQueue([]);
    setCurrentIndex(-1);
  }, []);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueueState(prev => {
      const newQueue = [...prev];
      const [removed] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, removed);
      return newQueue;
    });

    // Update current index if needed
    if (fromIndex === currentIndex) {
      setCurrentIndex(toIndex);
    } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
      setCurrentIndex(prev => prev - 1);
    } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex]);

  const playTrack = useCallback((track: MusicFile) => {
    const index = queue.findIndex(t => t.filePath === track.filePath);
    if (index >= 0) {
      setCurrentIndex(index);
    } else {
      // Track not in queue, add it and play
      setQueueState(prev => [...prev, track]);
      setOriginalQueue(prev => [...prev, track]);
      setCurrentIndex(queue.length);
    }
  }, [queue]);

  const playTrackAt = useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
    }
  }, [queue.length]);

  const next = useCallback(() => {
    if (repeat === 'one') {
      // Stay on current track
      return;
    }
    
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (repeat === 'all') {
      setCurrentIndex(0);
    }
  }, [currentIndex, queue.length, repeat]);

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (repeat === 'all') {
      setCurrentIndex(queue.length - 1);
    }
  }, [currentIndex, queue.length, repeat]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const newShuffle = !prev;
      
      if (newShuffle) {
        // Turning shuffle on
        const currentTrack = queue[currentIndex];
        const remaining = queue.slice(currentIndex + 1);
        const shuffledRemaining = shuffleArray(remaining);
        
        const newQueue = currentTrack 
          ? [currentTrack, ...shuffledRemaining]
          : shuffleArray(queue);
          
        setQueueState(newQueue);
        setCurrentIndex(currentTrack ? 0 : -1);
      } else {
        // Turning shuffle off - restore original queue
        const currentTrack = queue[currentIndex];
        setQueueState(originalQueue);
        
        if (currentTrack) {
          const newIndex = originalQueue.findIndex(t => t.filePath === currentTrack.filePath);
          setCurrentIndex(newIndex >= 0 ? newIndex : 0);
        }
      }
      
      return newShuffle;
    });
  }, [queue, currentIndex, originalQueue, shuffleArray]);

  const setRepeat = useCallback((mode: 'none' | 'one' | 'all') => {
    setRepeatState(mode);
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
  }, []);

  const value: QueueContextType = {
    queue,
    currentIndex,
    currentTrack,
    shuffle,
    repeat,
    playbackSpeed,
    originalQueue,
    setQueue,
    addToQueue,
    playNext,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    playTrack,
    playTrackAt,
    next,
    previous,
    toggleShuffle,
    setRepeat,
    setPlaybackSpeed,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
