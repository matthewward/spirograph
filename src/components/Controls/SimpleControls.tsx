import { SpirographParams, CurveType } from '../../lib/spirograph/types';
import { ColorOscillation } from '../../lib/animation/colorOscillation';
import { SpirographOscillations, ParameterOscillation } from '../../lib/animation/parameterOscillation';
import { ColorOscillationControls } from './ColorOscillationControls';
import { ParameterOscillationControl } from './ParameterOscillationControl';
import styles from './SimpleControls.module.css';

interface SimpleControlsProps {
  params: SpirographParams;
  onChange: (params: Partial<SpirographParams>) => void;
  curveType: CurveType;
  onCurveTypeChange: (type: CurveType) => void;
  colorOscillation: ColorOscillation;
  onColorOscillationChange: (update: Partial<ColorOscillation>) => void;
  parameterOscillations: SpirographOscillations;
  onParameterOscillationsChange: (update: Partial<SpirographOscillations>) => void;
}

export function SimpleControls({
  params,
  onChange,
  curveType,
  onCurveTypeChange,
  colorOscillation,
  onColorOscillationChange,
  parameterOscillations,
  onParameterOscillationsChange
}: SimpleControlsProps) {
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
        <ParameterOscillationControl
          label="Ring Size"
          oscillation={parameterOscillations.R}
          onChange={(update) => onParameterOscillationsChange({ R: { ...parameterOscillations.R, ...update } })}
        />
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
        <ParameterOscillationControl
          label="Wheel Size"
          oscillation={parameterOscillations.r}
          onChange={(update) => onParameterOscillationsChange({ r: { ...parameterOscillations.r, ...update } })}
        />
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
        <ParameterOscillationControl
          label="Pen Position"
          oscillation={parameterOscillations.d}
          onChange={(update) => onParameterOscillationsChange({ d: { ...parameterOscillations.d, ...update } })}
        />
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
        <label htmlFor="background-color">Background Color</label>
        <div className={styles.colorRow}>
          <input
            id="background-color"
            type="color"
            value={params.backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
          />
          <input
            type="text"
            className={styles.colorInput}
            value={params.backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="duration">Duration (seconds)</label>
        <div className={styles.inputRow}>
          <input
            id="duration"
            type="range"
            min="0.1"
            max="30"
            step="0.1"
            value={params.duration}
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={params.duration}
            step="0.1"
            min="0.1"
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="curve-type">Curve Type</label>
        <select
          id="curve-type"
          value={curveType}
          onChange={(e) => onCurveTypeChange(e.target.value as CurveType)}
          className={styles.select}
        >
          <option value="hypotrochoid">Inside (Hypotrochoid)</option>
          <option value="epitrochoid">Outside (Epitrochoid)</option>
        </select>
      </div>

      <div className={styles.controlGroup}>
        <label htmlFor="rotation">Starting Position</label>
        <select
          id="rotation"
          value={params.rotation}
          onChange={(e) => onChange({ rotation: Number(e.target.value) })}
          className={styles.select}
        >
          <option value="0">3 o'clock (0°)</option>
          <option value="90">12 o'clock (90°)</option>
          <option value="180">9 o'clock (180°)</option>
          <option value="270">6 o'clock (270°)</option>
        </select>
      </div>

      <div className={styles.controlGroup}>
        <ColorOscillationControls
          oscillation={colorOscillation}
          onChange={onColorOscillationChange}
        />
      </div>
    </div>
  );
}
