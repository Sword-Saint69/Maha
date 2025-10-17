export interface MusicFile {
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  coverArt: string | null;
  year: number | null;
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
