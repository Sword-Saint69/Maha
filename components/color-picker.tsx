'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

export default function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const presetColors = [
    '#000000', '#1a1a1a', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
    '#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe',
    '#ec4899', '#db2777', '#f472b6', '#f9a8d4', '#fbcfe8',
    '#3b82f6', '#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe',
    '#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0',
    '#f59e0b', '#d97706', '#fbbf24', '#fcd34d', '#fde68a',
    '#ef4444', '#dc2626', '#f87171', '#fca5a5', '#fecaca',
    '#06b6d4', '#0891b2', '#22d3ee', '#67e8f9', '#a5f3fc',
    '#8b5cf6', '#7c3aed', '#a855f7', '#d946ef', '#e879f9',
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {label}
          </label>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg border-2 cursor-pointer transition-transform hover:scale-110"
          style={{ 
            backgroundColor: value,
            borderColor: 'var(--border-color)'
          }}
          onClick={() => setShowPicker(!showPicker)}
        />
      </div>

      {showPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Hex Input */}
          <div className="mb-4">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm font-mono"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
                border: '1px solid',
              }}
              placeholder="#000000"
            />
          </div>

          {/* Color Picker Input */}
          <div className="mb-4">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              Preset Colors
            </p>
            <div className="grid grid-cols-7 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => onChange(color)}
                  className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: value === color ? 'var(--color-primary)' : 'var(--border-color)',
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
