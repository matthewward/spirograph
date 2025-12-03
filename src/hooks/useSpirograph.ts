import { useState, useMemo } from 'react';
import { SpirographParams, Point, CurveType } from '../lib/spirograph/types';
import { sampleSpirograph, getBoundingBox } from '../lib/spirograph/math';
import { pointsToPath, simplifyPath, calculatePathLength } from '../lib/svg/generator';

export interface UseSpirographResult {
  params: SpirographParams;
  setParams: (params: Partial<SpirographParams>) => void;
  curveType: CurveType;
  setCurveType: (type: CurveType) => void;
  points: Point[];
  pathString: string;
  pathLength: number;
  viewBox: string;
}

const DEFAULT_PARAMS: SpirographParams = {
  R: 120,
  r: 48,
  d: 84,
  strokeWidth: 2,
  strokeColor: '#00d9ff',
};

export function useSpirograph(): UseSpirographResult {
  const [params, setParamsState] = useState<SpirographParams>(DEFAULT_PARAMS);
  const [curveType, setCurveType] = useState<CurveType>('hypotrochoid');

  const setParams = (newParams: Partial<SpirographParams>) => {
    setParamsState((prev) => ({ ...prev, ...newParams }));
  };

  // Memoize the expensive calculations
  const { points, pathString, pathLength, viewBox } = useMemo(() => {
    // Sample points from the parametric curve
    const rawPoints = sampleSpirograph(params, curveType, 360);

    // Simplify to reduce point count (adjust epsilon for quality vs performance)
    const simplifiedPoints = simplifyPath(rawPoints, 0.5);

    // Generate SVG path
    const path = pointsToPath(simplifiedPoints);

    // Calculate path length for animation
    const length = calculatePathLength(simplifiedPoints);

    // Get bounding box and create viewBox with padding
    const bbox = getBoundingBox(simplifiedPoints);
    const padding = 20;
    const vb = `${bbox.minX - padding} ${bbox.minY - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;

    return {
      points: simplifiedPoints,
      pathString: path,
      pathLength: length,
      viewBox: vb,
    };
  }, [params, curveType]);

  return {
    params,
    setParams,
    curveType,
    setCurveType,
    points,
    pathString,
    pathLength,
    viewBox,
  };
}
