import { SpirographParams, CurveType } from "../../lib/spirograph/types";
import { SpirographOscillations } from "../../lib/animation/parameterOscillation";
import { RangeControl } from "./RangeControl";
import { PolygonPreview } from "./PolygonPreview";
import { NumberInput } from "./NumberInput";
import styles from "./SimpleControls.module.css";

interface SimpleControlsProps {
  params: SpirographParams;
  onChange: (params: Partial<SpirographParams>) => void;
  curveType: CurveType;
  onCurveTypeChange: (type: CurveType) => void;
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
          min={1}
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
          min={1}
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
          min={1}
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

      <div className={styles.polygonSection}>
        <div className={styles.polygonControls}>
          <div className={styles.controlGroup}>
            <RangeControl
              id="wheel-sides"
              label="Wheel Sides"
              value={params.sides}
              onChange={(value) => onChange({ sides: Math.round(value) })}
              min={-6}
              max={6}
              step={1}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.arcnessLabelRow}>
              <label htmlFor="edge-curvature-slider">Edge Curvature</label>
              <label
                htmlFor="arcness-enabled"
                className={styles.checkboxLabel}
              >
                <input
                  id="arcness-enabled"
                  type="checkbox"
                  checked={params.arcnessEnabled}
                  onChange={(e) =>
                    onChange({ arcnessEnabled: e.target.checked })
                  }
                />
              </label>
              <NumberInput
                value={params.arcness}
                onChange={(value) => onChange({ arcness: value })}
                min={-0.5}
                max={2}
                step={0.01}
                className={`${styles.numberInput} ${!params.arcnessEnabled ? styles.disabled : ""}`}
              />
            </div>
            <input
              id="edge-curvature-slider"
              type="range"
              min={-0.5}
              max={2}
              step={0.01}
              value={params.arcness}
              onChange={(e) => onChange({ arcness: Number(e.target.value) })}
              className={`${styles.rangeInput} ${!params.arcnessEnabled ? styles.disabled : ""}`}
            />
          </div>
        </div>

        <div className={styles.polygonPreviewWrapper}>
          <PolygonPreview
            sides={params.sides}
            arcness={params.arcness}
            arcnessEnabled={params.arcnessEnabled}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <RangeControl
          id="stroke-width"
          label="Line Width"
          value={params.strokeWidth}
          onChange={(value) => onChange({ strokeWidth: value })}
          min={0.1}
          max={10}
          step={0.1}
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
        <label htmlFor="curve-type">Inside or outside?</label>
        <select
          id="curve-type"
          value={curveType}
          onChange={(e) => onCurveTypeChange(e.target.value as CurveType)}
          className={styles.select}
        >
          <option value="hypotrochoid">In</option>
          <option value="epitrochoid">Out</option>
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
          <option value="0">Right</option>
          <option value="90">Down</option>
          <option value="180">Left</option>
          <option value="270">Up</option>
        </select>
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
          id="duration"
          label="Duration (seconds)"
          value={params.duration}
          onChange={(value) => onChange({ duration: value })}
          min={0.1}
          max={30}
          step={0.1}
        />
      </div>
    </div>
  );
}
