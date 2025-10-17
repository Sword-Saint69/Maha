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
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
