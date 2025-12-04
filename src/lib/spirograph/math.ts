import { Point, SpirographParams, CurveType } from "./types";

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
// function _lcm(a: number, b: number): number {
//   return Math.abs(a * b) / gcd(a, b);
// }

/**
 * Calculate the effective radius of a polygon wheel at a given rotation angle
 * @param angle - Rotation angle of the wheel in radians
 * @param baseRadius - Base radius of the wheel (circumradius)
 * @param sides - Number of polygon sides (1 = circle)
 * @param arcness - Edge curvature (0 = straight, 1 = max bulge)
 */
export function calculatePolygonRadius(
  angle: number,
  baseRadius: number,
  sides: number,
  arcness: number
): number {
  // Special case: circle (sides = 1)
  if (sides === 1) {
    return baseRadius;
  }

  // Calculate polygon geometry
  const segmentAngle = (2 * Math.PI) / sides;
  const halfSegment = segmentAngle / 2;

  // Normalize angle to [0, segmentAngle) for one segment
  const normalizedAngle = ((angle % segmentAngle) + segmentAngle) % segmentAngle;

  // Angle within segment, centered at 0 for vertex
  const angleInSegment = normalizedAngle - halfSegment;

  // Inradius (distance to edge midpoint) and circumradius (distance to vertex)
  const inradius = baseRadius * Math.cos(Math.PI / sides);
  const circumradius = baseRadius;

  if (arcness === 0) {
    // Straight edges: linear interpolation
    const t = Math.abs(angleInSegment) / halfSegment; // 0 at vertex, 1 at edge midpoint
    return circumradius * (1 - t) + inradius * t;
  } else {
    // Curved edges: superellipse-like bulge
    // Map arcness to create outward bulge
    const n = 2 + arcness * 4; // arcness 0 -> n=2 (ellipse), arcness 1 -> n=6 (high bulge)

    // Parametric angle for superellipse calculation
    const phi = (angleInSegment / halfSegment) * (Math.PI / 2);

    // Superellipse radius formula
    const cosN = Math.pow(Math.abs(Math.cos(phi)), n);
    const sinN = Math.pow(Math.abs(Math.sin(phi)), n);
    const radiusFactor = Math.pow(cosN + sinN, -1 / n);

    // Interpolate between inradius and bulged radius
    const maxBulge = circumradius * 1.2; // Bulges 20% beyond circumradius
    const targetRadius = inradius + arcness * (maxBulge - inradius);

    return targetRadius * radiusFactor;
  }
}

/**
 * Calculate the number of rotations needed for pattern completion
 * For hypotrochoid: based on r and (R-r)
 * For epitrochoid: based on r and (R+r)
 */
export function calculateRotations(
  R: number,
  r: number,
  curveType: CurveType = "hypotrochoid"
): number {
  // The complement depends on the curve type
  const complement = curveType === "hypotrochoid" ? R - r : R + r;

  // Find GCD to get the minimal number of rotations
  const divisor = gcd(Math.round(r), Math.round(complement));
  const rotations = r / divisor;

  return rotations;
}

/**
 * Generate a point on a hypotrochoid curve at parameter t
 * Hypotrochoid: wheel rolling inside a fixed circle
 */
export function hypotrochoidPoint(t: number, params: SpirographParams): Point {
  const { R, r, d, rotation = 0, sides = 1, arcness = 0 } = params;

  // Calculate wheel rotation angle
  const theta = ((R - r) / r) * t;

  // Get effective radius at this rotation angle
  const r_eff = calculatePolygonRadius(theta, r, sides, arcness);

  // Calculate point with variable radius
  const x = (R - r_eff) * Math.cos(t) + d * Math.cos(theta);
  const y = (R - r_eff) * Math.sin(t) - d * Math.sin(theta);

  // Apply rotation if specified
  if (rotation !== 0) {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    };
  }

  return { x, y };
}

/**
 * Generate a point on an epitrochoid curve at parameter t
 * Epitrochoid: wheel rolling outside a fixed circle
 */
export function epitrochoidPoint(t: number, params: SpirographParams): Point {
  const { R, r, d, rotation = 0, sides = 1, arcness = 0 } = params;

  // Calculate wheel rotation angle
  const theta = ((R + r) / r) * t;

  // Get effective radius at this rotation angle
  const r_eff = calculatePolygonRadius(theta, r, sides, arcness);

  // Calculate point with variable radius
  const x = (R + r_eff) * Math.cos(t) - d * Math.cos(theta);
  const y = (R + r_eff) * Math.sin(t) - d * Math.sin(theta);

  // Apply rotation if specified
  if (rotation !== 0) {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    };
  }

  return { x, y };
}

/**
 * Sample points along the spirograph curve
 */
export function sampleSpirograph(
  params: SpirographParams,
  curveType: CurveType = "hypotrochoid",
  samplesPerRotation: number = 360
): Point[] {
  const { R, r, completion } = params;
  const rotations = calculateRotations(R, r, curveType);

  // Apply completion percentage
  const effectiveRotations = rotations * (completion / 100);
  const totalSamples = Math.ceil(effectiveRotations * samplesPerRotation);
  const points: Point[] = [];

  const pointFunction =
    curveType === "hypotrochoid" ? hypotrochoidPoint : epitrochoidPoint;

  for (let i = 0; i <= totalSamples; i++) {
    const t = (i / samplesPerRotation) * (2 * Math.PI);
    points.push(pointFunction(t, params));
  }

  return points;
}

/**
 * Sample points with oscillating parameters
 * @param params - Base parameters
 * @param curveType - Type of curve
 * @param getOscillatedParams - Function that returns params at given progress (0-1)
 * @param samplesPerRotation - Samples per rotation
 */
export function sampleSpirographWithOscillation(
  params: SpirographParams,
  curveType: CurveType = "hypotrochoid",
  getOscillatedParams: (progress: number) => SpirographParams,
  samplesPerRotation: number = 360
): Point[] {
  const { R, r, completion } = params;
  const rotations = calculateRotations(R, r, curveType);

  // Apply completion percentage
  const effectiveRotations = rotations * (completion / 100);
  const totalSamples = Math.ceil(effectiveRotations * samplesPerRotation);
  const points: Point[] = [];

  const pointFunction =
    curveType === "hypotrochoid" ? hypotrochoidPoint : epitrochoidPoint;

  for (let i = 0; i <= totalSamples; i++) {
    const t = (i / samplesPerRotation) * (2 * Math.PI);
    const progress = totalSamples > 0 ? i / totalSamples : 0;

    // Get oscillated parameters at this progress point
    const oscillatedParams = getOscillatedParams(progress);

    points.push(pointFunction(t, oscillatedParams));
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
