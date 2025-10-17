import type { MusicFile, Playlist, SmartPlaylistCriteria, MusicStats, SearchFilters, SortOptions } from '@/electron/electron.d';

// Playlist Management
export class PlaylistManager {
  private static STORAGE_KEY = 'maha_playlists';

  static getAllPlaylists(): Playlist[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getPlaylist(id: string): Playlist | null {
    const playlists = this.getAllPlaylists();
    return playlists.find(p => p.id === id) || null;
  }

  static createPlaylist(name: string, description?: string): Playlist {
    const playlist: Playlist = {
      id: crypto.randomUUID(),
      name,
      description,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const playlists = this.getAllPlaylists();
    playlists.push(playlist);
    this.savePlaylists(playlists);
    return playlist;
  }

  static updatePlaylist(id: string, updates: Partial<Playlist>): boolean {
    const playlists = this.getAllPlaylists();
    const index = playlists.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    playlists[index] = {
      ...playlists[index],
      ...updates,
      updatedAt: Date.now(),
    };
    
    this.savePlaylists(playlists);
    return true;
  }

  static deletePlaylist(id: string): boolean {
    const playlists = this.getAllPlaylists();
    const filtered = playlists.filter(p => p.id !== id);
    
    if (filtered.length === playlists.length) return false;
    
    this.savePlaylists(filtered);
    return true;
  }

  static addTracksToPlaylist(playlistId: string, trackPaths: string[]): boolean {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;
    
    const uniqueTracks = [...new Set([...playlist.tracks, ...trackPaths])];
    return this.updatePlaylist(playlistId, { tracks: uniqueTracks });
  }

  static removeTrackFromPlaylist(playlistId: string, trackPath: string): boolean {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;
    
    const tracks = playlist.tracks.filter(t => t !== trackPath);
    return this.updatePlaylist(playlistId, { tracks });
  }

  static reorderPlaylist(playlistId: string, fromIndex: number, toIndex: number): boolean {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;
    
    const tracks = [...playlist.tracks];
    const [removed] = tracks.splice(fromIndex, 1);
    tracks.splice(toIndex, 0, removed);
    
    return this.updatePlaylist(playlistId, { tracks });
  }

  private static savePlaylists(playlists: Playlist[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playlists));
  }

  // Smart Playlist Generation
  static generateSmartPlaylist(
    name: string,
    criteria: SmartPlaylistCriteria,
    allTracks: MusicFile[]
  ): Playlist {
    const filteredTracks = this.filterTracksByCriteria(allTracks, criteria);
    const trackPaths = filteredTracks.map(t => t.filePath);
    
    const playlist: Playlist = {
      id: crypto.randomUUID(),
      name,
      tracks: trackPaths,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSmart: true,
      smartCriteria: criteria,
    };
    
    const playlists = this.getAllPlaylists();
    playlists.push(playlist);
    this.savePlaylists(playlists);
    return playlist;
  }

  static updateSmartPlaylist(playlistId: string, allTracks: MusicFile[]): boolean {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist || !playlist.isSmart || !playlist.smartCriteria) return false;
    
    const filteredTracks = this.filterTracksByCriteria(allTracks, playlist.smartCriteria);
    const trackPaths = filteredTracks.map(t => t.filePath);
    
    return this.updatePlaylist(playlistId, { tracks: trackPaths });
  }

  private static filterTracksByCriteria(tracks: MusicFile[], criteria: SmartPlaylistCriteria): MusicFile[] {
    let filtered = [...tracks];
    
    if (criteria.genre?.length) {
      filtered = filtered.filter(t => t.genre && criteria.genre!.includes(t.genre));
    }
    
    if (criteria.artist?.length) {
      filtered = filtered.filter(t => criteria.artist!.includes(t.artist));
    }
    
    if (criteria.minPlayCount !== undefined) {
      filtered = filtered.filter(t => (t.playCount || 0) >= criteria.minPlayCount!);
    }
    
    if (criteria.maxPlayCount !== undefined) {
      filtered = filtered.filter(t => (t.playCount || 0) <= criteria.maxPlayCount!);
    }
    
    if (criteria.minRating !== undefined) {
      filtered = filtered.filter(t => (t.rating || 0) >= criteria.minRating!);
    }
    
    if (criteria.year?.length) {
      filtered = filtered.filter(t => t.year && criteria.year!.includes(t.year));
    }
    
    if (criteria.dateAddedAfter) {
      filtered = filtered.filter(t => (t.dateAdded || 0) >= criteria.dateAddedAfter!);
    }
    
    if (criteria.limit) {
      filtered = filtered.slice(0, criteria.limit);
    }
    
    return filtered;
  }

  // Export to M3U format
  static exportToM3U(playlist: Playlist, allTracks: MusicFile[]): string {
    const lines = ['#EXTM3U'];
    
    playlist.tracks.forEach(trackPath => {
      const track = allTracks.find(t => t.filePath === trackPath);
      if (track) {
        lines.push(`#EXTINF:${Math.floor(track.duration)},${track.artist} - ${track.title}`);
        lines.push(track.filePath);
      }
    });
    
    return lines.join('\n');
  }

  // Export to PLS format
  static exportToPLS(playlist: Playlist, allTracks: MusicFile[]): string {
    const lines = ['[playlist]'];
    
    playlist.tracks.forEach((trackPath, index) => {
      const track = allTracks.find(t => t.filePath === trackPath);
      if (track) {
        const num = index + 1;
        lines.push(`File${num}=${track.filePath}`);
        lines.push(`Title${num}=${track.artist} - ${track.title}`);
        lines.push(`Length${num}=${Math.floor(track.duration)}`);
      }
    });
    
    lines.push(`NumberOfEntries=${playlist.tracks.length}`);
    lines.push('Version=2');
    
    return lines.join('\n');
  }

  // Import from M3U
  static importFromM3U(content: string): string[] {
    const lines = content.split('\n').map(l => l.trim());
    const tracks: string[] = [];
    
    lines.forEach(line => {
      if (line && !line.startsWith('#') && !line.startsWith('[')) {
        tracks.push(line);
      }
    });
    
    return tracks;
  }

  // Import from PLS
  static importFromPLS(content: string): string[] {
    const lines = content.split('\n').map(l => l.trim());
    const tracks: string[] = [];
    
    lines.forEach(line => {
      if (line.startsWith('File')) {
        const path = line.split('=')[1];
        if (path) tracks.push(path);
      }
    });
    
    return tracks;
  }
}

// Statistics Management
export class StatsManager {
  private static STORAGE_KEY = 'maha_stats';
  private static HISTORY_KEY = 'maha_play_history';

  static incrementPlayCount(filePath: string): void {
    const stats = this.getTrackStats();
    stats[filePath] = {
      playCount: (stats[filePath]?.playCount || 0) + 1,
      lastPlayed: Date.now(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    
    this.addToHistory(filePath);
  }

  static getTrackStats(): Record<string, { playCount: number; lastPlayed: number }> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  static addToHistory(filePath: string): void {
    const history = this.getHistory();
    history.unshift({ filePath, timestamp: Date.now() });
    
    // Keep only last 100 entries
    const trimmed = history.slice(0, 100);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmed));
  }

  static getHistory(): Array<{ filePath: string; timestamp: number }> {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getMusicStats(tracks: MusicFile[]): MusicStats {
    const stats = this.getTrackStats();
    const history = this.getHistory();
    
    // Merge play counts with track data
    const tracksWithStats = tracks.map(track => ({
      ...track,
      playCount: stats[track.filePath]?.playCount || 0,
      lastPlayed: stats[track.filePath]?.lastPlayed,
    }));
    
    // Most played tracks
    const mostPlayedTracks = tracksWithStats
      .filter(t => t.playCount > 0)
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 20)
      .map(t => ({ track: t, playCount: t.playCount }));
    
    // Most played artists
    const artistCounts = new Map<string, number>();
    tracksWithStats.forEach(track => {
      const count = artistCounts.get(track.artist) || 0;
      artistCounts.set(track.artist, count + track.playCount);
    });
    const mostPlayedArtists = Array.from(artistCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([artist, playCount]) => ({ artist, playCount }));
    
    // Most played genres
    const genreCounts = new Map<string, number>();
    tracksWithStats.forEach(track => {
      if (track.genre) {
        const count = genreCounts.get(track.genre) || 0;
        genreCounts.set(track.genre, count + track.playCount);
      }
    });
    const mostPlayedGenres = Array.from(genreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, playCount]) => ({ genre, playCount }));
    
    // Recently played
    const recentlyPlayed = history
      .slice(0, 50)
      .map(h => {
        const track = tracks.find(t => t.filePath === h.filePath);
        return track ? { track, timestamp: h.timestamp } : null;
      })
      .filter(Boolean) as Array<{ track: MusicFile; timestamp: number }>;
    
    // Total play time
    const totalPlayTime = tracksWithStats.reduce((total, track) => {
      return total + (track.duration * track.playCount);
    }, 0);
    
    return {
      totalPlayTime,
      totalTracks: tracks.length,
      mostPlayedTracks,
      mostPlayedArtists,
      mostPlayedGenres,
      recentlyPlayed,
    };
  }

  static clearStats(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
  }
}

// Search and Filter
export class MusicSearch {
  static searchTracks(
    tracks: MusicFile[],
    query: string,
    filters?: SearchFilters
  ): MusicFile[] {
    let results = [...tracks];
    
    // Apply text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(track =>
        track.title.toLowerCase().includes(lowerQuery) ||
        track.artist.toLowerCase().includes(lowerQuery) ||
        track.album.toLowerCase().includes(lowerQuery) ||
        (track.genre && track.genre.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Apply filters
    if (filters) {
      if (filters.genre?.length) {
        results = results.filter(t => t.genre && filters.genre!.includes(t.genre));
      }
      
      if (filters.artist?.length) {
        results = results.filter(t => filters.artist!.includes(t.artist));
      }
      
      if (filters.album?.length) {
        results = results.filter(t => filters.album!.includes(t.album));
      }
      
      if (filters.year?.length) {
        results = results.filter(t => t.year && filters.year!.includes(t.year));
      }
      
      if (filters.minDuration !== undefined) {
        results = results.filter(t => t.duration >= filters.minDuration!);
      }
      
      if (filters.maxDuration !== undefined) {
        results = results.filter(t => t.duration <= filters.maxDuration!);
      }
    }
    
    return results;
  }

  static sortTracks(tracks: MusicFile[], sortOptions: SortOptions): MusicFile[] {
    const sorted = [...tracks];
    const { field, order } = sortOptions;
    
    sorted.sort((a, b) => {
      let aVal: any = a[field];
      let bVal: any = b[field];
      
      // Handle undefined values
      if (aVal === undefined) aVal = order === 'asc' ? Infinity : -Infinity;
      if (bVal === undefined) bVal = order === 'asc' ? Infinity : -Infinity;
      
      // String comparison
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      // Number comparison
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return sorted;
  }

  static getUniqueValues(tracks: MusicFile[], field: 'artist' | 'album' | 'genre' | 'year'): string[] {
    const values = new Set<string>();
    
    tracks.forEach(track => {
      const value = track[field];
      if (value !== undefined && value !== null) {
        values.add(String(value));
      }
    });
    
    return Array.from(values).sort();
  }
}

// Search History
export class SearchHistory {
  private static STORAGE_KEY = 'maha_search_history';
  private static MAX_ITEMS = 20;

  static addSearch(query: string): void {
    if (!query.trim()) return;
    
    const history = this.getHistory();
    const filtered = history.filter(q => q !== query);
    filtered.unshift(query);
    
    const trimmed = filtered.slice(0, this.MAX_ITEMS);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
  }

  static getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static removeItem(query: string): void {
    const history = this.getHistory();
    const filtered = history.filter(q => q !== query);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}
