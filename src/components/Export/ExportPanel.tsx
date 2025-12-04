import { useState } from "react";
import { EasingType } from "../../lib/animation/easing";
import { LoopDirection } from "../../hooks/useAnimation";
import { SpirographParams, CurveType } from "../../lib/spirograph/types";
import { SpirographOscillations } from "../../lib/animation/parameterOscillation";
import { useURLState } from "../../hooks/useURLState";
import styles from "./ExportPanel.module.css";

interface ExportPanelProps {
  duration: number;
  easing: EasingType;
  loopDirection: LoopDirection;
  onExportStatic: () => void;
  onExportAnimated: (
    duration: number,
    loopDirection: LoopDirection,
    easing: EasingType
  ) => void;
  // New props for sharing
  params: SpirographParams;
  curveType: CurveType;
  paramOscillations: SpirographOscillations;
  animSpeed: number;
  animEasing: EasingType;
  animLoopDirection: LoopDirection;
  animShowDot: boolean;
  animShowRings: boolean;
}

export function ExportPanel({
  duration,
  easing,
  loopDirection,
  onExportStatic,
  onExportAnimated,
  params,
  curveType,
  paramOscillations,
  animSpeed,
  animEasing,
  animLoopDirection,
  animShowDot,
  animShowRings,
}: ExportPanelProps) {
  const { generateShareURL } = useURLState();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    const shareURL = generateShareURL(
      params,
      curveType,
      paramOscillations,
      animSpeed,
      animEasing,
      animLoopDirection,
      animShowDot,
      animShowRings,
      true // Preview mode
    );

    try {
      await navigator.clipboard.writeText(shareURL);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.exportButton} onClick={onExportStatic}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 2 L9 12 M5 8 L9 12 L13 8" />
          <path d="M2 16 L16 16" />
        </svg>
        Export Static SVG
      </button>

      {/* <div className={styles.animatedSection}> */}
      {/* <div className={styles.options}>
          <div className={styles.info}>
            <p className={styles.infoText}>
              Using current animation settings: <strong>{duration}s</strong> duration,
              <strong> {easing}</strong> easing,
              <strong> {loopLabel}</strong>
            </p>
          </div>
        </div> */}

      <button
        className={styles.exportButton}
        onClick={() => onExportAnimated(duration, loopDirection, easing)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="9" r="7" />
          <path d="M9 5 L9 9 L12 9" />
        </svg>
        Export Animated SVG
      </button>
      {/* </div> */}

      <button className={styles.exportButton} onClick={handleShare}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="5" cy="9" r="2" />
          <circle cx="13" cy="5" r="2" />
          <circle cx="13" cy="13" r="2" />
          <path d="M7 8 L11 6 M7 10 L11 12" />
        </svg>
        {copySuccess ? "Copied!" : "Share"}
      </button>
    </div>
  );
}
