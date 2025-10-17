export interface MusicFile {
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  coverArt: string | null;
  year: number | null;
  genre?: string;
  playCount?: number;
  lastPlayed?: number;
  dateAdded?: number;
  rating?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: string[]; // Array of file paths
  createdAt: number;
  updatedAt: number;
  coverArt?: string;
  isSmart?: boolean;
  smartCriteria?: SmartPlaylistCriteria;
}

export interface SmartPlaylistCriteria {
  genre?: string[];
  artist?: string[];
  minPlayCount?: number;
  maxPlayCount?: number;
  minRating?: number;
  year?: number[];
  dateAddedAfter?: number;
  limit?: number;
}

export interface PlaybackState {
  currentTrack: MusicFile | null;
  queue: MusicFile[];
  queueIndex: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  volume: number;
  playbackSpeed: number;
  crossfade: boolean;
  crossfadeDuration: number;
}

export interface MusicStats {
  totalPlayTime: number;
  totalTracks: number;
  mostPlayedTracks: Array<{ track: MusicFile; playCount: number }>;
  mostPlayedArtists: Array<{ artist: string; playCount: number }>;
  mostPlayedGenres: Array<{ genre: string; playCount: number }>;
  recentlyPlayed: Array<{ track: MusicFile; timestamp: number }>;
}

export interface SearchFilters {
  genre?: string[];
  artist?: string[];
  album?: string[];
  year?: number[];
  minDuration?: number;
  maxDuration?: number;
}

export interface SortOptions {
  field: 'title' | 'artist' | 'album' | 'duration' | 'playCount' | 'dateAdded' | 'year';
  order: 'asc' | 'desc';
}

export interface ElectronAPI {
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
  player: {
    play: () => Promise<void>;
    pause: () => Promise<void>;
    stop: () => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
    loadFile: () => Promise<string | null>;
  };
  selectMusicFolder: () => Promise<{ success: boolean; path: string | null }>;
  scanMusicFolder: (folderPath: string) => Promise<{ success: boolean; files?: MusicFile[]; error?: string }>;
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
