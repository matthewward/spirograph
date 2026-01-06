import { SpirographParams, CurveType } from "../../lib/spirograph/types";
import { SpirographOscillations } from "../../lib/animation/parameterOscillation";
import { RangeControl } from "./RangeControl";
import { PolygonPreview } from "./PolygonPreview";
import { NumberInput } from "./NumberInput";
import styles from "./MainControls.module.css";

interface MainControlsProps {
  params: SpirographParams;
  onChange: (params: Partial<SpirographParams>) => void;
  curveType: CurveType;
  onCurveTypeChange: (type: CurveType) => void;
  parameterOscillations: SpirographOscillations;
  onParameterOscillationsChange: (
    update: Partial<SpirographOscillations>
  ) => void;
  onRandomize: () => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

export function MainControls({
  params,
  onChange,
  curveType,
  onCurveTypeChange,
  parameterOscillations,
  onParameterOscillationsChange,
  onRandomize,
  onGoBack,
  canGoBack,
}: MainControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.randomizeRow}>
        <button onClick={onRandomize} className={styles.randomizeButton}>
          Randomize
        </button>
        {canGoBack && (
          <button
            onClick={onGoBack}
            className={styles.backButton}
            title="Go back to previous randomization"
          >
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5V13.5"
                stroke="currentColor"
                stroke-width="1.2"
              />
              <path
                d="M7 11L4.5 13.5L2 11"
                stroke="currentColor"
                stroke-width="1.2"
              />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.controlGroup}>
        <RangeControl
          id="pen-position"
          label="Pen Position"
          tooltip="Where the pen sits on the wheel"
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

      <div className={styles.controlGroup}>
        <RangeControl
          id="ring-size"
          label="Ring Size"
          tooltip="The outer circle that everything rolls around"
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
          tooltip="The wheel that draws the pattern"
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

      <div className={styles.polygonSection}>
        <div className={styles.polygonControls}>
          <div className={styles.controlGroup}>
            <RangeControl
              id="wheel-sides"
              label="Wheel Sides"
              tooltip="Turn the wheel into a different shape"
              value={params.sides}
              onChange={(value) => {
                const n = Math.round(value);
                onChange({ sides: n === 0 ? 1 : n });
              }}
              min={-6}
              max={6}
              step={1}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.arcnessLabelRow}>
              <label
                htmlFor="edge-curvature-slider"
                title="Makes the shape edges curve inward or outward. Won't work on a circle ;-("
              >
                Edge Curvature
              </label>
              <label htmlFor="arcness-enabled" className={styles.checkboxLabel}>
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
                min={-0.49}
                max={10}
                step={0.01}
                className={`${styles.numberInput} ${!params.arcnessEnabled ? styles.disabled : ""}`}
              />
            </div>
            <input
              id="edge-curvature-slider"
              type="range"
              min={-0.5}
              max={10}
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
        <label
          htmlFor="curve-type"
          title="Does the wheel roll inside or outside the ring?"
        >
          Inside or outside?
        </label>
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

      <div className={styles.dashedLine} />

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
        <label
          htmlFor="background-color"
          title="What color should the background be?"
        >
          Background Color
        </label>
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
        <label
          htmlFor="glow-color"
          title="The color of the glow effect around the pattern"
        >
          Glow Color
        </label>
        <div className={styles.colorRow}>
          <input
            id="glow-color"
            type="color"
            value={params.glowColor}
            onChange={(e) => onChange({ glowColor: e.target.value })}
          />
          <input
            type="text"
            className={styles.colorInput}
            value={params.glowColor}
            onChange={(e) => onChange({ glowColor: e.target.value })}
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
        <RangeControl
          id="completion"
          label="Completion %"
          tooltip="How much of the pattern to draw - 100% means we keep drawing until we get back to the start"
          value={params.completion}
          onChange={(value) => onChange({ completion: value })}
          min={1}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
}
