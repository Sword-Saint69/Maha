'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import type { MusicFile, SmartPlaylistCriteria } from '@/electron/electron.d';
import { PlaylistManager } from '@/lib/music-library';
import { IconWand, IconCheck, IconX, IconPlus } from '@tabler/icons-react';

interface SmartPlaylistGeneratorProps {
  allTracks: MusicFile[];
  onPlaylistCreated?: () => void;
}

export default function SmartPlaylistGenerator({ allTracks, onPlaylistCreated }: SmartPlaylistGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [criteria, setCriteria] = useState<SmartPlaylistCriteria>({});
  const [showPreview, setShowPreview] = useState(false);

  // Extract unique values for filters
  const { genres, artists, years } = useMemo(() => {
    const genresSet = new Set<string>();
    const artistsSet = new Set<string>();
    const yearsSet = new Set<number>();

    allTracks.forEach((track) => {
      if (track.genre) genresSet.add(track.genre);
      artistsSet.add(track.artist);
      if (track.year) yearsSet.add(track.year);
    });

    return {
      genres: Array.from(genresSet).sort(),
      artists: Array.from(artistsSet).sort(),
      years: Array.from(yearsSet).sort((a, b) => b - a),
    };
  }, [allTracks]);

  // Preview matching tracks
  const matchingTracks = useMemo(() => {
    return PlaylistManager['filterTracksByCriteria'](allTracks, criteria);
  }, [allTracks, criteria]);

  const handleGenreToggle = (genre: string) => {
    setCriteria((prev) => {
      const currentGenres = prev.genre || [];
      const newGenres = currentGenres.includes(genre)
        ? currentGenres.filter((g) => g !== genre)
        : [...currentGenres, genre];
      return { ...prev, genre: newGenres.length > 0 ? newGenres : undefined };
    });
  };

  const handleArtistToggle = (artist: string) => {
    setCriteria((prev) => {
      const currentArtists = prev.artist || [];
      const newArtists = currentArtists.includes(artist)
        ? currentArtists.filter((a) => a !== artist)
        : [...currentArtists, artist];
      return { ...prev, artist: newArtists.length > 0 ? newArtists : undefined };
    });
  };

  const handleYearToggle = (year: number) => {
    setCriteria((prev) => {
      const currentYears = prev.year || [];
      const newYears = currentYears.includes(year)
        ? currentYears.filter((y) => y !== year)
        : [...currentYears, year];
      return { ...prev, year: newYears.length > 0 ? newYears : undefined };
    });
  };

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }

    if (matchingTracks.length === 0) {
      alert('No tracks match your criteria');
      return;
    }

    PlaylistManager.generateSmartPlaylist(playlistName, criteria, allTracks);
    alert(`Smart playlist "${playlistName}" created with ${matchingTracks.length} tracks!`);
    
    // Reset form
    setPlaylistName('');
    setCriteria({});
    setIsOpen(false);
    
    if (onPlaylistCreated) {
      onPlaylistCreated();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Smart Playlist Generator
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Create playlists based on genre, artist, play count, and more
        </p>
      </div>

      {/* Playlist Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Playlist Name
        </label>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="My Smart Playlist"
          className="w-full px-4 py-3 rounded-lg border text-base outline-none transition-all"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Criteria Sections */}
      <div className="space-y-6 mb-6">
        {/* Genre Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: criteria.genre?.includes(genre) ? 'var(--color-primary)' : 'var(--bg-secondary)',
                  color: criteria.genre?.includes(genre) ? 'white' : 'var(--text-primary)',
                }}
              >
                {genre}
                {criteria.genre?.includes(genre) && <IconCheck className="inline-block ml-1 w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Artist Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Artists
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-1 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {artists.map((artist) => (
              <label key={artist} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-neutral-700/30 transition-colors">
                <input
                  type="checkbox"
                  checked={criteria.artist?.includes(artist) || false}
                  onChange={() => handleArtistToggle(artist)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span style={{ color: 'var(--text-primary)' }}>{artist}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Years
          </h3>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearToggle(year)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: criteria.year?.includes(year) ? 'var(--color-primary)' : 'var(--bg-secondary)',
                  color: criteria.year?.includes(year) ? 'white' : 'var(--text-primary)',
                }}
              >
                {year}
                {criteria.year?.includes(year) && <IconCheck className="inline-block ml-1 w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Play Count Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Min Play Count
            </label>
            <input
              type="number"
              min="0"
              value={criteria.minPlayCount || ''}
              onChange={(e) => setCriteria({ ...criteria, minPlayCount: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="0"
              className="w-full px-4 py-2 rounded-lg border text-base outline-none"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Max Play Count
            </label>
            <input
              type="number"
              min="0"
              value={criteria.maxPlayCount || ''}
              onChange={(e) => setCriteria({ ...criteria, maxPlayCount: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Unlimited"
              className="w-full px-4 py-2 rounded-lg border text-base outline-none"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Limit */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Limit (Number of tracks)
          </label>
          <input
            type="number"
            min="1"
            value={criteria.limit || ''}
            onChange={(e) => setCriteria({ ...criteria, limit: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="No limit"
            className="w-full px-4 py-2 rounded-lg border text-base outline-none"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Preview & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div style={{ color: 'var(--text-secondary)' }}>
          <IconWand className="inline-block w-5 h-5 mr-2" />
          {matchingTracks.length} track{matchingTracks.length !== 1 ? 's' : ''} match your criteria
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          <button
            onClick={handleCreatePlaylist}
            disabled={!playlistName.trim() || matchingTracks.length === 0}
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
            }}
          >
            <IconPlus className="inline-block w-4 h-4 mr-1" />
            Create Playlist
          </button>
        </div>
      </div>

      {/* Preview List */}
      {showPreview && matchingTracks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-lg p-4 max-h-96 overflow-y-auto"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Preview
          </h4>
          <div className="space-y-2">
            {matchingTracks.slice(0, 50).map((track) => (
              <div key={track.filePath} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <img
                  src={track.coverArt || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=40&h=40&auto=format&fit=crop&q=60"}
                  alt={track.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {track.title}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {track.artist}
                  </div>
                </div>
              </div>
            ))}
            {matchingTracks.length > 50 && (
              <p className="text-xs text-center pt-2" style={{ color: 'var(--text-secondary)' }}>
                ... and {matchingTracks.length - 50} more tracks
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
