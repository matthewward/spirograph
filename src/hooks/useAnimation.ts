import { useState, useEffect, useRef } from 'react';
import { EasingType, applyEasing } from '../lib/animation/easing';

export interface UseAnimationResult {
  isPlaying: boolean;
  progress: number; // 0 to 1
  speed: number; // 0.25 to 4
  easing: EasingType;
  loop: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setProgress: (progress: number) => void;
  setSpeed: (speed: number) => void;
  setEasing: (easing: EasingType) => void;
  setLoop: (loop: boolean) => void;
}

/**
 * Calculate bidirectional progress for looping animations
 * 0 -> 1 (drawing) -> 0 (undrawing)
 */
function calculateBidirectionalProgress(elapsed: number, duration: number, loop: boolean): number {
  if (!loop) {
    return Math.min(elapsed / duration, 1);
  }

  const cycleDuration = duration * 2; // Full cycle = draw + undraw
  const cycleProgress = (elapsed % cycleDuration) / cycleDuration;

  // First half: 0 -> 1 (drawing)
  // Second half: 1 -> 0 (undrawing)
  if (cycleProgress < 0.5) {
    return cycleProgress * 2; // 0 to 1
  } else {
    return 2 - (cycleProgress * 2); // 1 to 0
  }
}

export function useAnimation(duration: number = 5000): UseAnimationResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [easing, setEasing] = useState<EasingType>('linear');
  const [loop, setLoop] = useState(false);

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

      // Calculate raw progress with bidirectional support
      const rawProgress = calculateBidirectionalProgress(
        elapsed + (pausedProgressRef.current * adjustedDuration),
        adjustedDuration,
        loop
      );

      // Apply easing to the raw progress
      const easedProgress = applyEasing(rawProgress, easing);

      setProgress(easedProgress);

      // For non-looping animations, stop at 1
      // For looping animations, run indefinitely
      if (!loop && rawProgress >= 1) {
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
  }, [isPlaying, duration, speed, easing, loop]);

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
    speed,
    easing,
    loop,
    play,
    pause,
    reset,
    setProgress: handleSetProgress,
    setSpeed,
    setEasing,
    setLoop,
  };
}
