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
  onExportGIF: (
    duration: number,
    easing: EasingType,
    fps: number,
    size: number
  ) => void;
  onExportWebM: (
    duration: number,
    easing: EasingType,
    fps: number,
    size: number
  ) => void;
  // New props for sharing
  params: SpirographParams;
  curveType: CurveType;
  paramOscillations: SpirographOscillations;
  animEasing: EasingType;
  animLoopDirection: LoopDirection;
  animShowDot: boolean;
  animShowRings: boolean;
  drawAnimationEnabled: boolean;
}

export function ExportPanel({
  duration,
  easing,
  loopDirection,
  onExportStatic,
  onExportAnimated,
  onExportPNG,
  onExportGIF,
  onExportWebM,
  params,
  curveType,
  paramOscillations,
  animEasing,
  animLoopDirection,
  animShowDot,
  animShowRings,
  drawAnimationEnabled,
}: ExportPanelProps) {
  const { generateShareURL } = useURLState();
  const [copySuccess, setCopySuccess] = useState(false);
  const [fps, setFps] = useState(30);
  const [resolution, setResolution] = useState(800);

  const handleShare = async () => {
    const shareURL = generateShareURL(
      params,
      curveType,
      paramOscillations,
      animEasing,
      animLoopDirection,
      animShowDot,
      animShowRings,
      drawAnimationEnabled,
      drawAnimationEnabled,
      params.waveEffect.enabled
    );

    try {
      await navigator.clipboard.writeText(shareURL);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const hasAnimation = drawAnimationEnabled || (params.waveEffect.enabled && params.waveEffect.animate);

  return (
    <div className={styles.container}>
      <button className={styles.exportButton} onClick={onExportStatic}>
        Static SVG
      </button>

      <button className={styles.exportButton} onClick={() => onExportPNG()}>
        PNG
      </button>

      {hasAnimation && (
        <>
          <div className={styles.sectionHeader}>Animated Export</div>

          <div className={styles.animationControls}>
            <div className={styles.controlGroup}>
              <label htmlFor="fps">Frame Rate (FPS)</label>
              <select
                id="fps"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className={styles.select}
              >
                <option value="24">24 FPS</option>
                <option value="30">30 FPS</option>
                <option value="60">60 FPS</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label htmlFor="resolution">Resolution</label>
              <select
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value))}
                className={styles.select}
              >
                <option value="512">512px</option>
                <option value="800">800px</option>
                <option value="1024">1024px</option>
                <option value="2048">2048px</option>
              </select>
            </div>
          </div>

          <div className={styles.animatedButtons}>
            <button
              className={styles.exportButton}
              onClick={() => onExportAnimated(duration, loopDirection, easing)}
            >
              SVG
            </button>
            <button
              className={styles.exportButton}
              onClick={() => onExportGIF(duration, easing, fps, resolution)}
            >
              GIF
            </button>
            <button
              className={styles.exportButton}
              onClick={() => onExportWebM(duration, easing, fps, resolution)}
            >
              VID
            </button>
          </div>
        </>
      )}

      <div className={styles.shareSection}>
        <button className={styles.exportButton} onClick={handleShare}>
          {copySuccess ? "Copied" : "Share"}
        </button>
      </div>
    </div>
  );
}
