import { useMemo } from "react";
import { LoopDirection } from "../../hooks/useAnimation";
import { Point, CurveType } from "../../lib/spirograph/types";
import { pointsToPath } from "../../lib/svg/generator";
import { WaveEffectParams } from "../../lib/animation/waveEffect";
import styles from "./SpirographCanvas.module.css";

interface SpirographCanvasProps {
  points: Point[];
  pathString: string;
  viewBox: string;
  strokeColor: string;
  strokeWidth: number;
  pathLength: number;
  isAnimating: boolean;
  progress: number;
  loopDirection: LoopDirection;
  isErasing?: boolean;
  showDot?: boolean;
  showRings?: boolean;
  R: number;
  r: number;
  d: number;
  curveType: CurveType;
  backgroundColor: string;
  waveEffect: WaveEffectParams;
  showGradientOverlay?: boolean;
}

export function SpirographCanvas({
  points,
  pathString,
  viewBox,
  strokeColor,
  strokeWidth,
  pathLength,
  isAnimating,
  progress,
  loopDirection,
  isErasing = false,
  showDot: _showDot = false,
  showRings: _showRings = false,
  R: _R,
  r: _r,
  d: _d,
  curveType: _curveType,
  backgroundColor,
  waveEffect,
  showGradientOverlay = false,
}: SpirographCanvasProps) {
  // For "continue" mode during erase, we need to slice the points array
  // and regenerate the path to remove points from the START
  const {
    actualPath,
    dashOffset,
    dashArray,
  }: { actualPath: string; dashOffset: number; dashArray: number | string } =
    useMemo(() => {
      if (!isAnimating) {
        return { actualPath: pathString, dashOffset: 0, dashArray: pathLength };
      }

      // For "continue" mode during erase phase:
      // Slice points from the end (remove from start) and regenerate path
      if (loopDirection === "continue" && isErasing) {
        const startIndex = Math.floor((1 - progress) * points.length);
        const slicedPoints = points.slice(startIndex);
        const newPath = pointsToPath(slicedPoints);

        return {
          actualPath: newPath,
          dashOffset: 0,
          dashArray: pathLength, // No dash tricks needed!
        };
      }

      // Default behavior (none, pingpong, and continue during draw phase):
      // Normal stroke-dashoffset animation
      return {
        actualPath: pathString,
        dashOffset: pathLength * (1 - progress),
        dashArray: pathLength,
      };
    }, [
      isAnimating,
      progress,
      pathLength,
      loopDirection,
      isErasing,
      points,
      pathString,
    ]);

  // Generate gradient overlay CSS
  const gradientOverlayStyle = useMemo(() => {
    if (!showGradientOverlay || !waveEffect.enabled) return undefined;

    const stops: Array<{ position: number; color: string }> = [];

    // Sample the gradient at many points to create a smooth visualization
    // This matches the continuous mathematical gradient used in waveEffect.ts
    const numSamples = 100; // High resolution for smooth gradients

    for (let i = 0; i <= numSamples; i++) {
      const normalizedPosition = i / numSamples;

      // Apply offset (same formula as in waveEffect.ts)
      const cyclicValue = (normalizedPosition * waveEffect.frequency + waveEffect.animationOffset) % 1;

      // Apply easing (same formula as in waveEffect.ts)
      let gradientValue;
      if (waveEffect.easing === 0) {
        gradientValue = cyclicValue; // Linear
      } else {
        // Smoothstep-style easing
        const smooth = cyclicValue * cyclicValue * (3 - 2 * cyclicValue);
        gradientValue = cyclicValue * (1 - waveEffect.easing) + smooth * waveEffect.easing;
      }

      // Convert gradient value (0-1) to wave displacement value (-1 to 1)
      // This matches the sine wave conversion in waveEffect.ts line 139
      const waveValue = Math.sin(gradientValue * Math.PI * 2);

      // Map wave value from [-1, 1] to [0, 255] for visualization
      const grayValue = Math.round((waveValue + 1) * 127.5);
      const color = `rgba(${grayValue}, ${grayValue}, ${grayValue}, 0.5)`;

      stops.push({ position: normalizedPosition * 100, color });
    }

    const gradientStops = stops.map((s) => `${s.color} ${s.position}%`).join(", ");

    switch (waveEffect.gradientType) {
      case "horizontal":
        return `linear-gradient(to right, ${gradientStops})`;
      case "vertical":
        return `linear-gradient(to bottom, ${gradientStops})`;
      case "radial":
        return `radial-gradient(circle, ${gradientStops})`;
    }
  }, [showGradientOverlay, waveEffect]);

  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <svg
        className={styles.svg}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
      >
        {/* The spirograph path */}
        <path
          d={actualPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            isAnimating
              ? {
                  strokeDasharray: dashArray,
                  strokeDashoffset: dashOffset,
                }
              : undefined
          }
        />

        {/* Preview dot during animation */}
        {/* {isAnimating && showDot && progress > 0 && progress < 1 && (
          <circle
            className={styles.previewDot}
            r={strokeWidth * 2}
            fill={strokeColor}
            style={{
              offsetPath: `path('${actualPath}')`,
              offsetDistance:
                loopDirection === "continue" && isErasing
                  ? "100%" // Always at the end of the visible path during continue erase
                  : `${progress * 100}%`,
            }}
          />
        )} */}
      </svg>

      {/* Gradient overlay for debugging */}
      {showGradientOverlay && gradientOverlayStyle && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradientOverlayStyle,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
