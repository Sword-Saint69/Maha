'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import ColorPicker from './color-picker';
import { IconPlus, IconX, IconCheck, IconEdit, IconTrash } from '@tabler/icons-react';

export default function CustomThemeCreator() {
  const { customThemes, addCustomTheme, deleteCustomTheme, updateCustomTheme, setTheme } = useTheme();
  const [showCreator, setShowCreator] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [themeName, setThemeName] = useState('');
  const [colors, setColors] = useState({
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
  });

  const handleCreate = () => {
    if (!themeName.trim()) {
      alert('Please enter a theme name');
      return;
    }

    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: themeName,
      colors: { ...colors },
    };

    if (editingTheme) {
      updateCustomTheme({ ...newTheme, id: editingTheme.id });
    } else {
      addCustomTheme(newTheme);
    }

    resetForm();
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setThemeName(theme.name);
    setColors(theme.colors);
    setShowCreator(true);
  };

  const handleDelete = (themeId: string) => {
    if (confirm('Are you sure you want to delete this custom theme?')) {
      deleteCustomTheme(themeId);
    }
  };

  const resetForm = () => {
    setShowCreator(false);
    setEditingTheme(null);
    setThemeName('');
    setColors({
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
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Custom Themes
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Create your own unique color schemes
          </p>
        </div>
        <motion.button
          onClick={() => setShowCreator(!showCreator)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors"
          style={{
            backgroundColor: showCreator ? 'var(--bg-card)' : 'var(--color-primary)',
            color: showCreator ? 'var(--text-primary)' : '#ffffff',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showCreator ? <IconX className="w-4 h-4" /> : <IconPlus className="w-4 h-4" />}
          {showCreator ? 'Cancel' : 'Create Theme'}
        </motion.button>
      </div>

      {/* Theme Creator Form */}
      {showCreator && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-2xl p-6 space-y-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            border: '1px solid',
          }}
        >
          {/* Theme Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Theme Name
            </label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Awesome Theme"
              className="w-full px-4 py-2 rounded-lg"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
                border: '1px solid',
              }}
            />
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorPicker
              label="Primary Color"
              description="Main accent color for buttons and highlights"
              value={colors.primary}
              onChange={(color) => setColors({ ...colors, primary: color })}
            />
            <ColorPicker
              label="Secondary Color"
              description="Supporting accent color"
              value={colors.secondary}
              onChange={(color) => setColors({ ...colors, secondary: color })}
            />
            <ColorPicker
              label="Accent Color"
              description="Additional highlight color"
              value={colors.accent}
              onChange={(color) => setColors({ ...colors, accent: color })}
            />
            <ColorPicker
              label="Background Color"
              description="Main background color"
              value={colors.background}
              onChange={(color) => setColors({ ...colors, background: color })}
            />
            <ColorPicker
              label="Foreground Color"
              description="Secondary background color"
              value={colors.foreground}
              onChange={(color) => setColors({ ...colors, foreground: color })}
            />
            <ColorPicker
              label="Card Background"
              description="Background for cards and panels"
              value={colors.card}
              onChange={(color) => setColors({ ...colors, card: color })}
            />
            <ColorPicker
              label="Card Hover"
              description="Card color on hover"
              value={colors.cardHover}
              onChange={(color) => setColors({ ...colors, cardHover: color })}
            />
            <ColorPicker
              label="Text Color"
              description="Primary text color"
              value={colors.text}
              onChange={(color) => setColors({ ...colors, text: color })}
            />
            <ColorPicker
              label="Secondary Text"
              description="Muted text color"
              value={colors.textSecondary}
              onChange={(color) => setColors({ ...colors, textSecondary: color })}
            />
            <ColorPicker
              label="Border Color"
              description="Border and divider color"
              value={colors.border}
              onChange={(color) => setColors({ ...colors, border: color })}
            />
          </div>

          {/* Preview */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Preview
            </p>
            <div
              className="rounded-xl p-6 space-y-4"
              style={{ backgroundColor: colors.background }}
            >
              <div className="rounded-lg p-4" style={{ backgroundColor: colors.card }}>
                <h4 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                  {themeName || 'Theme Preview'}
                </h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  This is how your theme will look
                </p>
                <div className="flex gap-2 mt-4">
                  <div className="h-8 rounded flex-1" style={{ backgroundColor: colors.primary }} />
                  <div className="h-8 rounded flex-1" style={{ backgroundColor: colors.secondary }} />
                  <div className="h-8 rounded flex-1" style={{ backgroundColor: colors.accent }} />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white"
              style={{ backgroundColor: colors.primary }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconCheck className="w-5 h-5" />
              {editingTheme ? 'Update Theme' : 'Create Theme'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Custom Themes List */}
      {customThemes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Your Custom Themes ({customThemes.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customThemes.map((theme) => (
              <motion.div
                key={theme.id}
                className="rounded-xl p-4 border relative group"
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-3">
                  <h5 className="font-semibold mb-1" style={{ color: theme.colors.text }}>
                    {theme.name}
                  </h5>
                  <div className="flex gap-1">
                    <div className="h-4 flex-1 rounded" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="h-4 flex-1 rounded" style={{ backgroundColor: theme.colors.secondary }} />
                    <div className="h-4 flex-1 rounded" style={{ backgroundColor: theme.colors.accent }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme(theme.id)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleEdit(theme)}
                    className="px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: theme.colors.cardHover,
                      color: theme.colors.text,
                    }}
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(theme.id)}
                    className="px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: theme.colors.cardHover,
                      color: '#ef4444',
                    }}
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
