export type WaveType = 'sine' | 'triangle' | 'square' | 'sawtooth' | 'reverseSawtooth';

export interface ColorOscillation {
  enabled: boolean;
  colors: string[];        // Array of hex colors (minimum 2)
  frequency: number;       // Multiplier (1, 2, 3, 4, etc.)
  waveType: WaveType;
}

/**
 * Apply wave shape to phase (0-1 input, 0-1 output)
 */
export function applyWaveShape(phase: number, waveType: WaveType): number {
  switch (waveType) {
    case 'sine':
      return (Math.sin(phase * 2 * Math.PI - Math.PI / 2) + 1) / 2;
    case 'triangle':
      return phase < 0.5 ? phase * 2 : (1 - phase) * 2;
    case 'square':
      return phase < 0.5 ? 0 : 1;
    case 'sawtooth':
      return phase;
    case 'reverseSawtooth':
      return 1 - phase;
  }
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => Math.round(x).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Linear interpolation between two colors
 */
function lerpColor(hex1: string, hex2: string, t: number): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);

  const r = c1.r + (c2.r - c1.r) * t;
  const g = c1.g + (c2.g - c1.g) * t;
  const b = c1.b + (c2.b - c1.b) * t;

  return rgbToHex(r, g, b);
}

/**
 * Get oscillated color at given progress
 * Used for both temporal changes and path-based gradients
 */
export function getOscillatedColor(
  progress: number,
  oscillation: ColorOscillation
): string {
  if (!oscillation.enabled || oscillation.colors.length < 2) {
    return oscillation.colors[0] || '#00d9ff';
  }

  // Calculate phase (0 to 1 for one complete cycle)
  const phase = (progress * oscillation.frequency) % 1;

  // Apply wave shape
  const shaped = applyWaveShape(phase, oscillation.waveType);

  // Map to color range
  const colorIndex = shaped * (oscillation.colors.length - 1);
  const idx1 = Math.floor(colorIndex);
  const idx2 = Math.min(idx1 + 1, oscillation.colors.length - 1);
  const blend = colorIndex - idx1;

  return lerpColor(oscillation.colors[idx1], oscillation.colors[idx2], blend);
}

/**
 * Create a color function for use with createColoredSegments
 */
export function createColorFunction(oscillation: ColorOscillation): (progress: number) => string {
  return (progress: number) => getOscillatedColor(progress, oscillation);
}

/**
 * Generate SVG gradient stops for path-based color oscillation
 * Creates a gradient that varies along the path itself
 */
export interface GradientStop {
  offset: number;  // 0 to 1
  color: string;   // hex color
}

export function generateGradientStops(
  oscillation: ColorOscillation,
  numStops: number = 100
): GradientStop[] {
  const stops: GradientStop[] = [];

  for (let i = 0; i <= numStops; i++) {
    const offset = i / numStops;

    // Calculate phase based on position along path
    const phase = (offset * oscillation.frequency) % 1;

    // Apply wave shape
    const shaped = applyWaveShape(phase, oscillation.waveType);

    // Map to color range
    const colorIndex = shaped * (oscillation.colors.length - 1);
    const idx1 = Math.floor(colorIndex);
    const idx2 = Math.min(idx1 + 1, oscillation.colors.length - 1);
    const blend = colorIndex - idx1;

    const color = lerpColor(oscillation.colors[idx1], oscillation.colors[idx2], blend);

    stops.push({ offset, color });
  }

  return stops;
}
