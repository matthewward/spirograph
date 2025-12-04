import { useMemo } from "react";
import { calculatePolygonRadius } from "../../lib/spirograph/math";
import styles from "./PolygonPreview.module.css";

interface PolygonPreviewProps {
  sides: number;
  arcness: number;
  arcnessEnabled: boolean;
  size?: number;
}

export function PolygonPreview({
  sides,
  arcness,
  arcnessEnabled,
  size = 80,
}: PolygonPreviewProps) {
  const pathData = useMemo(() => {
    const radius = size * 0.35; // Use 35% of size for the polygon radius
    const centerX = size / 2;
    const centerY = size / 2;
    const numPoints = 360; // Sample 360 points around the polygon

    const points: { x: number; y: number }[] = [];

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const r = calculatePolygonRadius(angle, radius, sides, arcness, arcnessEnabled);

      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      points.push({ x, y });
    }

    // Create SVG path string
    if (points.length === 0) return "";

    const pathCommands = points.map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    });

    return pathCommands.join(" ") + " Z"; // Close the path
  }, [sides, arcness, arcnessEnabled, size]);

  return (
    <div className={styles.container}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.svg}
      >
        <path
          d={pathData}
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
