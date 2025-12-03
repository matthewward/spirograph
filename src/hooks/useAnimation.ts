import { useState, useEffect, useRef } from 'react';

export interface UseAnimationResult {
  isPlaying: boolean;
  progress: number; // 0 to 1
  speed: number; // 0.25 to 4
  play: () => void;
  pause: () => void;
  reset: () => void;
  setProgress: (progress: number) => void;
  setSpeed: (speed: number) => void;
}

export function useAnimation(duration: number = 5000): UseAnimationResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

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
      const newProgress = Math.min((elapsed / adjustedDuration) + pausedProgressRef.current, 1);

      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        startTimeRef.current = null;
        pausedProgressRef.current = 0;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration, speed]);

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
    play,
    pause,
    reset,
    setProgress: handleSetProgress,
    setSpeed,
  };
}
