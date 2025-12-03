import { useMemo } from 'react';
import { LoopDirection } from '../../hooks/useAnimation';
import { Point, CurveType } from '../../lib/spirograph/types';
import { pointsToPath } from '../../lib/svg/generator';
import { ColorOscillation } from '../../lib/animation/colorOscillation';
import { RingVisualization } from './RingVisualization';
import styles from './SpirographCanvas.module.css';

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
  colorOscillation: ColorOscillation;
  backgroundColor: string;
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
  showDot = false,
  showRings = false,
  R,
  r,
  d,
  curveType,
  colorOscillation,
  backgroundColor,
}: SpirographCanvasProps) {

  // For "continue" mode during erase, we need to slice the points array
  // and regenerate the path to remove points from the START
  const { actualPath, dashOffset, dashArray }: { actualPath: string; dashOffset: number; dashArray: number | string } = useMemo(() => {
    if (!isAnimating) {
      return { actualPath: pathString, dashOffset: 0, dashArray: pathLength };
    }

    // For "continue" mode during erase phase:
    // Slice points from the end (remove from start) and regenerate path
    if (loopDirection === 'continue' && isErasing) {
      const startIndex = Math.floor((1 - progress) * points.length);
      const slicedPoints = points.slice(startIndex);
      const newPath = pointsToPath(slicedPoints);

      return {
        actualPath: newPath,
        dashOffset: 0,
        dashArray: pathLength // No dash tricks needed!
      };
    }

    // Default behavior (none, pingpong, and continue during draw phase):
    // Normal stroke-dashoffset animation
    return {
      actualPath: pathString,
      dashOffset: pathLength * (1 - progress),
      dashArray: pathLength
    };
  }, [isAnimating, progress, pathLength, loopDirection, isErasing, points, pathString]);

  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <svg
        className={styles.svg}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
      >
        {/* Background grid for technical aesthetic */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

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

        {/* Ring visualization */}
        {showRings && (
          <RingVisualization
            R={R}
            r={r}
            d={d}
            progress={progress}
            isAnimating={isAnimating}
            curveType={curveType}
          />
        )}

        {/* Preview dot during animation */}
        {isAnimating && showDot && progress > 0 && progress < 1 && (
          <circle
            className={styles.previewDot}
            r={strokeWidth * 2}
            fill={strokeColor}
            style={{
              offsetPath: `path('${actualPath}')`,
              offsetDistance: loopDirection === 'continue' && isErasing
                ? '100%'  // Always at the end of the visible path during continue erase
                : `${progress * 100}%`,
            }}
          />
        )}
      </svg>
    </div>
  );
}
