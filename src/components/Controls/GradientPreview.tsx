import { GradientType } from "../../lib/animation/waveEffect";
import styles from "./GradientPreview.module.css";

interface GradientPreviewProps {
  gradientType: GradientType;
  frequency: number;
  easing: number;
}

export function GradientPreview({
  gradientType,
  frequency,
  easing,
}: GradientPreviewProps) {
  // Generate gradient CSS based on type and frequency
  const generateGradient = (): string => {
    const stops: string[] = [];
    const numStops = frequency * 2 + 1; // Each frequency cycle has 2 stops (black-white)

    for (let i = 0; i <= numStops; i++) {
      const position = (i / numStops) * 100;
      // Alternate between white and black
      const isWhite = i % 2 === 0;
      const color = isWhite ? "#ffffff" : "#000000";
      stops.push(`${color} ${position}%`);
    }

    const gradientStops = stops.join(", ");

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
