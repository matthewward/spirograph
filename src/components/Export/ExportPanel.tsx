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
  onExportPNG: () => void;
  // New props for sharing
  params: SpirographParams;
  curveType: CurveType;
  paramOscillations: SpirographOscillations;
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
  onExportPNG,
  params,
  curveType,
  paramOscillations,
  animEasing,
  animLoopDirection,
  animShowDot,
  animShowRings,
}: ExportPanelProps) {
  const { generateShareURL } = useURLState();
  const [copySuccess, setCopySuccess] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const handleShare = async () => {
    const shareURL = generateShareURL(
      params,
      curveType,
      paramOscillations,
      animEasing,
      animLoopDirection,
      animShowDot,
      animShowRings,
      autoPlay
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
        Static SVG
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
        Animated SVG
      </button>

      <button className={styles.exportButton} onClick={() => onExportPNG()}>
        PNG
      </button>
      {/* </div> */}

      <div className={styles.shareSection}>
        <button className={styles.exportButton} onClick={handleShare}>
          {copySuccess ? "Copied" : "Share"}
        </button>
      </div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={autoPlay}
          onChange={(e) => setAutoPlay(e.target.checked)}
        />
        <span>Start animated</span>
      </label>
    </div>
  );
}
