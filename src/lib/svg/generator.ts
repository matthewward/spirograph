import { Point } from '../spirograph/types';

/**
 * Convert array of points to SVG path string
 */
export function pointsToPath(points: Point[]): string {
  if (points.length === 0) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }

  return path;
}

/**
 * Calculate the total length of a path (approximation)
 */
export function calculatePathLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

/**
 * Simplify path using Ramer-Douglas-Peucker algorithm
 * This reduces the number of points while maintaining shape
 */
export function simplifyPath(points: Point[], epsilon: number = 1): Point[] {
  if (points.length <= 2) return points;

  // Find the point with maximum distance from line segment
  let maxDistance = 0;
  let maxIndex = 0;

  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], start, end);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    const leftPart = simplifyPath(points.slice(0, maxIndex + 1), epsilon);
    const rightPart = simplifyPath(points.slice(maxIndex), epsilon);

    // Concatenate, removing duplicate point at junction
    return [...leftPart.slice(0, -1), ...rightPart];
  } else {
    // Return just the endpoints
    return [start, end];
  }
}

/**
 * Calculate perpendicular distance from point to line segment
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  // Normalize
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return 0;

  const u = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (mag * mag);

  let closestPoint: Point;
  if (u < 0) {
    closestPoint = lineStart;
  } else if (u > 1) {
    closestPoint = lineEnd;
  } else {
    closestPoint = {
      x: lineStart.x + u * dx,
      y: lineStart.y + u * dy,
    };
  }

  const distX = point.x - closestPoint.x;
  const distY = point.y - closestPoint.y;

  return Math.sqrt(distX * distX + distY * distY);
}
