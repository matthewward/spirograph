import { ParameterOscillation } from "../../lib/animation/parameterOscillation";
import { ParameterOscillationControl } from "./ParameterOscillationControl";
import { NumberInput } from "./NumberInput";
import styles from "./RangeControl.module.css";

interface RangeControlProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  oscillation?: ParameterOscillation;
  onOscillationChange?: (update: Partial<ParameterOscillation>) => void;
  tooltip?: string;
}

export function RangeControl({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  oscillation,
  onOscillationChange,
  tooltip,
}: RangeControlProps) {
  return (
    <div className={styles.container}>
      <div className={styles.labelRow}>
        <label htmlFor={id} title={tooltip}>
          {label}
          {tooltip && <span className={styles.tooltipIcon}>ⓘ</span>}
        </label>
        <NumberInput
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={styles.numberInput}
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.rangeInput}
      />
      {oscillation && onOscillationChange && (
        <ParameterOscillationControl
          label={label}
          oscillation={oscillation}
          onChange={onOscillationChange}
        />
      )}
    </div>
  );
}
