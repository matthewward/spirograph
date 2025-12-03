import { Point, SpirographParams, CurveType } from './types';

/**
 * Calculate GCD (Greatest Common Divisor) using Euclidean algorithm
 */
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Calculate LCM (Least Common Multiple)
 */
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Calculate the number of rotations needed for pattern completion
 */
export function calculateRotations(R: number, r: number): number {
  // Pattern completes when the smaller circle returns to start
  // This happens after LCM(R, r) / r rotations of the fixed circle
  const rotations = lcm(R, r) / r;
  return rotations;
}

/**
 * Generate a point on a hypotrochoid curve at parameter t
 * Hypotrochoid: wheel rolling inside a fixed circle
 */
export function hypotrochoidPoint(
  t: number,
  params: SpirographParams
): Point {
  const { R, r, d } = params;
  const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
  const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
  return { x, y };
}

/**
 * Generate a point on an epitrochoid curve at parameter t
 * Epitrochoid: wheel rolling outside a fixed circle
 */
export function epitrochoidPoint(
  t: number,
  params: SpirographParams
): Point {
  const { R, r, d } = params;
  const x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
  const y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
  return { x, y };
}

/**
 * Sample points along the spirograph curve
 */
export function sampleSpirograph(
  params: SpirographParams,
  curveType: CurveType = 'hypotrochoid',
  samplesPerRotation: number = 360
): Point[] {
  const { R, r } = params;
  const rotations = calculateRotations(R, r);
  const totalSamples = Math.ceil(rotations * samplesPerRotation);
  const points: Point[] = [];

  const pointFunction =
    curveType === 'hypotrochoid' ? hypotrochoidPoint : epitrochoidPoint;

  for (let i = 0; i <= totalSamples; i++) {
    const t = (i / samplesPerRotation) * (2 * Math.PI);
    points.push(pointFunction(t, params));
  }

  return points;
}

/**
 * Get bounding box of points
 */
export function getBoundingBox(points: Point[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
