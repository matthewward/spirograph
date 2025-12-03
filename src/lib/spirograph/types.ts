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

export type CurveType = 'hypotrochoid' | 'epitrochoid';
