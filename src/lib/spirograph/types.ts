export interface SpirographParams {
  R: number; // Fixed circle radius
  r: number; // Moving circle radius
  d: number; // Pen distance from center
  strokeWidth: number;
  strokeColor: string;
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
