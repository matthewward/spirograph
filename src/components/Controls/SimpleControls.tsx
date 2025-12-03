import { SpirographParams } from '../../lib/spirograph/types';
import styles from './SimpleControls.module.css';

interface SimpleControlsProps {
  params: SpirographParams;
  onChange: (params: Partial<SpirographParams>) => void;
}

export function SimpleControls({ params, onChange }: SimpleControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.controlGroup}>
        <label htmlFor="ring-size">Ring Size</label>
        <div className={styles.inputRow}>
          <input
            id="ring-size"
            type="range"
            min="50"
            max="200"
            step="1"
            value={params.R}
            onChange={(e) => onChange({ R: Number(e.target.value) })}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={params.R}
            onChange={(e) => onChange({ R: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="wheel-size">Wheel Size</label>
        <div className={styles.inputRow}>
          <input
            id="wheel-size"
            type="range"
            min="10"
            max="150"
            step="1"
            value={params.r}
            onChange={(e) => onChange({ r: Number(e.target.value) })}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={params.r}
            onChange={(e) => onChange({ r: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="pen-position">Pen Position</label>
        <div className={styles.inputRow}>
          <input
            id="pen-position"
            type="range"
            min="10"
            max="150"
            step="1"
            value={params.d}
            onChange={(e) => onChange({ d: Number(e.target.value) })}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={params.d}
            onChange={(e) => onChange({ d: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="completion">Completion</label>
        <div className={styles.inputRow}>
          <input
            id="completion"
            type="range"
            min="1"
            max="100"
            step="1"
            value={params.completion}
            onChange={(e) => onChange({ completion: Number(e.target.value) })}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={params.completion}
            onChange={(e) => onChange({ completion: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="stroke-width">Line Width</label>
        <div className={styles.inputRow}>
          <input
            id="stroke-width"
            type="range"
            min="0.5"
            max="8"
            step="0.5"
            value={params.strokeWidth}
            onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={params.strokeWidth}
            step="0.5"
            onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="stroke-color">Color</label>
        <div className={styles.colorRow}>
          <input
            id="stroke-color"
            type="color"
            value={params.strokeColor}
            onChange={(e) => onChange({ strokeColor: e.target.value })}
          />
          <input
            type="text"
            className={styles.colorInput}
            value={params.strokeColor}
            onChange={(e) => onChange({ strokeColor: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="duration">Duration (seconds)</label>
        <div className={styles.inputRow}>
          <input
            id="duration"
            type="range"
            min="1"
            max="30"
            step="0.5"
            value={params.duration}
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={params.duration}
            step="0.5"
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
