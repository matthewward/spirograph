import { useState } from 'react';
import styles from './ExportPanel.module.css';

interface ExportPanelProps {
  onExportStatic: () => void;
  onExportAnimated: (duration: number, loop: boolean) => void;
}

export function ExportPanel({ onExportStatic, onExportAnimated }: ExportPanelProps) {
  const [duration, setDuration] = useState(5);
  const [loop, setLoop] = useState(false);

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
          <div className={styles.option}>
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              id="duration"
              type="number"
              min="1"
              max="30"
              step="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <div className={styles.option}>
            <label htmlFor="loop">
              <input
                id="loop"
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
              />
              <span>Loop infinitely</span>
            </label>
          </div>
        </div>

        <button
          className={styles.exportButton}
          onClick={() => onExportAnimated(duration, loop)}
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
