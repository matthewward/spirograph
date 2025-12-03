import { useState, useEffect, useRef } from 'react';
import { EasingType, applyEasing } from '../lib/animation/easing';

export type LoopDirection = 'none' | 'continue' | 'pingpong';

export interface UseAnimationResult {
  isPlaying: boolean;
  progress: number; // 0 to 1
  isErasing: boolean; // true when in erase phase for continue mode
  speed: number; // 0.25 to 4
  easing: EasingType;
  loopDirection: LoopDirection;
  showDot: boolean;
  showRings: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setProgress: (progress: number) => void;
  setSpeed: (speed: number) => void;
  setEasing: (easing: EasingType) => void;
  setLoopDirection: (direction: LoopDirection) => void;
  setShowDot: (show: boolean) => void;
  setShowRings: (show: boolean) => void;
}

/**
 * Calculate progress based on loop direction
 * Returns { progress, isErasing }
 * - none: 0 -> 1 (stops)
 * - continue: 0 -> 1 (drawing) then 1 -> 0 (erasing forward from end)
 * - pingpong: 0 -> 1 -> 0 (reverses direction)
 */
function calculateProgress(elapsed: number, duration: number, loopDirection: LoopDirection): { progress: number; isErasing: boolean } {
  if (loopDirection === 'none') {
    return { progress: Math.min(elapsed / duration, 1), isErasing: false };
  }

  const cycleDuration = duration * 2; // Full cycle = draw + undraw
  const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
  const isInSecondHalf = cycleProgress >= 0.5;

  if (loopDirection === 'pingpong') {
    // Pingpong: 0 -> 1 -> 0 (reverses direction, erases backwards)
    if (cycleProgress < 0.5) {
      return { progress: cycleProgress * 2, isErasing: false }; // 0 to 1 (drawing)
    } else {
      return { progress: 2 - (cycleProgress * 2), isErasing: true }; // 1 to 0 (undrawing backwards)
    }
  } else {
    // Continue: always go forward
    // Draw: 0 -> 1 (normal)
    // Erase: 1 -> 0 (but erasing from the END, going forward)
    if (cycleProgress < 0.5) {
      return { progress: cycleProgress * 2, isErasing: false }; // 0 to 1 (drawing)
    } else {
      return { progress: 2 - (cycleProgress * 2), isErasing: true }; // 1 to 0 (erasing)
    }
  }
}

export function useAnimation(duration: number = 5000): UseAnimationResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [easing, setEasing] = useState<EasingType>('linear');
  const [loopDirection, setLoopDirection] = useState<LoopDirection>('none');
  const [showDot, setShowDot] = useState(false);
  const [showRings, setShowRings] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pausedProgressRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const adjustedDuration = duration / speed;

      // Calculate raw progress based on loop direction
      const { progress: rawProgress, isErasing: rawIsErasing } = calculateProgress(
        elapsed + (pausedProgressRef.current * adjustedDuration),
        adjustedDuration,
        loopDirection
      );

      // Apply easing to the raw progress
      const easedProgress = applyEasing(rawProgress, easing);

      setProgress(easedProgress);
      setIsErasing(rawIsErasing);

      // For non-looping animations, stop at 1
      // For looping animations, run indefinitely
      if (loopDirection === 'none' && rawProgress >= 1) {
        setIsPlaying(false);
        startTimeRef.current = null;
        pausedProgressRef.current = 0;
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration, speed, easing, loopDirection]);

  const play = () => {
    if (progress >= 1) {
      // Reset if at the end
      setProgress(0);
      pausedProgressRef.current = 0;
    } else {
      pausedProgressRef.current = progress;
    }
    startTimeRef.current = null;
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
    pausedProgressRef.current = progress;
  };

  const reset = () => {
    setIsPlaying(false);
    setProgress(0);
    pausedProgressRef.current = 0;
    startTimeRef.current = null;
  };

  const handleSetProgress = (newProgress: number) => {
    setProgress(newProgress);
    pausedProgressRef.current = newProgress;
    startTimeRef.current = null;
  };

  return {
    isPlaying,
    progress,
    isErasing,
    speed,
    easing,
    loopDirection,
    showDot,
    showRings,
    play,
    pause,
    reset,
    setProgress: handleSetProgress,
    setSpeed,
    setEasing,
    setLoopDirection,
    setShowDot,
    setShowRings,
  };
}
