import { WaveEffectParams } from "../animation/waveEffect";

export interface SpirographParams {
  R: number; // Fixed circle radius
  r: number; // Moving circle radius
  d: number; // Pen distance from center
  strokeWidth: number;
  strokeColor: string;
  completion: number; // Percentage of pattern to draw (0-100)
  duration: number; // Animation duration in seconds (1-30)
  rotation: number; // Starting rotation in degrees (0, 90, 180, 270)
  backgroundColor: string; // Canvas background color
  glowColor: string; // Glow effect color
  sides: number; // Number of polygon sides (1 = circle, 2+ = polygon)
  arcness: number; // Edge curvature (0 = straight, 1 = max bulge)
  arcnessEnabled: boolean; // Whether to use curved edges (true) or straight edges (false)
  waveEffect: WaveEffectParams; // Wave displacement effect
}

export interface Point {
  x: number;
  y: number;
}

export interface PathData {
  points: Point[];
  pathString: string;
  totalLength: number;
}

export type CurveType = "hypotrochoid" | "epitrochoid";
