'use client';

import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import type { MusicFile } from '@/electron/electron.d';
import { 
  IconGripVertical, 
  IconX, 
  IconPlayerPlay,
  IconPlayerPause,
  IconTrash,
  IconPlaylistAdd,
  IconShuffle,
  IconRepeat,
} from '@tabler/icons-react';

interface QueuePageProps {
  queue: MusicFile[];
  currentIndex: number;
  isPlaying: boolean;
  onPlayTrack: (index: number) => void;
  onRemoveTrack: (index: number) => void;
  onClearQueue: () => void;
  onReorder: (newQueue: MusicFile[]) => void;
  onSaveAsPlaylist?: () => void;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export default function QueuePage({
  queue,
  currentIndex,
  isPlaying,
  onPlayTrack,
  onRemoveTrack,
  onClearQueue,
  onReorder,
  onSaveAsPlaylist,
  shuffle,
  repeat,
  onToggleShuffle,
  onToggleRepeat,
}: QueuePageProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = queue.reduce((sum, track) => sum + track.duration, 0);
  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&h=80&auto=format&fit=crop&q=60";

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Play Queue
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {queue.length} track{queue.length !== 1 ? 's' : ''} · {formatTime(totalDuration)} total
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={onToggleShuffle}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: shuffle ? 'var(--color-primary)' : 'var(--bg-secondary)',
            color: shuffle ? 'white' : 'var(--text-primary)',
          }}
        >
          <IconShuffle className="w-4 h-4" />
          Shuffle {shuffle && '(On)'}
        </button>

        <button
          onClick={onToggleRepeat}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: repeat !== 'none' ? 'var(--color-primary)' : 'var(--bg-secondary)',
            color: repeat !== 'none' ? 'white' : 'var(--text-primary)',
          }}
        >
          <IconRepeat className="w-4 h-4" />
          {repeat === 'none' ? 'Repeat Off' : repeat === 'one' ? 'Repeat One' : 'Repeat All'}
        </button>

        {onSaveAsPlaylist && queue.length > 0 && (
          <button
            onClick={onSaveAsPlaylist}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          >
            <IconPlaylistAdd className="w-4 h-4" />
            Save as Playlist
          </button>
        )}

        {queue.length > 0 && (
          <button
            onClick={onClearQueue}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ml-auto"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          >
            <IconTrash className="w-4 h-4" />
            Clear Queue
          </button>
        )}
      </div>

      {/* Queue List */}
      {queue.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Queue is empty
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Add some tracks to get started
          </p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={queue}
          onReorder={onReorder}
          className="space-y-2"
        >
          {queue.map((track, index) => (
            <Reorder.Item
              key={track.filePath}
              value={track}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                layout
                className="flex items-center gap-4 p-4 rounded-lg transition-all"
                style={{
                  backgroundColor: index === currentIndex ? 'var(--color-primary)/20' : 'var(--bg-card)',
                  borderLeft: index === currentIndex ? '4px solid var(--color-primary)' : '4px solid transparent',
                }}
              >
                {/* Drag Handle */}
                <button
                  className="cursor-grab active:cursor-grabbing"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <IconGripVertical className="w-5 h-5" />
                </button>

                {/* Track Number / Play Button */}
                <div className="w-8 text-center">
                  {hoveredIndex === index || index === currentIndex ? (
                    <button
                      onClick={() => onPlayTrack(index)}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {index === currentIndex && isPlaying ? (
                        <IconPlayerPause className="w-5 h-5" />
                      ) : (
                        <IconPlayerPlay className="w-5 h-5" />
                      )}
                    </button>
                  ) : (
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Album Art */}
                <img
                  src={track.coverArt || defaultCover}
                  alt={track.title}
                  className="w-12 h-12 rounded object-cover"
                />

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold truncate"
                    style={{
                      color: index === currentIndex ? 'var(--color-primary)' : 'var(--text-primary)',
                    }}
                  >
                    {track.title}
                  </div>
                  <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {track.artist}
                  </div>
                </div>

                {/* Album */}
                <div className="hidden md:block w-48 truncate text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {track.album}
                </div>

                {/* Duration */}
                <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {formatTime(track.duration)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveTrack(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/20"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <IconX className="w-5 h-5" />
                </button>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
