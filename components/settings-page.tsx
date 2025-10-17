'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { IconBrandGithub, IconBrandInstagram, IconCheck } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import CustomThemeCreator from './custom-theme-creator';

export default function SettingsPage() {
  const { currentTheme, setTheme, themes, playerStyle, setPlayerStyle, playerStyles } = useTheme();
  const [volumeAmplification, setVolumeAmplification] = useState(100);

  useEffect(() => {
    const savedAmplification = localStorage.getItem('volumeAmplification');
    if (savedAmplification) {
      setVolumeAmplification(parseInt(savedAmplification));
    }
  }, []);

  const handleVolumeAmplificationChange = (value: number) => {
    setVolumeAmplification(value);
    localStorage.setItem('volumeAmplification', value.toString());
    // Dispatch custom event to notify music player
    window.dispatchEvent(new CustomEvent('volumeAmplificationChanged', { detail: value }));
  };

  const handleSocialClick = async (url: string) => {
    if (typeof window !== 'undefined' && window.electron && window.electron.openExternal) {
      try {
        await window.electron.openExternal(url);
      } catch (error) {
        console.error('Error opening external URL:', error);
        // Fallback for web browser
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Fallback for web browser
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Customize your music player experience
          </p>
        </div>

        {/* Social Links Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Connect With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instagram Card */}
            <motion.button
              onClick={() => handleSocialClick('https://instagram.com/_gouth.ammmm')}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  }}
                >
                  <IconBrandInstagram className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Instagram
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Follow us for updates
                  </p>
                </div>
                <div className="text-2xl" style={{ color: 'var(--text-secondary)' }}>
                  →
                </div>
              </div>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                }}
              />
            </motion.button>

            {/* GitHub Card */}
            <motion.button
              onClick={() => handleSocialClick('https://github.com/Sword-saint69/maha')}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#333' }}
                >
                  <IconBrandGithub className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    GitHub
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Star us on GitHub
                  </p>
                </div>
                <div className="text-2xl" style={{ color: 'var(--text-secondary)' }}>
                  →
                </div>
              </div>
              <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            </motion.button>
          </div>
        </section>

        {/* Audio Settings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Audio Settings
          </h2>
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                    Volume Amplification
                  </label>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                    {volumeAmplification}%
                  </span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Boost audio output beyond normal limits. Use with caution to prevent speaker damage.
                </p>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={volumeAmplification}
                  onChange={(e) => handleVolumeAmplificationChange(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-secondary) ${((volumeAmplification - 50) / 150) * 100}%, var(--border-color) ${((volumeAmplification - 50) / 150) * 100}%, var(--border-color) 100%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>50%</span>
                  <span>100% (Normal)</span>
                  <span>200%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Player Style Selection Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Player Style
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playerStyles.map((style) => (
              <motion.button
                key={style.id}
                onClick={() => setPlayerStyle(style.id)}
                className="relative group text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="rounded-xl p-4 border-2 transition-all duration-300 h-full"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: playerStyle === style.id ? 'var(--color-primary)' : 'var(--border-color)',
                  }}
                >
                  <div className="mb-2">
                    <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {style.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {style.description}
                    </p>
                  </div>
                  {/* Active Indicator */}
                  {playerStyle === style.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <IconCheck className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Custom Theme Creator Section */}
        <section className="mb-12">
          <CustomThemeCreator />
        </section>

        {/* Theme Selection Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Preset Themes
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Choose from {themes.length} beautifully crafted themes or create your own custom theme above
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="rounded-xl p-3 border-2 transition-all duration-300"
                  style={{
                    backgroundColor: theme.colors.card,
                    borderColor: currentTheme.id === theme.id ? 'var(--color-primary)' : 'var(--border-color)',
                  }}
                >
                  {/* Theme Preview */}
                  <div className="mb-2 space-y-1.5">
                    <div
                      className="h-6 rounded-md"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div className="flex gap-1">
                      <div
                        className="h-3 flex-1 rounded"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="h-3 flex-1 rounded"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </div>

                  {/* Theme Name */}
                  <div className="text-center">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: theme.colors.text }}
                      title={theme.name}
                    >
                      {theme.name}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {currentTheme.id === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <IconCheck className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* App Info Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            About
          </h2>
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>App Name</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Maha Music Player
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Version</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  0.1.0
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Current Theme</span>
                <span className="font-medium" style={{ color: 'var(--color-primary)' }}>
                  {currentTheme.name}
                </span>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
