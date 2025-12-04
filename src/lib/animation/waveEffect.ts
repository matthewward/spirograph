import { Point } from "../spirograph/types";

export type GradientType = "horizontal" | "vertical" | "radial";
export type DisplacementMode = "perpendicular" | "radial" | "horizontal" | "vertical";

export interface WaveEffectParams {
  enabled: boolean;
  gradientType: GradientType;
  frequency: number; // Number of stripes (1-12)
  amplitude: number; // Maximum displacement distance
  displacementMode: DisplacementMode;
  animationOffset: number; // 0-1, cycles the gradient
  easing: number; // 0-1, controls gradient interpolation curve (0 = linear, 1 = smooth)
}

/**
 * Sample a horizontal gradient at point (x, y)
 * Returns value 0-1 based on x position
 */
function sampleHorizontalGradient(
  x: number,
  y: number,
  minX: number,
  maxX: number,
  frequency: number,
  offset: number,
  easing: number
): number {
  const width = maxX - minX;
  const normalizedX = (x - minX) / width;
  const cyclicX = (normalizedX * frequency + offset) % 1;

  // Apply easing to create smooth or sharp gradients
  if (easing === 0) {
    return cyclicX; // Linear
  } else {
    // Smoothstep-style easing
    const t = cyclicX;
    const smooth = t * t * (3 - 2 * t);
    return cyclicX * (1 - easing) + smooth * easing;
  }
}

/**
 * Sample a vertical gradient at point (x, y)
 * Returns value 0-1 based on y position
 */
function sampleVerticalGradient(
  x: number,
  y: number,
  minY: number,
  maxY: number,
  frequency: number,
  offset: number,
  easing: number
): number {
  const height = maxY - minY;
  const normalizedY = (y - minY) / height;
  const cyclicY = (normalizedY * frequency + offset) % 1;

  if (easing === 0) {
    return cyclicY;
  } else {
    const t = cyclicY;
    const smooth = t * t * (3 - 2 * t);
    return cyclicY * (1 - easing) + smooth * easing;
  }
}

/**
 * Sample a radial gradient at point (x, y)
 * Returns value 0-1 based on distance from center
 */
function sampleRadialGradient(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  maxRadius: number,
  frequency: number,
  offset: number,
  easing: number
): number {
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const normalizedDistance = distance / maxRadius;
  const cyclicDistance = (normalizedDistance * frequency + offset) % 1;

  if (easing === 0) {
    return cyclicDistance;
  } else {
    const t = cyclicDistance;
    const smooth = t * t * (3 - 2 * t);
    return cyclicDistance * (1 - easing) + smooth * easing;
  }
}

/**
 * Sample the gradient at a given point
 */
export function sampleGradient(
  point: Point,
  gradientType: GradientType,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  frequency: number,
  offset: number,
  easing: number
): number {
  const { minX, maxX, minY, maxY } = bounds;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const maxRadius = Math.max(maxX - minX, maxY - minY) / 2;

  switch (gradientType) {
    case "horizontal":
      return sampleHorizontalGradient(point.x, point.y, minX, maxX, frequency, offset, easing);
    case "vertical":
      return sampleVerticalGradient(point.x, point.y, minY, maxY, frequency, offset, easing);
    case "radial":
      return sampleRadialGradient(point.x, point.y, centerX, centerY, maxRadius, frequency, offset, easing);
  }
}

/**
 * Calculate displacement vector for a point based on gradient value
 */
export function calculateDisplacement(
  point: Point,
  gradientValue: number,
  amplitude: number,
  displacementMode: DisplacementMode,
  centerX: number,
  centerY: number
): { dx: number; dy: number } {
  // Convert gradient value (0-1) to wave value (-1 to 1)
  const waveValue = Math.sin(gradientValue * Math.PI * 2);
  const displacement = waveValue * amplitude;

  switch (displacementMode) {
    case "horizontal":
      return { dx: displacement, dy: 0 };

    case "vertical":
      return { dx: 0, dy: displacement };

    case "radial": {
      // Displace along radial direction from center
      const dx = point.x - centerX;
      const dy = point.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        return { dx: 0, dy: 0 };
      }

      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;

      return {
        dx: normalizedDx * displacement,
        dy: normalizedDy * displacement,
      };
    }

    case "perpendicular": {
      // Displace perpendicular to radial direction
      const dx = point.x - centerX;
      const dy = point.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        return { dx: 0, dy: 0 };
      }

      // Perpendicular vector is (-dy, dx) normalized
      const normalizedPerp = {
        x: -dy / distance,
        y: dx / distance,
      };

      return {
        dx: normalizedPerp.x * displacement,
        dy: normalizedPerp.y * displacement,
      };
    }
  }
}

/**
 * Apply wave effect to a point
 */
export function applyWaveEffect(
  point: Point,
  params: WaveEffectParams,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): Point {
  if (!params.enabled || params.amplitude === 0) {
    return point;
  }

  const { minX, maxX, minY, maxY } = bounds;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Sample gradient at point location
  const gradientValue = sampleGradient(
    point,
    params.gradientType,
    bounds,
    params.frequency,
    params.animationOffset,
    params.easing
  );

  // Calculate displacement
  const { dx, dy } = calculateDisplacement(
    point,
    gradientValue,
    params.amplitude,
    params.displacementMode,
    centerX,
    centerY
  );

  // Apply displacement
  return {
    x: point.x + dx,
    y: point.y + dy,
  };
}
