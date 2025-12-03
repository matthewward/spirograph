import { useState, useMemo } from 'react';
import { SpirographParams, Point, CurveType } from '../lib/spirograph/types';
import { sampleSpirograph, sampleSpirographWithOscillation, getBoundingBox } from '../lib/spirograph/math';
import { pointsToPath, simplifyPath, calculatePathLength } from '../lib/svg/generator';
import { ColorOscillation } from '../lib/animation/colorOscillation';
import { SpirographOscillations, createDefaultOscillation, getOscillatedValue } from '../lib/animation/parameterOscillation';

export interface UseSpirographResult {
  params: SpirographParams;
  setParams: (params: Partial<SpirographParams>) => void;
  curveType: CurveType;
  setCurveType: (type: CurveType) => void;
  colorOscillation: ColorOscillation;
  setColorOscillation: (oscillation: Partial<ColorOscillation>) => void;
  parameterOscillations: SpirographOscillations;
  setParameterOscillations: (oscillations: Partial<SpirographOscillations>) => void;
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
  completion: 100,
  duration: 5, // 5 seconds default
  rotation: 0, // 0 = 3 o'clock (default)
  backgroundColor: '#111529', // current bg-secondary value
};

export function useSpirograph(): UseSpirographResult {
  const [params, setParamsState] = useState<SpirographParams>(DEFAULT_PARAMS);
  const [curveType, setCurveType] = useState<CurveType>('hypotrochoid');
  const [colorOscillation, setColorOscillationState] = useState<ColorOscillation>({
    enabled: false,
    colors: ['#00d9ff', '#ff00ff'],  // Default: cyan to magenta
    frequency: 1,
    waveType: 'sine',
  });
  const [parameterOscillations, setParameterOscillationsState] = useState<SpirographOscillations>({
    R: createDefaultOscillation(DEFAULT_PARAMS.R),
    r: createDefaultOscillation(DEFAULT_PARAMS.r),
    d: createDefaultOscillation(DEFAULT_PARAMS.d),
  });

  const setParams = (newParams: Partial<SpirographParams>) => {
    setParamsState((prev) => {
      const updated = { ...prev, ...newParams };
      // Update base values in oscillations when params change
      setParameterOscillationsState(prevOsc => ({
        R: { ...prevOsc.R, baseValue: updated.R },
        r: { ...prevOsc.r, baseValue: updated.r },
        d: { ...prevOsc.d, baseValue: updated.d },
      }));
      return updated;
    });
  };

  const setColorOscillation = (update: Partial<ColorOscillation>) => {
    setColorOscillationState((prev) => ({ ...prev, ...update }));
  };

  const setParameterOscillations = (update: Partial<SpirographOscillations>) => {
    setParameterOscillationsState((prev) => ({
      ...prev,
      ...update,
    }));
  };

  // Check if any oscillation is enabled
  const hasOscillations = useMemo(() => {
    return parameterOscillations.R.enabled ||
           parameterOscillations.r.enabled ||
           parameterOscillations.d.enabled;
  }, [parameterOscillations]);

  // Memoize the expensive calculations
  const { points, pathString, pathLength, viewBox } = useMemo(() => {
    let rawPoints: Point[];

    if (hasOscillations) {
      // Use oscillating parameter sampling
      const getOscillatedParams = (progress: number): SpirographParams => ({
        ...params,
        R: getOscillatedValue(progress, parameterOscillations.R),
        r: getOscillatedValue(progress, parameterOscillations.r),
        d: getOscillatedValue(progress, parameterOscillations.d),
      });
      rawPoints = sampleSpirographWithOscillation(params, curveType, getOscillatedParams, 720);
    } else {
      // Normal sampling without oscillation
      rawPoints = sampleSpirograph(params, curveType, 720);
    }

    // Simplify to reduce point count (lower epsilon for smoother curves)
    const simplifiedPoints = simplifyPath(rawPoints, 0.1);

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
  }, [params, curveType, parameterOscillations, hasOscillations]);

  return {
    params,
    setParams,
    curveType,
    setCurveType,
    colorOscillation,
    setColorOscillation,
    parameterOscillations,
    setParameterOscillations,
    points,
    pathString,
    pathLength,
    viewBox,
  };
}
