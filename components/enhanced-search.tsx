'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { MusicFile, SearchFilters, SortOptions } from '@/electron/electron.d';
import { MusicSearch, SearchHistory } from '@/lib/music-library';
import { 
  IconFilter, 
  IconX, 
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconHistory,
  IconClock,
} from '@tabler/icons-react';

interface EnhancedSearchProps {
  allTracks: MusicFile[];
  onSearchResults: (tracks: MusicFile[]) => void;
}

export default function EnhancedSearch({ allTracks, onSearchResults }: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'title', order: 'asc' });
  const [searchHistory, setSearchHistory] = useState<string[]>(SearchHistory.getHistory());

  // Extract unique values for filters
  const { genres, artists, albums, years } = useMemo(() => {
    const genresSet = new Set<string>();
    const artistsSet = new Set<string>();
    const albumsSet = new Set<string>();
    const yearsSet = new Set<number>();

    allTracks.forEach((track) => {
      if (track.genre) genresSet.add(track.genre);
      artistsSet.add(track.artist);
      albumsSet.add(track.album);
      if (track.year) yearsSet.add(track.year);
    });

    return {
      genres: Array.from(genresSet).sort(),
      artists: Array.from(artistsSet).sort(),
      albums: Array.from(albumsSet).sort(),
      years: Array.from(yearsSet).sort((a, b) => b - a),
    };
  }, [allTracks]);

  // Perform search and filter
  const performSearch = (query: string, currentFilters: SearchFilters, sortOpts: SortOptions) => {
    let results = MusicSearch.searchTracks(allTracks, query, currentFilters);
    results = MusicSearch.sortTracks(results, sortOpts);
    onSearchResults(results);

    // Add to history if query is not empty
    if (query.trim()) {
      SearchHistory.addSearch(query);
      setSearchHistory(SearchHistory.getHistory());
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    performSearch(value, filters, sortOptions);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    performSearch(searchQuery, newFilters, sortOptions);
  };

  const handleSortChange = (newSort: SortOptions) => {
    setSortOptions(newSort);
    performSearch(searchQuery, filters, newSort);
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
    performSearch(query, filters, sortOptions);
  };

  const clearFilters = () => {
    setFilters({});
    performSearch(searchQuery, {}, sortOptions);
  };

  const clearHistory = () => {
    SearchHistory.clearHistory();
    setSearchHistory([]);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)).length;

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder="Search songs, artists, albums..."
            className="w-full pl-12 pr-32 py-2.5 rounded-lg border border-neutral-800 bg-black text-white text-sm outline-none transition-all placeholder:text-neutral-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="p-2 rounded-lg hover:bg-neutral-700/30 transition-colors"
              >
                <IconX className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: showFilters || activeFilterCount > 0 ? 'var(--color-primary)' : 'var(--bg-card)',
                color: showFilters || activeFilterCount > 0 ? 'white' : 'var(--text-primary)',
              }}
            >
              <IconFilter className="w-4 h-4" />
              {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        {/* Search History Dropdown */}
        <AnimatePresence>
          {showHistory && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg shadow-xl border z-50"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
              onMouseLeave={() => setShowHistory(false)}
            >
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <IconHistory className="w-4 h-4" />
                  Recent Searches
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Clear
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(query)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-700/30 transition-colors text-left"
                  >
                    <IconClock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{query}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-6 rounded-lg border space-y-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Filters & Sort
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Clear All Filters
              </button>
            </div>

            {/* Sort Options */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Sort By
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { field: 'title' as const, label: 'Title' },
                  { field: 'artist' as const, label: 'Artist' },
                  { field: 'album' as const, label: 'Album' },
                  { field: 'duration' as const, label: 'Duration' },
                  { field: 'year' as const, label: 'Year' },
                  { field: 'playCount' as const, label: 'Play Count' },
                ].map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => {
                      const newOrder = sortOptions.field === field && sortOptions.order === 'asc' ? 'desc' : 'asc';
                      handleSortChange({ field, order: newOrder });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: sortOptions.field === field ? 'var(--color-primary)' : 'var(--bg-secondary)',
                      color: sortOptions.field === field ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {label}
                    {sortOptions.field === field && (
                      sortOptions.order === 'asc' ? 
                        <IconSortAscending className="w-4 h-4" /> : 
                        <IconSortDescending className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Genre
              </h4>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 15).map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      const currentGenres = filters.genre || [];
                      const newGenres = currentGenres.includes(genre)
                        ? currentGenres.filter(g => g !== genre)
                        : [...currentGenres, genre];
                      handleFilterChange({ ...filters, genre: newGenres.length > 0 ? newGenres : undefined });
                    }}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: filters.genre?.includes(genre) ? 'var(--color-primary)' : 'var(--bg-secondary)',
                      color: filters.genre?.includes(genre) ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Year
              </h4>
              <div className="flex flex-wrap gap-2">
                {years.slice(0, 10).map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      const currentYears = filters.year || [];
                      const newYears = currentYears.includes(year)
                        ? currentYears.filter(y => y !== year)
                        : [...currentYears, year];
                      handleFilterChange({ ...filters, year: newYears.length > 0 ? newYears : undefined });
                    }}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: filters.year?.includes(year) ? 'var(--color-primary)' : 'var(--bg-secondary)',
                      color: filters.year?.includes(year) ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Duration
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Min (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minDuration || ''}
                    onChange={(e) => handleFilterChange({ ...filters, minDuration: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Max (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxDuration || ''}
                    onChange={(e) => handleFilterChange({ ...filters, maxDuration: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
