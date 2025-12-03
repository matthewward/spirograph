import { useMemo } from 'react';
import styles from './SpirographCanvas.module.css';

interface SpirographCanvasProps {
  pathString: string;
  viewBox: string;
  strokeColor: string;
  strokeWidth: number;
  pathLength: number;
  isAnimating: boolean;
  progress: number;
}

export function SpirographCanvas({
  pathString,
  viewBox,
  strokeColor,
  strokeWidth,
  pathLength,
  isAnimating,
  progress,
}: SpirographCanvasProps) {
  // Calculate stroke-dashoffset for animation
  const dashOffset = useMemo(() => {
    if (!isAnimating) return 0;
    return pathLength * (1 - progress);
  }, [isAnimating, progress, pathLength]);

  return (
    <div className={styles.container}>
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
          d={pathString}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            isAnimating
              ? {
                  strokeDasharray: pathLength,
                  strokeDashoffset: dashOffset,
                }
              : undefined
          }
        />

        {/* Preview dot during animation */}
        {isAnimating && progress > 0 && progress < 1 && (
          <circle
            className={styles.previewDot}
            r={strokeWidth * 2}
            fill={strokeColor}
            style={{
              offsetPath: `path('${pathString}')`,
              offsetDistance: `${progress * 100}%`,
            }}
          />
        )}
      </svg>
    </div>
  );
}
