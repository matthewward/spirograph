import { useState, useMemo } from "react";
import { SpirographParams, Point, CurveType } from "../lib/spirograph/types";
import {
  sampleSpirograph,
  sampleSpirographWithOscillation,
  getBoundingBox,
} from "../lib/spirograph/math";
import {
  pointsToPath,
  simplifyPath,
  calculatePathLength,
} from "../lib/svg/generator";
import {
  SpirographOscillations,
  createDefaultOscillation,
  getOscillatedValue,
} from "../lib/animation/parameterOscillation";

export interface UseSpirographResult {
  params: SpirographParams;
  setParams: (params: Partial<SpirographParams>) => void;
  curveType: CurveType;
  setCurveType: (type: CurveType) => void;
  parameterOscillations: SpirographOscillations;
  setParameterOscillations: (
    oscillations: Partial<SpirographOscillations>
  ) => void;
  points: Point[];
  pathString: string;
  pathLength: number;
  viewBox: string;
}

// Randomization utilities
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  const value = Math.random() * (max - min) + min;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomDefaultParams(): SpirographParams {
  const R = randomInt(50, 200);
  const r = randomInt(10, Math.min(150, R - 10)); // Ensure r < R

  return {
    R,
    r,
    d: randomInt(10, 150),
    strokeWidth: 0.5,
    strokeColor: "#ffffff",
    completion: 100,
    duration: randomFloat(2, 10, 1),
    rotation: 90,
    backgroundColor: "#222222",
  };
}

const DEFAULT_PARAMS: SpirographParams = getRandomDefaultParams();

export function useSpirograph(): UseSpirographResult {
  const [params, setParamsState] = useState<SpirographParams>(DEFAULT_PARAMS);
  const [curveType, setCurveType] = useState<CurveType>(
    randomItem<CurveType>(["hypotrochoid", "epitrochoid"])
  );
  const [parameterOscillations, setParameterOscillationsState] =
    useState<SpirographOscillations>({
      R: createDefaultOscillation(DEFAULT_PARAMS.R),
      r: createDefaultOscillation(DEFAULT_PARAMS.r),
      d: createDefaultOscillation(DEFAULT_PARAMS.d),
    });

  const setParams = (newParams: Partial<SpirographParams>) => {
    setParamsState((prev) => {
      const updated = { ...prev, ...newParams };
      // Update base values in oscillations when params change
      setParameterOscillationsState((prevOsc) => ({
        R: { ...prevOsc.R, baseValue: updated.R },
        r: { ...prevOsc.r, baseValue: updated.r },
        d: { ...prevOsc.d, baseValue: updated.d },
      }));
      return updated;
    });
  };

  const setParameterOscillations = (
    update: Partial<SpirographOscillations>
  ) => {
    setParameterOscillationsState((prev) => ({
      ...prev,
      ...update,
    }));
  };

  // Check if any oscillation is enabled
  const hasOscillations = useMemo(() => {
    return (
      parameterOscillations.R.enabled ||
      parameterOscillations.r.enabled ||
      parameterOscillations.d.enabled
    );
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
      rawPoints = sampleSpirographWithOscillation(
        params,
        curveType,
        getOscillatedParams,
        720
      );
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
    parameterOscillations,
    setParameterOscillations,
    points,
    pathString,
    pathLength,
    viewBox,
  };
}
