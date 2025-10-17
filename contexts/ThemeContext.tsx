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
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('themeId');
    if (savedThemeId) {
      const theme = themes.find(t => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
      }
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
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
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
