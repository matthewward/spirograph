import { ColorOscillation, WaveType } from '../../lib/animation/colorOscillation';
import styles from './ColorOscillationControls.module.css';

interface ColorOscillationControlsProps {
  oscillation: ColorOscillation;
  onChange: (update: Partial<ColorOscillation>) => void;
}

export function ColorOscillationControls({ oscillation, onChange }: ColorOscillationControlsProps) {
  const addColor = () => {
    onChange({ colors: [...oscillation.colors, '#ffffff'] });
  };

  const removeColor = (index: number) => {
    if (oscillation.colors.length > 2) {
      const newColors = oscillation.colors.filter((_, i) => i !== index);
      onChange({ colors: newColors });
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...oscillation.colors];
    newColors[index] = color;
    onChange({ colors: newColors });
  };

  return (
    <div className={styles.container}>
      <div className={styles.enableRow}>
        <label>
          <input
            type="checkbox"
            checked={oscillation.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
          />
          <span>Enable Color Oscillation</span>
        </label>
      </div>

      {oscillation.enabled && (
        <>
          <div className={styles.colorsSection}>
            <label>Colors</label>
            <div className={styles.colorsList}>
              {oscillation.colors.map((color, i) => (
                <div key={i} className={styles.colorItem}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                    className={styles.hexInput}
                  />
                  {oscillation.colors.length > 2 && (
                    <button onClick={() => removeColor(i)}>×</button>
                  )}
                </div>
              ))}
              <button onClick={addColor} className={styles.addButton}>
                + Add Color
              </button>
            </div>
          </div>

          <div className={styles.controlRow}>
            <label>Wave Shape</label>
            <select
              value={oscillation.waveType}
              onChange={(e) => onChange({ waveType: e.target.value as WaveType })}
            >
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="square">Square</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="reverseSawtooth">Reverse Sawtooth</option>
            </select>
          </div>

          <div className={styles.controlRow}>
            <label>Frequency (cycles)</label>
            <input
              type="number"
              min="1"
              max="20"
              step="1"
              value={oscillation.frequency}
              onChange={(e) => onChange({ frequency: Number(e.target.value) })}
            />
          </div>
        </>
      )}
    </div>
  );
}
