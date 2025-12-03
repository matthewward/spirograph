export type WaveType =
  | "sine"
  | "triangle"
  | "square"
  | "sawtooth"
  | "reverseSawtooth";

/**
 * Apply wave shape to phase (0-1 input, 0-1 output)
 */
export function applyWaveShape(phase: number, waveType: WaveType): number {
  switch (waveType) {
    case "sine":
      return (Math.sin(phase * 2 * Math.PI - Math.PI / 2) + 1) / 2;
    case "triangle":
      return phase < 0.5 ? phase * 2 : (1 - phase) * 2;
    case "square":
      return phase < 0.5 ? 0 : 1;
    case "sawtooth":
      return phase;
    case "reverseSawtooth":
      return 1 - phase;
  }
}
