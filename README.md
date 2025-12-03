# Spirograph

A sophisticated web-based Spirograph application for creating beautiful mathematical curves with SVG export capabilities.

## Features

- **Real-time Interactive Creation**: Drag sliders and see instant updates to your spirograph
- **Smart SVG Generation**: Uses bezier curve optimization instead of thousands of points
- **Dual-Mode Controls**:
  - Simple mode: Easy sliders for casual users
  - Advanced mode: Full mathematical parameter control
- **Animation Playback**: Watch your spirograph being drawn with speed controls and timeline scrubbing
- **Preset Gallery**: 6 beautiful presets to get started
- **SVG Export**:
  - Static SVG export
  - Animated SVG with configurable duration and looping (perfect for loading animations!)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Create**: Tweak the controls to create your spirograph pattern - changes update live!
2. **Animate**: Hit play to watch the drawing animation
3. **Export**: Download as static or animated SVG

## Tech Stack

- React 18
- TypeScript
- Vite
- Pure CSS (no UI libraries)
- Native SVG and SMIL animations

## Design

Features a distinctive technical/blueprint aesthetic with:
- Dark theme with deep blue-black background
- Vibrant cyan and warm amber accents
- Typography: Crimson Pro, Space Grotesk, and JetBrains Mono
- High contrast, sophisticated UI

## Future Enhancements

See the backlog for planned features:
- Multiple simultaneous gears (layered patterns)
- Color gradients along paths
- Variable stroke width effects
- Additional curve types
- Post-generation filters and effects
- And more!
