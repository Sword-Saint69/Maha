'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import type { MusicFile } from '@/electron/electron.d';
import { IconPlayerPlay, IconDisc, IconMusic } from '@tabler/icons-react';

interface Artist {
  name: string;
  tracks: MusicFile[];
  albums: Map<string, MusicFile[]>;
  coverArt: string | null;
  totalDuration: number;
}

interface ArtistsPageProps {
  allTracks: MusicFile[];
  onPlayTrack: (track: MusicFile) => void;
  onPlayArtist?: (tracks: MusicFile[]) => void;
}

export default function ArtistsPage({ allTracks, onPlayTrack, onPlayArtist }: ArtistsPageProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group tracks by artist
  const artists = useMemo(() => {
    const artistMap = new Map<string, Artist>();

    allTracks.forEach((track) => {
      if (!artistMap.has(track.artist)) {
        artistMap.set(track.artist, {
          name: track.artist,
          tracks: [],
          albums: new Map(),
          coverArt: track.coverArt,
          totalDuration: 0,
        });
      }

      const artist = artistMap.get(track.artist)!;
      artist.tracks.push(track);
      artist.totalDuration += track.duration;

      // Group by album
      if (!artist.albums.has(track.album)) {
        artist.albums.set(track.album, []);
      }
      artist.albums.get(track.album)!.push(track);
    });

    return Array.from(artistMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allTracks]);

  // Filter artists by search query
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return artists;
    
    const query = searchQuery.toLowerCase();
    return artists.filter((artist) => artist.name.toLowerCase().includes(query));
  }, [artists, searchQuery]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultCover = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&auto=format&fit=crop&q=60";

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Artists
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {artists.length} artist{artists.length !== 1 ? 's' : ''} in your library
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search artists..."
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

      {selectedArtist ? (
        /* Artist Detail View */
        <div>
          <button
            onClick={() => setSelectedArtist(null)}
            className="mb-6 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to Artists
          </button>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Artist Image */}
            <div className="flex-shrink-0">
              <div className="w-64 h-64 rounded-full shadow-2xl overflow-hidden">
                <img
                  src={selectedArtist.coverArt || defaultCover}
                  alt={selectedArtist.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {selectedArtist.name}
              </h2>
              <div className="flex items-center gap-4 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                <span>{selectedArtist.albums.size} album{selectedArtist.albums.size !== 1 ? 's' : ''}</span>
                <span>{selectedArtist.tracks.length} track{selectedArtist.tracks.length !== 1 ? 's' : ''}</span>
                <span>{formatTime(selectedArtist.totalDuration)}</span>
              </div>

              {/* Play All Button */}
              {onPlayArtist && (
                <button
                  onClick={() => onPlayArtist(selectedArtist.tracks)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <IconPlayerPlay className="w-5 h-5" />
                  Play All
                </button>
              )}
            </div>
          </div>

          {/* Albums by this artist */}
          <div className="space-y-8">
            {Array.from(selectedArtist.albums.entries()).map(([albumName, albumTracks], albumIndex) => (
              <div key={albumName}>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={albumTracks[0].coverArt || defaultCover}
                    alt={albumName}
                    className="w-16 h-16 rounded-lg shadow-md object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {albumName}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {albumTracks[0].year && `${albumTracks[0].year} · `}
                      {albumTracks.length} track{albumTracks.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pl-20">
                  {albumTracks.map((track, trackIndex) => (
                    <motion.div
                      key={track.filePath}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (albumIndex * 0.1) + (trackIndex * 0.02) }}
                      className="group flex items-center gap-4 p-3 rounded-lg transition-all hover:scale-[1.01]"
                      style={{ backgroundColor: 'var(--bg-card)' }}
                    >
                      {/* Track Number */}
                      <div className="w-6 text-center">
                        <span className="text-sm font-medium group-hover:hidden" style={{ color: 'var(--text-secondary)' }}>
                          {trackIndex + 1}
                        </span>
                        <button
                          onClick={() => onPlayTrack(track)}
                          className="hidden group-hover:block text-neutral-400 hover:text-white transition-colors"
                        >
                          <IconPlayerPlay className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {track.title}
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {formatTime(track.duration)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Artists Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredArtists.map((artist, index) => (
            <motion.div
              key={artist.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="group cursor-pointer text-center"
              onClick={() => setSelectedArtist(artist)}
            >
              <div className="relative mb-3 overflow-hidden rounded-full shadow-lg">
                <img
                  src={artist.coverArt || defaultCover}
                  alt={artist.name}
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
                {artist.name}
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <IconMusic className="w-3 h-3" />
                <span>{artist.tracks.length} track{artist.tracks.length !== 1 ? 's' : ''}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredArtists.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            No artists found
          </p>
        </div>
      )}
    </div>
  );
}
