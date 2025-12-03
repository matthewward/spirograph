import { EasingType } from '../../lib/animation/easing';
import { LoopDirection } from '../../hooks/useAnimation';
import styles from './ExportPanel.module.css';

interface ExportPanelProps {
  duration: number;
  easing: EasingType;
  loopDirection: LoopDirection;
  onExportStatic: () => void;
  onExportAnimated: (duration: number, loopDirection: LoopDirection, easing: EasingType) => void;
}

export function ExportPanel({
  duration,
  easing,
  loopDirection,
  onExportStatic,
  onExportAnimated
}: ExportPanelProps) {
  const loopLabel = loopDirection === 'none' ? 'one-way'
    : loopDirection === 'continue' ? 'continue loop'
    : 'ping-pong loop';

  return (
    <div className={styles.container}>
      <button className={styles.exportButton} onClick={onExportStatic}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 2 L9 12 M5 8 L9 12 L13 8" />
          <path d="M2 16 L16 16" />
        </svg>
        Export Static SVG
      </button>

      <div className={styles.animatedSection}>
        <div className={styles.options}>
          <div className={styles.info}>
            <p className={styles.infoText}>
              Using current animation settings: <strong>{duration}s</strong> duration,
              <strong> {easing}</strong> easing,
              <strong> {loopLabel}</strong>
            </p>
          </div>
        </div>

        <button
          className={styles.exportButton}
          onClick={() => onExportAnimated(duration, loopDirection, easing)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="9" r="7" />
            <path d="M9 5 L9 9 L12 9" />
          </svg>
          Export Animated SVG
        </button>
      </div>
    </div>
  );
}
