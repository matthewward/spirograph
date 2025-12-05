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
  glowColor?: string;
  waveEffect: WaveEffectParams;
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
  glowColor,
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

  // Convert hex color to rgba for glow effect
  const hexToRgba = (hex: string | undefined, alpha: number = 0.3) => {
    if (!hex) return `rgba(0, 217, 255, ${alpha})`; // Default cyan if undefined
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <svg
        className={styles.svg}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        style={{
          filter: `drop-shadow(0 0 20px ${hexToRgba(glowColor)})`,
        }}
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
    </div>
  );
}
