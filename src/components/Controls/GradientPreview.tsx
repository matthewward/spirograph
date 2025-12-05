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

    // Sample the gradient at many points to create a smooth visualization
    // This matches the continuous mathematical gradient used in waveEffect.ts
    const numSamples = 100; // High resolution for smooth gradients

    for (let i = 0; i <= numSamples; i++) {
      const normalizedPosition = i / numSamples;

      // Apply offset (same formula as in waveEffect.ts)
      const cyclicValue = (normalizedPosition * frequency + currentOffset) % 1;

      // Apply easing (same formula as in waveEffect.ts)
      let gradientValue;
      if (easing === 0) {
        gradientValue = cyclicValue; // Linear
      } else {
        // Smoothstep-style easing
        const smooth = cyclicValue * cyclicValue * (3 - 2 * cyclicValue);
        gradientValue = cyclicValue * (1 - easing) + smooth * easing;
      }

      // Convert gradient value (0-1) to wave displacement value (-1 to 1)
      // This matches the sine wave conversion in waveEffect.ts line 139
      const waveValue = Math.sin(gradientValue * Math.PI * 2);

      // Map wave value from [-1, 1] to [0, 255] for visualization
      const grayValue = Math.round((waveValue + 1) * 127.5);
      const color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;

      stops.push({ position: normalizedPosition * 100, color });
    }

    const gradientStops = stops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    switch (gradientType) {
      case "horizontal":
        return `linear-gradient(to right, ${gradientStops})`;
      case "vertical":
        return `linear-gradient(to bottom, ${gradientStops})`;
      case "radial":
        return `radial-gradient(circle, ${gradientStops})`;
      case "diamond":
        return `conic-gradient(from 45deg, ${gradientStops}, ${stops[0].color})`;
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
      {/* <div className={styles.label}>
        {frequency} {frequency === 1 ? "stripe" : "stripes"}
      </div> */}
    </div>
  );
}
