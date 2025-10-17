'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconAdjustments, IconCheck, IconX } from '@tabler/icons-react';

export interface EqualizerPreset {
  id: string;
  name: string;
  gains: number[]; // 10 bands: 32, 64, 125, 250, 500, 1k, 2k, 4k, 8k, 16k Hz
}

const PRESETS: EqualizerPreset[] = [
  {
    id: 'flat',
    name: 'Flat',
    gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'rock',
    name: 'Rock',
    gains: [5, 3, -2, -3, -1, 1, 4, 5, 5, 5],
  },
  {
    id: 'pop',
    name: 'Pop',
    gains: [-1, -1, 0, 2, 4, 4, 2, 0, -1, -1],
  },
  {
    id: 'jazz',
    name: 'Jazz',
    gains: [4, 3, 1, 2, -1, -1, 0, 1, 3, 4],
  },
  {
    id: 'classical',
    name: 'Classical',
    gains: [5, 4, 3, 2, -1, -1, 0, 2, 3, 4],
  },
  {
    id: 'bass_boost',
    name: 'Bass Boost',
    gains: [8, 6, 4, 2, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'treble_boost',
    name: 'Treble Boost',
    gains: [0, 0, 0, 0, 0, 0, 2, 4, 6, 8],
  },
  {
    id: 'vocal',
    name: 'Vocal',
    gains: [-2, -3, -2, 1, 3, 3, 2, 1, 0, -1],
  },
  {
    id: 'electronic',
    name: 'Electronic',
    gains: [5, 4, 1, 0, -2, 2, 1, 2, 5, 6],
  },
  {
    id: 'acoustic',
    name: 'Acoustic',
    gains: [4, 3, 2, 1, 2, 1, 2, 3, 3, 2],
  },
];

const FREQUENCY_LABELS = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];

interface EqualizerProps {
  onEqualizerChange?: (gains: number[]) => void;
}

export default function Equalizer({ onEqualizerChange }: EqualizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('flat');
  const [gains, setGains] = useState<number[]>(PRESETS[0].gains);
  const [isEnabled, setIsEnabled] = useState(false);

  // Load saved settings
  useEffect(() => {
    const savedEnabled = localStorage.getItem('maha_eq_enabled');
    const savedPreset = localStorage.getItem('maha_eq_preset');
    const savedGains = localStorage.getItem('maha_eq_gains');

    if (savedEnabled !== null) {
      setIsEnabled(savedEnabled === 'true');
    }
    if (savedPreset) {
      setSelectedPreset(savedPreset);
    }
    if (savedGains) {
      setGains(JSON.parse(savedGains));
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('maha_eq_enabled', isEnabled.toString());
    localStorage.setItem('maha_eq_preset', selectedPreset);
    localStorage.setItem('maha_eq_gains', JSON.stringify(gains));

    if (onEqualizerChange) {
      onEqualizerChange(isEnabled ? gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    // Dispatch event for music player
    window.dispatchEvent(
      new CustomEvent('equalizerChanged', {
        detail: { enabled: isEnabled, gains: isEnabled ? gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      })
    );
  }, [gains, isEnabled, onEqualizerChange]);

  const handlePresetChange = (preset: EqualizerPreset) => {
    setSelectedPreset(preset.id);
    setGains(preset.gains);
  };

  const handleGainChange = (index: number, value: number) => {
    const newGains = [...gains];
    newGains[index] = value;
    setGains(newGains);
    setSelectedPreset('custom');
  };

  const resetEqualizer = () => {
    setGains(PRESETS[0].gains);
    setSelectedPreset('flat');
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
        style={{
          backgroundColor: isOpen ? 'var(--color-primary)' : 'var(--bg-secondary)',
          color: isOpen ? 'white' : 'var(--text-primary)',
        }}
        title="Equalizer"
      >
        <IconAdjustments className="w-5 h-5" />
        <span className="text-sm font-medium">EQ</span>
        {isEnabled && (
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        )}
      </button>

      {/* Equalizer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 p-6 rounded-2xl shadow-2xl border z-50"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              width: '600px',
              maxWidth: '90vw',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Equalizer
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-12 h-6 rounded-full transition-colors duration-200 relative"
                    style={{
                      backgroundColor: isEnabled ? 'var(--color-primary)' : 'var(--border-color)',
                    }}
                  >
                    <div
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                      style={{
                        transform: isEnabled ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {isEnabled ? 'On' : 'Off'}
                  </span>
                </label>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-700/30 transition-colors"
              >
                <IconX className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Presets
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset)}
                    className="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor:
                        selectedPreset === preset.id ? 'var(--color-primary)' : 'var(--bg-secondary)',
                      color: selectedPreset === preset.id ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {preset.name}
                    {selectedPreset === preset.id && (
                      <IconCheck className="absolute top-1 right-1 w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Bands */}
            <div className="mb-4">
              <div className="flex items-end gap-2 h-48 mb-2">
                {gains.map((gain, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {gain > 0 ? '+' : ''}
                      {gain}
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={gain}
                      onChange={(e) => handleGainChange(index, parseFloat(e.target.value))}
                      className="h-32 appearance-none bg-transparent cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                      style={{
                        background: `linear-gradient(to top, var(--color-primary) 0%, var(--color-primary) ${((gain + 12) / 24) * 100}%, var(--border-color) ${((gain + 12) / 24) * 100}%, var(--border-color) 100%)`,
                      }}
                      disabled={!isEnabled}
                    />
                    <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {FREQUENCY_LABELS[index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-between items-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Adjust frequencies from -12dB to +12dB
              </p>
              <button
                onClick={resetEqualizer}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
