'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import type { MusicFile } from '@/electron/electron.d';
import { IconPlayerPlay, IconDisc } from '@tabler/icons-react';

interface Album {
  name: string;
  artist: string;
  tracks: MusicFile[];
  coverArt: string | null;
  year: number | null;
  totalDuration: number;
}

interface AlbumsPageProps {
  allTracks: MusicFile[];
  onPlayTrack: (track: MusicFile) => void;
  onPlayAlbum?: (tracks: MusicFile[]) => void;
}

export default function AlbumsPage({ allTracks, onPlayTrack, onPlayAlbum }: AlbumsPageProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group tracks by album
  const albums = useMemo(() => {
    const albumMap = new Map<string, Album>();

    allTracks.forEach((track) => {
      const albumKey = `${track.album}-${track.artist}`;
      
      if (!albumMap.has(albumKey)) {
        albumMap.set(albumKey, {
          name: track.album,
          artist: track.artist,
          tracks: [],
          coverArt: track.coverArt,
          year: track.year,
          totalDuration: 0,
        });
      }

      const album = albumMap.get(albumKey)!;
      album.tracks.push(track);
      album.totalDuration += track.duration;
    });

    return Array.from(albumMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allTracks]);

  // Filter albums by search query
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return albums;
    
    const query = searchQuery.toLowerCase();
    return albums.filter(
      (album) =>
        album.name.toLowerCase().includes(query) ||
        album.artist.toLowerCase().includes(query)
    );
  }, [albums, searchQuery]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&auto=format&fit=crop&q=60";

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Albums
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {albums.length} album{albums.length !== 1 ? 's' : ''} in your library
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-base outline-none transition-all"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {selectedAlbum ? (
        /* Album Detail View */
        <div>
          <button
            onClick={() => setSelectedAlbum(null)}
            className="mb-6 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to Albums
          </button>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Album Cover */}
            <div className="flex-shrink-0">
              <img
                src={selectedAlbum.coverArt || defaultCover}
                alt={selectedAlbum.name}
                className="w-64 h-64 rounded-lg shadow-2xl object-cover"
              />
            </div>

            {/* Album Info */}
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {selectedAlbum.name}
              </h2>
              <p className="text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
                {selectedAlbum.artist}
              </p>
              <div className="flex items-center gap-4 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                {selectedAlbum.year && <span>{selectedAlbum.year}</span>}
                <span>{selectedAlbum.tracks.length} track{selectedAlbum.tracks.length !== 1 ? 's' : ''}</span>
                <span>{formatTime(selectedAlbum.totalDuration)}</span>
              </div>

              {/* Play Album Button */}
              {onPlayAlbum && (
                <button
                  onClick={() => onPlayAlbum(selectedAlbum.tracks)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <IconPlayerPlay className="w-5 h-5" />
                  Play Album
                </button>
              )}
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            {selectedAlbum.tracks.map((track, index) => (
              <motion.div
                key={track.filePath}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                {/* Track Number */}
                <div className="w-8 text-center">
                  <span className="text-sm font-medium group-hover:hidden" style={{ color: 'var(--text-secondary)' }}>
                    {index + 1}
                  </span>
                  <button
                    onClick={() => onPlayTrack(track)}
                    className="hidden group-hover:block text-neutral-400 hover:text-white transition-colors"
                  >
                    <IconPlayerPlay className="w-5 h-5" />
                  </button>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {track.title}
                  </div>
                  {track.artist !== selectedAlbum.artist && (
                    <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {track.artist}
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {formatTime(track.duration)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Albums Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredAlbums.map((album, index) => (
            <motion.div
              key={`${album.name}-${album.artist}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="group cursor-pointer"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="relative mb-3 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={album.coverArt || defaultCover}
                  alt={album.name}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <IconPlayerPlay className="w-7 h-7 text-white ml-1" />
                  </div>
                </div>
              </div>

              <h3 className="font-semibold truncate mb-1" style={{ color: 'var(--text-primary)' }}>
                {album.name}
              </h3>
              <p className="text-sm truncate mb-1" style={{ color: 'var(--text-secondary)' }}>
                {album.artist}
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <IconDisc className="w-3 h-3" />
                <span>{album.tracks.length} track{album.tracks.length !== 1 ? 's' : ''}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredAlbums.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            No albums found
          </p>
        </div>
      )}
    </div>
  );
}
