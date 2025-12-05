import { useState, useMemo, useEffect, useRef } from "react";
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
import { applyWaveEffect } from "../lib/animation/waveEffect";

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
  const sides = randomInt(-6, 6);
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
    sides: sides === 0 ? 1 : sides,
    arcness: 0,
    arcnessEnabled: false,
    waveEffect: {
      enabled: false,
      gradientType: "horizontal",
      frequency: 1,
      amplitude: 10,
      displacementMode: "perpendicular",
      animationOffset: 0,
      easing: 0.5,
      animate: false,
      animationSpeed: 5,
    },
  };
}

// Check if URL state exists (only generate random defaults if no URL state)
function hasURLState(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.has("state");
}

function getInitialParams(): SpirographParams {
  // Only use random defaults if no URL state exists
  // URL state will be loaded in useEffect and override these
  return hasURLState()
    ? {
        R: 120,
        r: 48,
        d: 84,
        strokeWidth: 0.5,
        strokeColor: "#ffffff",
        completion: 100,
        duration: 5,
        rotation: 90,
        backgroundColor: "#222222",
        sides: 1,
        arcness: 0,
        arcnessEnabled: false,
        waveEffect: {
          enabled: false,
          gradientType: "horizontal",
          frequency: 1,
          amplitude: 10,
          displacementMode: "perpendicular",
          animationOffset: 0,
          easing: 0.5,
          animate: false,
          animationSpeed: 5,
        },
      }
    : getRandomDefaultParams();
}

function getInitialCurveType(): CurveType {
  return hasURLState()
    ? "hypotrochoid"
    : randomItem<CurveType>(["hypotrochoid", "epitrochoid"]);
}

function getInitialOscillations(
  baseParams: SpirographParams
): SpirographOscillations {
  return {
    R: createDefaultOscillation(baseParams.R),
    r: createDefaultOscillation(baseParams.r),
    d: createDefaultOscillation(baseParams.d),
  };
}

const INITIAL_PARAMS = getInitialParams();

export function useSpirograph(): UseSpirographResult {
  const [params, setParamsState] = useState<SpirographParams>(INITIAL_PARAMS);
  const [curveType, setCurveType] = useState<CurveType>(getInitialCurveType());
  const [parameterOscillations, setParameterOscillationsState] =
    useState<SpirographOscillations>(getInitialOscillations(INITIAL_PARAMS));

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Animate wave effect offset when animate is enabled
  useEffect(() => {
    if (!params.waveEffect.enabled || !params.waveEffect.animate) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        startTimeRef.current = null;
      }
      return;
    }

    const animateWave = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const duration = params.waveEffect.animationSpeed * 1000; // Convert seconds to milliseconds
      const newOffset = (elapsed / duration) % 1;

      setParamsState((prev) => ({
        ...prev,
        waveEffect: {
          ...prev.waveEffect,
          animationOffset: newOffset,
        },
      }));

      animationFrameRef.current = requestAnimationFrame(animateWave);
    };

    animationFrameRef.current = requestAnimationFrame(animateWave);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    params.waveEffect.enabled,
    params.waveEffect.animate,
    params.waveEffect.animationSpeed,
  ]);

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
    let simplifiedPoints = simplifyPath(rawPoints, 0.1);

    // Apply wave effect if enabled
    if (params.waveEffect.enabled) {
      const bbox = getBoundingBox(simplifiedPoints);
      const bounds = {
        minX: bbox.minX,
        maxX: bbox.maxX,
        minY: bbox.minY,
        maxY: bbox.maxY,
      };

      simplifiedPoints = simplifiedPoints.map((point) =>
        applyWaveEffect(point, params.waveEffect, bounds)
      );
    }

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
