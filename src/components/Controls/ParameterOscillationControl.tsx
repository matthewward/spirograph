import {
  ParameterOscillation,
  WaveType,
} from "../../lib/animation/parameterOscillation";
import styles from "./ParameterOscillationControl.module.css";

interface ParameterOscillationControlProps {
  label: string;
  oscillation: ParameterOscillation;
  onChange: (update: Partial<ParameterOscillation>) => void;
}

export function ParameterOscillationControl({
  label,
  oscillation,
  onChange,
}: ParameterOscillationControlProps) {
  return (
    <div className={styles.container}>
      <div className={styles.enableRow}>
        <label>
          <input
            type="checkbox"
            checked={oscillation.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
          />
          <span>Oscillate {label}</span>
        </label>
      </div>

      {oscillation.enabled && (
        <div className={styles.settings}>
          <div className={styles.controlRow}>
            <label>AMP</label>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={Math.round(oscillation.amplitude)}
              onChange={(e) => onChange({ amplitude: Number(e.target.value) })}
              className={styles.input}
            />
          </div>

          <div className={styles.controlRow}>
            <label>FREQ</label>
            <input
              type="number"
              min="-100"
              max="100"
              step="1"
              value={oscillation.frequency}
              onChange={(e) => onChange({ frequency: Number(e.target.value) })}
              className={styles.input}
            />
          </div>

          <div className={styles.controlRow}>
            <label>SHAPE</label>
            <select
              value={oscillation.waveType}
              onChange={(e) =>
                onChange({ waveType: e.target.value as WaveType })
              }
              className={styles.select}
            >
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="square">Square</option>
              <option value="sawtooth">Saw</option>
              <option value="reverseSawtooth">Rev. Saw</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
