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
    const numPoints = 360; // Sample 360 points around the polygon

    // First pass: calculate points at unit radius to find actual bounds
    const tempPoints: { x: number; y: number }[] = [];
    let maxRadius = 0;

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const r = calculatePolygonRadius(angle, 1, sides, arcness, arcnessEnabled);
      maxRadius = Math.max(maxRadius, r);

      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      tempPoints.push({ x, y });
    }

    // Calculate scale to fit within container with padding
    const padding = size * 0.1; // 10% padding
    const availableSize = size - (padding * 2);
    const scale = availableSize / (maxRadius * 2);

    // Second pass: scale and center the points
    const centerX = size / 2;
    const centerY = size / 2;

    const points = tempPoints.map(p => ({
      x: centerX + p.x * scale,
      y: centerY + p.y * scale,
    }));

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
