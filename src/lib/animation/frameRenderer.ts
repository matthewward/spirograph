import { Point } from '../spirograph/types';
import { WaveEffectParams, applyWaveEffect } from './waveEffect';
import { applyEasing, EasingType } from './easing';

export interface FrameRenderOptions {
  basePoints: Point[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  viewBox: string;
  strokeColor: string;
  strokeWidth: number;
  backgroundColor: string;
  pathLength: number;

  // Animation settings
  waveEffect: WaveEffectParams;
  drawAnimationEnabled: boolean;
  drawDuration: number;
  drawEasing: EasingType;

  // Frame settings
  frameCount: number;
  size: number;
}

/**
 * Render a single frame of the animation to a canvas
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  options: FrameRenderOptions,
  frameIndex: number
): void {
  const {
    basePoints,
    bounds,
    viewBox,
    strokeColor,
    strokeWidth,
    backgroundColor,
    pathLength,
    waveEffect,
    drawAnimationEnabled,
    drawDuration,
    drawEasing,
    frameCount,
    size,
  } = options;

  // Clear canvas and fill background
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Calculate animation progress (0 to 1)
  const progress = frameIndex / (frameCount - 1);

  // Parse viewBox to get transform parameters
  const [vbMinX, vbMinY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);

  // Set up canvas transform to match viewBox
  ctx.save();
  const scaleX = size / vbWidth;
  const scaleY = size / vbHeight;
  ctx.scale(scaleX, scaleY);
  ctx.translate(-vbMinX, -vbMinY);

  // Apply wave effect if enabled
  const waveEnabled = waveEffect.enabled && waveEffect.animate;
  let points = basePoints;

  if (waveEnabled) {
    // Calculate wave offset based on wave animation speed and draw duration
    const waveOffset = (progress * drawDuration / waveEffect.animationSpeed) % 1;
    const modifiedWaveParams = { ...waveEffect, animationOffset: waveOffset };
    points = basePoints.map(p => applyWaveEffect(p, modifiedWaveParams, bounds));
  }

  // Set up stroke style
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'none';

  // Draw the path
  if (points.length > 0) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (drawAnimationEnabled) {
      // Apply draw animation (progressive reveal)
      const easedProgress = applyEasing(progress, drawEasing);
      const drawLength = pathLength * easedProgress;

      let currentLength = 0;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const segmentLength = Math.sqrt(
          Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
        );

        if (currentLength + segmentLength <= drawLength) {
          ctx.lineTo(curr.x, curr.y);
          currentLength += segmentLength;
        } else {
          // Partial segment
          const remaining = drawLength - currentLength;
          const ratio = remaining / segmentLength;
          const x = prev.x + (curr.x - prev.x) * ratio;
          const y = prev.y + (curr.y - prev.y) * ratio;
          ctx.lineTo(x, y);
          break;
        }
      }
    } else {
      // Draw complete path (wave-only animation)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }

    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Calculate the number of frames needed for one complete loop
 */
export function calculateFrameCount(
  drawDuration: number,
  waveEffect: WaveEffectParams,
  drawAnimationEnabled: boolean,
  fps: number
): number {
  const waveEnabled = waveEffect.enabled && waveEffect.animate;

  if (drawAnimationEnabled) {
    // Draw animation is master - use draw duration
    return Math.ceil(drawDuration * fps);
  } else if (waveEnabled) {
    // Wave-only - use wave animation speed
    return Math.ceil(waveEffect.animationSpeed * fps);
  }

  // Default to 1 second at specified FPS
  return fps;
}
