import { SpirographParams, CurveType } from "../../lib/spirograph/types";
import { ColorOscillation } from "../../lib/animation/colorOscillation";
import { SpirographOscillations } from "../../lib/animation/parameterOscillation";
import { ColorOscillationControls } from "./ColorOscillationControls";
import { RangeControl } from "./RangeControl";
import styles from "./SimpleControls.module.css";

interface SimpleControlsProps {
  params: SpirographParams;
  onChange: (params: Partial<SpirographParams>) => void;
  curveType: CurveType;
  onCurveTypeChange: (type: CurveType) => void;
  colorOscillation: ColorOscillation;
  onColorOscillationChange: (update: Partial<ColorOscillation>) => void;
  parameterOscillations: SpirographOscillations;
  onParameterOscillationsChange: (
    update: Partial<SpirographOscillations>
  ) => void;
}

export function SimpleControls({
  params,
  onChange,
  curveType,
  onCurveTypeChange,
  colorOscillation,
  onColorOscillationChange,
  parameterOscillations,
  onParameterOscillationsChange,
}: SimpleControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.controlGroup}>
        <RangeControl
          id="ring-size"
          label="Ring Size"
          value={params.R}
          onChange={(value) => onChange({ R: value })}
          min={50}
          max={200}
          step={1}
          oscillation={parameterOscillations.R}
          onOscillationChange={(update) =>
            onParameterOscillationsChange({
              R: { ...parameterOscillations.R, ...update },
            })
          }
        />
      </div>

      <div className={styles.controlGroup}>
        <RangeControl
          id="wheel-size"
          label="Wheel Size"
          value={params.r}
          onChange={(value) => onChange({ r: value })}
          min={10}
          max={150}
          step={1}
          oscillation={parameterOscillations.r}
          onOscillationChange={(update) =>
            onParameterOscillationsChange({
              r: { ...parameterOscillations.r, ...update },
            })
          }
        />
      </div>

      <div className={styles.controlGroup}>
        <RangeControl
          id="pen-position"
          label="Pen Position"
          value={params.d}
          onChange={(value) => onChange({ d: value })}
          min={10}
          max={150}
          step={1}
          oscillation={parameterOscillations.d}
          onOscillationChange={(update) =>
            onParameterOscillationsChange({
              d: { ...parameterOscillations.d, ...update },
            })
          }
        />
      </div>

      <div className={styles.controlGroup}>
        <RangeControl
          id="completion"
          label="Completion"
          value={params.completion}
          onChange={(value) => onChange({ completion: value })}
          min={1}
          max={100}
          step={1}
        />
      </div>

      <div className={styles.controlGroup}>
        <RangeControl
          id="stroke-width"
          label="Line Width"
          value={params.strokeWidth}
          onChange={(value) => onChange({ strokeWidth: value })}
          min={0.5}
          max={8}
          step={0.5}
        />
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
        <RangeControl
          id="duration"
          label="Duration (seconds)"
          value={params.duration}
          onChange={(value) => onChange({ duration: value })}
          min={0.1}
          max={30}
          step={0.1}
        />
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
