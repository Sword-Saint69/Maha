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
  {
    id: 'mint',
    name: 'Mint Fresh',
    colors: {
      background: '#0a1f1a',
      foreground: '#143329',
      primary: '#00d9a3',
      secondary: '#00b386',
      accent: '#3dffc7',
      card: '#1f4d3d',
      cardHover: '#2d6650',
      text: '#e6fff7',
      textSecondary: '#b3ffe6',
      border: '#008066',
    },
  },
  {
    id: 'coral',
    name: 'Coral Reef',
    colors: {
      background: '#1f0a14',
      foreground: '#331427',
      primary: '#ff6b9d',
      secondary: '#ff3d7f',
      accent: '#ffb3d1',
      card: '#4d1f33',
      cardHover: '#662940',
      text: '#ffe6f0',
      textSecondary: '#ffcce0',
      border: '#cc0052',
    },
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    colors: {
      background: '#1f1a0a',
      foreground: '#332d14',
      primary: '#ffd700',
      secondary: '#ffb300',
      accent: '#ffed4e',
      card: '#4d3d1f',
      cardHover: '#66502d',
      text: '#fffae6',
      textSecondary: '#fff0b3',
      border: '#cc9900',
    },
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    colors: {
      background: '#1a0a1f',
      foreground: '#2d1433',
      primary: '#b19cd9',
      secondary: '#9370db',
      accent: '#dda0dd',
      card: '#3d1f4d',
      cardHover: '#502966',
      text: '#f5e6ff',
      textSecondary: '#e0ccff',
      border: '#7a52a3',
    },
  },
  {
    id: 'neon-green',
    name: 'Neon Green',
    colors: {
      background: '#0a1f0a',
      foreground: '#143314',
      primary: '#39ff14',
      secondary: '#00ff00',
      accent: '#7fff00',
      card: '#1f4d1f',
      cardHover: '#2d662d',
      text: '#e6ffe6',
      textSecondary: '#b3ffb3',
      border: '#00cc00',
    },
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    colors: {
      background: '#0f0a1f',
      foreground: '#1a1433',
      primary: '#7851a9',
      secondary: '#5e3a87',
      accent: '#9d7ebd',
      card: '#2d1f4d',
      cardHover: '#3d2966',
      text: '#f0e6ff',
      textSecondary: '#d4b3ff',
      border: '#522e80',
    },
  },
  {
    id: 'turquoise',
    name: 'Turquoise Dream',
    colors: {
      background: '#0a1f1f',
      foreground: '#143333',
      primary: '#40e0d0',
      secondary: '#00ced1',
      accent: '#7fffd4',
      card: '#1f4d4d',
      cardHover: '#2d6666',
      text: '#e6ffff',
      textSecondary: '#b3f5f5',
      border: '#008b8b',
    },
  },
  {
    id: 'crimson',
    name: 'Crimson Night',
    colors: {
      background: '#1f0a0a',
      foreground: '#331414',
      primary: '#dc143c',
      secondary: '#b22222',
      accent: '#ff6b7a',
      card: '#4d1f1f',
      cardHover: '#662d2d',
      text: '#ffe6e6',
      textSecondary: '#ffb3b3',
      border: '#8b0000',
    },
  },
  {
    id: 'lime',
    name: 'Lime Electric',
    colors: {
      background: '#141f0a',
      foreground: '#1f3314',
      primary: '#bfff00',
      secondary: '#9acd32',
      accent: '#d4ff3d',
      card: '#334d1f',
      cardHover: '#476629',
      text: '#f5ffe6',
      textSecondary: '#e0ffb3',
      border: '#7a9900',
    },
  },
  {
    id: 'indigo',
    name: 'Indigo Depths',
    colors: {
      background: '#0a0a1f',
      foreground: '#141433',
      primary: '#4b0082',
      secondary: '#6a0dad',
      accent: '#9370db',
      card: '#1f1f4d',
      cardHover: '#2d2d66',
      text: '#e6e6ff',
      textSecondary: '#b3b3ff',
      border: '#3d0066',
    },
  },
  {
    id: 'peach',
    name: 'Peach Sunset',
    colors: {
      background: '#1f140a',
      foreground: '#332314',
      primary: '#ffb07c',
      secondary: '#ff8c42',
      accent: '#ffd4a3',
      card: '#4d331f',
      cardHover: '#66472d',
      text: '#fff0e6',
      textSecondary: '#ffe0b3',
      border: '#cc6600',
    },
  },
  {
    id: 'steel',
    name: 'Steel Gray',
    colors: {
      background: '#0f0f0f',
      foreground: '#1a1a1a',
      primary: '#b0c4de',
      secondary: '#778899',
      accent: '#d3d3d3',
      card: '#2d2d2d',
      cardHover: '#3d3d3d',
      text: '#f0f0f0',
      textSecondary: '#c0c0c0',
      border: '#505050',
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
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Vibrant neon lights with glowing effects'
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    description: '80s inspired synthwave aesthetic'
  },
  {
    id: 'material',
    name: 'Material Design',
    description: 'Google Material Design principles'
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    description: 'Soft shadows and subtle depth effects'
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Bold, raw, and unapologetic design'
  },
  {
    id: 'vinyl',
    name: 'Vinyl Record',
    description: 'Classic vinyl player experience'
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Sci-fi inspired interface'
  },
  {
    id: 'minimalist-pro',
    name: 'Minimalist Pro',
    description: 'Ultra-clean professional interface'
  },
  {
    id: 'ambient',
    name: 'Ambient',
    description: 'Soft, calming, atmospheric design'
  },
  {
    id: 'disco',
    name: 'Disco Ball',
    description: 'Party-ready with sparkle effects'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Hacker-style command line aesthetic'
  },
  {
    id: 'aqua',
    name: 'Aqua Waves',
    description: 'Flowing water-inspired animations'
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Space-themed with stars and nebula'
  },
  {
    id: 'paper',
    name: 'Paper Texture',
    description: 'Natural paper-like material design'
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Iridescent rainbow shimmer effects'
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
  playerStyle: string;
  setPlayerStyle: (styleId: string) => void;
  playerStyles: PlayerStyle[];
  customThemes: Theme[];
  addCustomTheme: (theme: Theme) => void;
  deleteCustomTheme: (themeId: string) => void;
  updateCustomTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [currentPlayerStyle, setCurrentPlayerStyle] = useState<string>('classic');
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('themeId');
    const savedCustomThemes = localStorage.getItem('customThemes');
    
    if (savedCustomThemes) {
      try {
        const parsed = JSON.parse(savedCustomThemes);
        setCustomThemes(parsed);
      } catch (e) {
        console.error('Failed to load custom themes:', e);
      }
    }
    
    if (savedThemeId) {
      const allThemes = [...themes, ...customThemes];
      const theme = allThemes.find(t => t.id === savedThemeId);
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
    const allThemes = [...themes, ...customThemes];
    const theme = allThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('themeId', themeId);
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }
  };

  const addCustomTheme = (theme: Theme) => {
    const updatedCustomThemes = [...customThemes, theme];
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));
  };

  const deleteCustomTheme = (themeId: string) => {
    const updatedCustomThemes = customThemes.filter(t => t.id !== themeId);
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));
    
    // If deleting current theme, switch to default
    if (currentTheme.id === themeId) {
      setTheme(themes[0].id);
    }
  };

  const updateCustomTheme = (theme: Theme) => {
    const updatedCustomThemes = customThemes.map(t => t.id === theme.id ? theme : t);
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));
    
    // If updating current theme, apply changes
    if (currentTheme.id === theme.id) {
      setCurrentTheme(theme);
    }
  };

  const setPlayerStyle = (styleId: string) => {
    setCurrentPlayerStyle(styleId);
    localStorage.setItem('playerStyle', styleId);
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('playerStyleChanged', { detail: styleId }));
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      themes: [...themes, ...customThemes], 
      playerStyle: currentPlayerStyle, 
      setPlayerStyle, 
      playerStyles,
      customThemes,
      addCustomTheme,
      deleteCustomTheme,
      updateCustomTheme
    }}>
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
