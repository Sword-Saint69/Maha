'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    card: string;
    cardHover: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export interface PlayerStyle {
  id: string;
  name: string;
  description: string;
}

export const themes: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight Dark',
    colors: {
      background: '#000000',
      foreground: '#0a0a0a',
      primary: '#8b5cf6',
      secondary: '#6d28d9',
      accent: '#a78bfa',
      card: '#1a1a1a',
      cardHover: '#262626',
      text: '#ffffff',
      textSecondary: '#a3a3a3',
      border: '#404040',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      background: '#0a192f',
      foreground: '#112240',
      primary: '#64ffda',
      secondary: '#0ea5e9',
      accent: '#38bdf8',
      card: '#1e293b',
      cardHover: '#334155',
      text: '#e2e8f0',
      textSecondary: '#94a3b8',
      border: '#475569',
    },
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      background: '#0f1a14',
      foreground: '#1a2e23',
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      card: '#1f2937',
      cardHover: '#374151',
      text: '#f0fdf4',
      textSecondary: '#86efac',
      border: '#4b5563',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: {
      background: '#1a0f0a',
      foreground: '#2d1810',
      primary: '#fb923c',
      secondary: '#ea580c',
      accent: '#fdba74',
      card: '#292524',
      cardHover: '#3f3f46',
      text: '#fff7ed',
      textSecondary: '#fed7aa',
      border: '#57534e',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    colors: {
      background: '#1a0f1f',
      foreground: '#2d1b3d',
      primary: '#c084fc',
      secondary: '#a855f7',
      accent: '#d8b4fe',
      card: '#2e1065',
      cardHover: '#4c1d95',
      text: '#faf5ff',
      textSecondary: '#e9d5ff',
      border: '#6b21a8',
    },
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    colors: {
      background: '#1f0a14',
      foreground: '#2d1420',
      primary: '#fb7185',
      secondary: '#e11d48',
      accent: '#fda4af',
      card: '#3f1d2b',
      cardHover: '#4c1d30',
      text: '#fff1f2',
      textSecondary: '#fecdd3',
      border: '#881337',
    },
  },
  {
    id: 'cyber',
    name: 'Cyber Punk',
    colors: {
      background: '#0d0d0d',
      foreground: '#1a1a1a',
      primary: '#00ff9f',
      secondary: '#ff00ff',
      accent: '#00ffff',
      card: '#1f1f1f',
      cardHover: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      border: '#00ff9f',
    },
  },
  {
    id: 'nordic',
    name: 'Nordic Night',
    colors: {
      background: '#2e3440',
      foreground: '#3b4252',
      primary: '#88c0d0',
      secondary: '#81a1c1',
      accent: '#8fbcbb',
      card: '#434c5e',
      cardHover: '#4c566a',
      text: '#eceff4',
      textSecondary: '#d8dee9',
      border: '#5e81ac',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    colors: {
      background: '#272822',
      foreground: '#3e3d32',
      primary: '#a6e22e',
      secondary: '#f92672',
      accent: '#66d9ef',
      card: '#3e3d32',
      cardHover: '#49483e',
      text: '#f8f8f2',
      textSecondary: '#75715e',
      border: '#75715e',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      background: '#282a36',
      foreground: '#44475a',
      primary: '#bd93f9',
      secondary: '#ff79c6',
      accent: '#8be9fd',
      card: '#44475a',
      cardHover: '#6272a4',
      text: '#f8f8f2',
      textSecondary: '#f1fa8c',
      border: '#6272a4',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    colors: {
      background: '#0d0208',
      foreground: '#1a1a1a',
      primary: '#00ff41',
      secondary: '#008f11',
      accent: '#39ff14',
      card: '#1a1a1a',
      cardHover: '#262626',
      text: '#00ff41',
      textSecondary: '#008f11',
      border: '#003b00',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura Pink',
    colors: {
      background: '#1a0a12',
      foreground: '#2d1420',
      primary: '#ff66d8',
      secondary: '#ff1493',
      accent: '#ffb3e6',
      card: '#3d1f2e',
      cardHover: '#4d2a3a',
      text: '#ffe6f7',
      textSecondary: '#ffcce6',
      border: '#993366',
    },
  },
  {
    id: 'tokyo',
    name: 'Tokyo Night',
    colors: {
      background: '#1a1b26',
      foreground: '#24283b',
      primary: '#7aa2f7',
      secondary: '#bb9af7',
      accent: '#7dcfff',
      card: '#24283b',
      cardHover: '#414868',
      text: '#c0caf5',
      textSecondary: '#9aa5ce',
      border: '#565f89',
    },
  },
  {
    id: 'vampire',
    name: 'Vampire',
    colors: {
      background: '#1c0a0a',
      foreground: '#2d1414',
      primary: '#ff3333',
      secondary: '#cc0000',
      accent: '#ff6666',
      card: '#331a1a',
      cardHover: '#4d1f1f',
      text: '#fff0f0',
      textSecondary: '#ffcccc',
      border: '#660000',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: {
      background: '#0a1628',
      foreground: '#152238',
      primary: '#00d4aa',
      secondary: '#00b4d8',
      accent: '#90e0ef',
      card: '#1e3a5f',
      cardHover: '#2a5080',
      text: '#caf0f8',
      textSecondary: '#90e0ef',
      border: '#48cae4',
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    colors: {
      background: '#1a0c00',
      foreground: '#2d1a0d',
      primary: '#ff6b35',
      secondary: '#ff4500',
      accent: '#ff8c42',
      card: '#3d2817',
      cardHover: '#4d3521',
      text: '#fff5f0',
      textSecondary: '#ffd7c4',
      border: '#a0522d',
    },
  },
  {
    id: 'grape',
    name: 'Grape Soda',
    colors: {
      background: '#120a1f',
      foreground: '#1e1333',
      primary: '#9d4edd',
      secondary: '#7209b7',
      accent: '#c77dff',
      card: '#3c096c',
      cardHover: '#5a189a',
      text: '#f0e6ff',
      textSecondary: '#e0aaff',
      border: '#6a0dad',
    },
  },
  {
    id: 'arctic',
    name: 'Arctic Ice',
    colors: {
      background: '#0a1f1f',
      foreground: '#153333',
      primary: '#4dd4e8',
      secondary: '#00b4cc',
      accent: '#80e5f5',
      card: '#1f4d4d',
      cardHover: '#2d6666',
      text: '#e6ffff',
      textSecondary: '#b3f0ff',
      border: '#006680',
    },
  },
  {
    id: 'coffee',
    name: 'Coffee Break',
    colors: {
      background: '#1a120a',
      foreground: '#2d1f14',
      primary: '#d4a574',
      secondary: '#a0724a',
      accent: '#e6c9a8',
      card: '#3d2f1f',
      cardHover: '#4d3a27',
      text: '#fff8f0',
      textSecondary: '#e6d4c4',
      border: '#6b4423',
    },
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    colors: {
      background: '#0a0e27',
      foreground: '#14183d',
      primary: '#5865f2',
      secondary: '#4752c4',
      accent: '#7289da',
      card: '#1e2449',
      cardHover: '#2c3464',
      text: '#ffffff',
      textSecondary: '#b9bbbe',
      border: '#3c4270',
    },
  },
];

export const playerStyles: PlayerStyle[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional music player layout with gradient effects'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design with essential controls only'
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Space-saving design perfect for small screens'
  },
  {
    id: 'expanded',
    name: 'Expanded',
    description: 'Full-featured player with large album art and lyrics'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Modern frosted glass effect with vibrant colors'
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
  playerStyle: string;
  setPlayerStyle: (styleId: string) => void;
  playerStyles: PlayerStyle[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [currentPlayerStyle, setCurrentPlayerStyle] = useState<string>('classic');

  useEffect(() => {
    const savedThemeId = localStorage.getItem('themeId');
    if (savedThemeId) {
      const theme = themes.find(t => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
    
    const savedPlayerStyle = localStorage.getItem('playerStyle');
    if (savedPlayerStyle) {
      setCurrentPlayerStyle(savedPlayerStyle);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', currentTheme.colors.background);
    root.style.setProperty('--bg-secondary', currentTheme.colors.foreground);
    root.style.setProperty('--color-primary', currentTheme.colors.primary);
    root.style.setProperty('--color-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--color-accent', currentTheme.colors.accent);
    root.style.setProperty('--bg-card', currentTheme.colors.card);
    root.style.setProperty('--bg-card-hover', currentTheme.colors.cardHover);
    root.style.setProperty('--text-primary', currentTheme.colors.text);
    root.style.setProperty('--text-secondary', currentTheme.colors.textSecondary);
    root.style.setProperty('--border-color', currentTheme.colors.border);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('themeId', themeId);
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }
  };

  const setPlayerStyle = (styleId: string) => {
    setCurrentPlayerStyle(styleId);
    localStorage.setItem('playerStyle', styleId);
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('playerStyleChanged', { detail: styleId }));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes, playerStyle: currentPlayerStyle, setPlayerStyle, playerStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
