import { useMemo } from 'react';
import { CurveType } from '../../lib/spirograph/types';
import { calculateRotations } from '../../lib/spirograph/math';

interface RingVisualizationProps {
  R: number;           // Fixed ring radius
  r: number;           // Moving circle radius
  d: number;           // Pen distance
  progress: number;    // Animation progress (0-1)
  isAnimating: boolean;
  curveType?: CurveType;
}

export function RingVisualization({
  R, r, d, progress, isAnimating, curveType = 'hypotrochoid'
}: RingVisualizationProps) {
  // Calculate current angle based on progress
  const { circleCenter, penPoint } = useMemo(() => {
    // Calculate based on progress through the pattern
    // This requires knowing total rotations
    const rotations = calculateRotations(R, r, curveType);
    const t = progress * rotations * 2 * Math.PI;

    // IMPORTANT: Different formulas for inside vs outside
    const isInside = curveType === 'hypotrochoid';
    const centerDistance = isInside ? (R - r) : (R + r);
    const rotationFactor = isInside ? ((R - r) / r) : ((R + r) / r);

    // Moving circle center
    const centerX = centerDistance * Math.cos(t);
    const centerY = centerDistance * Math.sin(t);

    // Circle rotation angle
    const circleAngle = rotationFactor * t;

    // Pen point position (matches parametric equations)
    const penX = isInside
      ? centerX + d * Math.cos(circleAngle)
      : centerX - d * Math.cos(circleAngle);
    const penY = isInside
      ? centerY - d * Math.sin(circleAngle)
      : centerY - d * Math.sin(circleAngle);

    return {
      circleCenter: { x: centerX, y: centerY },
      penPoint: { x: penX, y: penY }
    };
  }, [R, r, d, progress, curveType]);

  return (
    <g className="ring-visualization" opacity={0.4}>
      {/* Fixed outer ring */}
      <circle
        cx={0}
        cy={0}
        r={R}
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth={1.5}
        strokeDasharray="5,5"
      />

      {/* Moving inner circle */}
      <circle
        cx={circleCenter.x}
        cy={circleCenter.y}
        r={r}
        fill="none"
        stroke="rgba(100, 200, 255, 0.5)"
        strokeWidth={1.5}
      />

      {/* Connection line from origin to moving circle center */}
      <line
        x1={0}
        y1={0}
        x2={circleCenter.x}
        y2={circleCenter.y}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={1}
      />

      {/* Connection line from circle center to pen point */}
      <line
        x1={circleCenter.x}
        y1={circleCenter.y}
        x2={penPoint.x}
        y2={penPoint.y}
        stroke="rgba(255, 100, 100, 0.5)"
        strokeWidth={1.5}
      />

      {/* Pen point dot */}
      <circle
        cx={penPoint.x}
        cy={penPoint.y}
        r={3}
        fill="rgba(255, 100, 100, 0.8)"
      />

      {/* Center dot of moving circle */}
      <circle
        cx={circleCenter.x}
        cy={circleCenter.y}
        r={2}
        fill="rgba(100, 200, 255, 0.8)"
      />
    </g>
  );
}
