import { SpirographParams } from '../lib/spirograph/types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  params: SpirographParams;
}

export const presets: Preset[] = [
  {
    id: 'classic-flower',
    name: 'Classic Flower',
    description: 'A traditional spirograph pattern with 6 petals',
    params: {
      R: 120,
      r: 48,
      d: 84,
      strokeWidth: 2,
      strokeColor: '#00d9ff',
    },
  },
  {
    id: 'neon-star',
    name: 'Neon Star',
    description: 'Sharp angular pattern with vibrant colors',
    params: {
      R: 150,
      r: 25,
      d: 50,
      strokeWidth: 2.5,
      strokeColor: '#ff0080',
    },
  },
  {
    id: 'galaxy-spiral',
    name: 'Galaxy Spiral',
    description: 'Dense spiral resembling a galaxy',
    params: {
      R: 180,
      r: 72,
      d: 120,
      strokeWidth: 1.5,
      strokeColor: '#8b5cf6',
    },
  },
  {
    id: 'atomic-orbit',
    name: 'Atomic Orbit',
    description: 'Electron-like orbital pattern',
    params: {
      R: 100,
      r: 33,
      d: 60,
      strokeWidth: 2,
      strokeColor: '#10b981',
    },
  },
  {
    id: 'golden-mandala',
    name: 'Golden Mandala',
    description: 'Complex symmetrical pattern',
    params: {
      R: 140,
      r: 56,
      d: 98,
      strokeWidth: 2,
      strokeColor: '#f59e0b',
    },
  },
  {
    id: 'cosmic-web',
    name: 'Cosmic Web',
    description: 'Intricate web-like structure',
    params: {
      R: 160,
      r: 40,
      d: 110,
      strokeWidth: 1.5,
      strokeColor: '#06b6d4',
    },
  },
];
