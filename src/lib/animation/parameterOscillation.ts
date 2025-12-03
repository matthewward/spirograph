import { WaveType, applyWaveShape } from "./colorOscillation";

/**
 * Parameter oscillation configuration for a single parameter
 */
export interface ParameterOscillation {
  enabled: boolean;
  baseValue: number; // Center point (e.g., if pen is at 75)
  amplitude: number; // Range (e.g., 25 means ±25, so 50-100)
  frequency: number; // Number of complete cycles
  waveType: WaveType;
}

/**
 * Oscillation settings for all spirograph parameters
 */
export interface SpirographOscillations {
  R: ParameterOscillation; // Ring size
  r: ParameterOscillation; // Wheel size
  d: ParameterOscillation; // Pen position
}

/**
 * Get the oscillated value for a parameter at a given progress
 * @param progress - Animation progress (0 to 1)
 * @param oscillation - Oscillation configuration
 * @returns The oscillated parameter value
 */
export function getOscillatedValue(
  progress: number,
  oscillation: ParameterOscillation
): number {
  if (!oscillation.enabled) {
    return oscillation.baseValue;
  }

  // Calculate phase (0 to 1 for one complete cycle)
  const phase = (progress * oscillation.frequency) % 1;

  // Apply wave shape (returns 0 to 1)
  const shaped = applyWaveShape(phase, oscillation.waveType);

  // Convert to -1 to 1 range (centered oscillation)
  const centered = (shaped - 0.5) * 2;

  // Apply amplitude and add to base
  return oscillation.baseValue + centered * oscillation.amplitude;
}

/**
 * Create default oscillation config for a parameter
 */
export function createDefaultOscillation(
  baseValue: number
): ParameterOscillation {
  return {
    enabled: false,
    baseValue,
    amplitude: baseValue * 0.2, // Default to 20% range
    frequency: 1,
    waveType: "sine",
  };
}
