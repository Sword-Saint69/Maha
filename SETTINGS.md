# Settings Page Documentation

## Overview
The Settings page provides users with a comprehensive interface to customize their Maha Music Player experience.

## Features

### 1. Social Media Integration
- **Instagram**: Click to open Instagram profile in your default browser
- **GitHub**: Click to open GitHub profile in your default browser
- Both links work seamlessly in both the Settings page and the floating dock navigation

### 2. Theme Customization
The app includes 10 beautiful pre-built themes:

1. **Midnight Dark** (Default) - Classic dark theme with purple accents
2. **Ocean Blue** - Inspired by deep ocean colors with cyan highlights
3. **Forest Green** - Nature-inspired green palette
4. **Sunset Orange** - Warm sunset colors with orange tones
5. **Lavender Dream** - Soft purple and lavender hues
6. **Rose Gold** - Elegant rose and pink tones
7. **Cyber Punk** - Neon green and magenta cyberpunk aesthetic
8. **Nordic Night** - Cool blue-gray Nordic palette
9. **Monokai** - Classic Monokai code editor theme
10. **Dracula** - Popular Dracula color scheme

### 3. Navigation Updates
- **Twitter icon replaced with Instagram** - The floating dock now features Instagram instead of Twitter
- **Changelog renamed to Settings** - More intuitive naming for the configuration page
- **Click handlers added** - Social links now properly open in external browser

## Usage

### Accessing Settings
1. Click the **Settings** icon (gear icon) in the floating dock on the left side
2. The Settings page will replace the home view

### Changing Themes
1. Navigate to Settings
2. Scroll to the "Theme Customization" section
3. Click on any theme preview card
4. The theme will be applied instantly
5. Your preference is saved automatically in localStorage

### Opening Social Links
You can open social links in two ways:
1. **From Settings Page**: Click on the Instagram or GitHub cards
2. **From Dock**: Click the Instagram or GitHub icons in the floating dock

## Technical Details

### Theme System
- Themes are managed via React Context (`ThemeContext`)
- CSS variables are dynamically updated when theme changes
- Preferences persist across sessions using localStorage
- Smooth transitions between themes

### External Link Handling
- In Electron: Uses native `shell.openExternal()` for secure external links
- In Browser: Falls back to `window.open()` with security flags
- Error handling ensures graceful degradation

### Components
- **SettingsPage** (`components/settings-page.tsx`) - Main settings interface
- **ThemeContext** (`contexts/ThemeContext.tsx`) - Theme state management
- **FloatingDock** - Updated with new icons and click handlers

## Future Enhancements
- Custom theme creation
- Import/export theme configurations
- Additional social platform integrations
- User profile management
- Audio quality settings
- Keyboard shortcuts configuration
