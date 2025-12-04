import { useEffect, useState, useRef } from "react";
import { GradientType } from "../../lib/animation/waveEffect";
import styles from "./GradientPreview.module.css";

interface GradientPreviewProps {
  gradientType: GradientType;
  frequency: number;
  easing: number;
  animationOffset: number;
  animate: boolean;
  animationSpeed: number;
}

export function GradientPreview({
  gradientType,
  frequency,
  easing,
  animationOffset,
  animate,
  animationSpeed,
}: GradientPreviewProps) {
  const [currentOffset, setCurrentOffset] = useState(animationOffset);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Animate the offset when animate is enabled
  useEffect(() => {
    if (!animate) {
      setCurrentOffset(animationOffset);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animateOffset = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const duration = animationSpeed * 1000; // Convert seconds to milliseconds
      const newOffset = (elapsed / duration) % 1;

      setCurrentOffset(newOffset);
      animationFrameRef.current = requestAnimationFrame(animateOffset);
    };

    animationFrameRef.current = requestAnimationFrame(animateOffset);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, animationOffset, animationSpeed]);

  // Generate gradient CSS based on type and frequency
  const generateGradient = (): string => {
    const stops: Array<{ position: number; color: string }> = [];

    // Create seamless repeating gradient pattern
    // For frequency N, we need 2*N color bands (N white, N black)
    const numBands = frequency * 2;

    for (let i = 0; i < numBands; i++) {
      // Calculate position with offset applied
      const basePosition = i / numBands;
      const position = ((basePosition - currentOffset + 1) % 1) * 100;

      // Alternate between white and black
      const isWhite = i % 2 === 0;
      const color = isWhite ? "#ffffff" : "#000000";

      stops.push({ position, color });
    }

    // Add wrapping stop at the end to ensure seamless loop
    const firstStop = stops[0];
    stops.push({ position: ((1 - currentOffset + 1) % 1) * 100, color: firstStop.color });

    // Sort stops by position
    stops.sort((a, b) => a.position - b.position);

    const gradientStops = stops.map(s => `${s.color} ${s.position}%`).join(", ");

    switch (gradientType) {
      case "horizontal":
        return `linear-gradient(to right, ${gradientStops})`;
      case "vertical":
        return `linear-gradient(to bottom, ${gradientStops})`;
      case "radial":
        return `radial-gradient(circle, ${gradientStops})`;
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.preview}
        style={{
          background: generateGradient(),
        }}
      />
      <div className={styles.label}>
        {frequency} {frequency === 1 ? "stripe" : "stripes"}
      </div>
    </div>
  );
}
