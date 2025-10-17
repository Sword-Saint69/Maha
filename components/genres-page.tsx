'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import type { MusicFile } from '@/electron/electron.d';
import { IconPlayerPlay, IconMusic } from '@tabler/icons-react';

interface Genre {
  name: string;
  tracks: MusicFile[];
  artists: Set<string>;
  albums: Set<string>;
}

interface GenresPageProps {
  allTracks: MusicFile[];
  onPlayTrack: (track: MusicFile) => void;
  onPlayGenre?: (tracks: MusicFile[]) => void;
}

export default function GenresPage({ allTracks, onPlayTrack, onPlayGenre }: GenresPageProps) {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group tracks by genre
  const genres = useMemo(() => {
    const genreMap = new Map<string, Genre>();

    allTracks.forEach((track) => {
      const genreName = track.genre || 'Unknown';
      
      if (!genreMap.has(genreName)) {
        genreMap.set(genreName, {
          name: genreName,
          tracks: [],
          artists: new Set(),
          albums: new Set(),
        });
      }

      const genre = genreMap.get(genreName)!;
      genre.tracks.push(track);
      genre.artists.add(track.artist);
      genre.albums.add(track.album);
    });

    return Array.from(genreMap.values()).sort((a, b) => b.tracks.length - a.tracks.length);
  }, [allTracks]);

  // Filter genres by search query
  const filteredGenres = useMemo(() => {
    if (!searchQuery.trim()) return genres;
    
    const query = searchQuery.toLowerCase();
    return genres.filter((genre) => genre.name.toLowerCase().includes(query));
  }, [genres, searchQuery]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultCover = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&auto=format&fit=crop&q=60";

  // Genre colors for visual variety
  const genreColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-green-500',
    'from-yellow-500 to-orange-500',
  ];

  const getGenreColor = (index: number) => genreColors[index % genreColors.length];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Genres
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {genres.length} genre{genres.length !== 1 ? 's' : ''} in your library
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search genres..."
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

      {selectedGenre ? (
        /* Genre Detail View */
        <div>
          <button
            onClick={() => setSelectedGenre(null)}
            className="mb-6 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Back to Genres
          </button>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Genre Visual */}
            <div className="flex-shrink-0">
              <div className={`w-64 h-64 rounded-lg shadow-2xl bg-gradient-to-br ${getGenreColor(genres.indexOf(selectedGenre))} flex items-center justify-center`}>
                <IconMusic className="w-32 h-32 text-white/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-4xl font-bold text-white text-center px-4">
                    {selectedGenre.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Genre Info */}
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {selectedGenre.name}
              </h2>
              <div className="flex items-center gap-4 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                <span>{selectedGenre.tracks.length} track{selectedGenre.tracks.length !== 1 ? 's' : ''}</span>
                <span>{selectedGenre.artists.size} artist{selectedGenre.artists.size !== 1 ? 's' : ''}</span>
                <span>{selectedGenre.albums.size} album{selectedGenre.albums.size !== 1 ? 's' : ''}</span>
              </div>

              {/* Play All Button */}
              {onPlayGenre && (
                <button
                  onClick={() => onPlayGenre(selectedGenre.tracks)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <IconPlayerPlay className="w-5 h-5" />
                  Play All
                </button>
              )}
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            {selectedGenre.tracks.map((track, index) => (
              <motion.div
                key={track.filePath}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                {/* Album Art */}
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 relative">
                  <img
                    src={track.coverArt || defaultCover}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onPlayTrack(track)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <IconPlayerPlay className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
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
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Genres Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGenres.map((genre, index) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="group cursor-pointer"
              onClick={() => setSelectedGenre(genre)}
            >
              <div className={`relative overflow-hidden rounded-lg shadow-lg h-48 bg-gradient-to-br ${getGenreColor(index)} p-6 transition-transform duration-300 group-hover:scale-105`}>
                {/* Background Icon */}
                <IconMusic className="absolute bottom-4 right-4 w-24 h-24 text-white/10" />
                
                {/* Genre Info */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {genre.tracks.length} track{genre.tracks.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    {genre.artists.size} artist{genre.artists.size !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Play Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <IconPlayerPlay className="w-6 h-6 text-white ml-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredGenres.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            No genres found
          </p>
        </div>
      )}
    </div>
  );
}
