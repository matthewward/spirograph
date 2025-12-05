import { SpirographParams } from "../../lib/spirograph/types";
import { RangeControl } from "./RangeControl";
import { GradientPreview } from "./GradientPreview";
import styles from "./WaveAnimationControls.module.css";

interface WaveAnimationControlsProps {
  params: SpirographParams;
  onChange: (params: Partial<SpirographParams>) => void;
}

export function WaveAnimationControls({
  params,
  onChange,
}: WaveAnimationControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.controlGroup}>
        <label title="Which type of gradient to use">
          Gradient Type <span className={styles.tooltipIcon}>ⓘ</span>
        </label>
        <div className={styles.gradientTypeButtons}>
          <button
            type="button"
            className={`${styles.gradientButton} ${params.waveEffect.gradientType === "horizontal" ? styles.active : ""}`}
            onClick={() =>
              onChange({
                waveEffect: {
                  ...params.waveEffect,
                  gradientType: "horizontal",
                },
              })
            }
            title="Horizontal"
          >
            <div
              className={styles.gradientPreviewButton}
              style={{
                background: "linear-gradient(to right, black, white)",
              }}
            />
          </button>
          <button
            type="button"
            className={`${styles.gradientButton} ${params.waveEffect.gradientType === "vertical" ? styles.active : ""}`}
            onClick={() =>
              onChange({
                waveEffect: {
                  ...params.waveEffect,
                  gradientType: "vertical",
                },
              })
            }
            title="Vertical"
          >
            <div
              className={styles.gradientPreviewButton}
              style={{
                background: "linear-gradient(to bottom, black, white)",
              }}
            />
          </button>
          <button
            type="button"
            className={`${styles.gradientButton} ${params.waveEffect.gradientType === "radial" ? styles.active : ""}`}
            onClick={() =>
              onChange({
                waveEffect: {
                  ...params.waveEffect,
                  gradientType: "radial",
                },
              })
            }
            title="Radial"
          >
            <div
              className={styles.gradientPreviewButton}
              style={{
                background: "radial-gradient(circle, black, white)",
              }}
            />
          </button>
          <button
            type="button"
            className={`${styles.gradientButton} ${params.waveEffect.gradientType === "diamond" ? styles.active : ""}`}
            onClick={() =>
              onChange({
                waveEffect: {
                  ...params.waveEffect,
                  gradientType: "diamond",
                },
              })
            }
            title="Diamond"
          >
            <div
              className={styles.gradientPreviewButton}
              style={{
                background:
                  "conic-gradient(from 45deg, black, white, black, white, black)",
              }}
            />
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label
          htmlFor="displacement-mode"
          title="How the waves push and pull the lines around"
        >
          Displacement Mode <span className={styles.tooltipIcon}>ⓘ</span>
        </label>
        <select
          id="displacement-mode"
          value={params.waveEffect.displacementMode}
          onChange={(e) =>
            onChange({
              waveEffect: {
                ...params.waveEffect,
                displacementMode: e.target.value as any,
              },
            })
          }
          className={styles.select}
        >
          <option value="perpendicular">Perpendicular</option>
          <option value="radial">Radial</option>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>
      <div className={styles.controlGroup}>
        <RangeControl
          id="wave-frequency"
          label="Frequency"
          tooltip="How many waves appear across the pattern - higher = more wiggly"
          value={params.waveEffect.frequency}
          onChange={(value) =>
            onChange({
              waveEffect: { ...params.waveEffect, frequency: value },
            })
          }
          min={0}
          max={12}
          step={0.1}
        />
      </div>
      <div className={styles.controlGroup}>
        <RangeControl
          id="wave-amplitude"
          label="Amplitude"
          tooltip="How far the waves push the lines around - bigger = more dramatic"
          value={params.waveEffect.amplitude}
          onChange={(value) =>
            onChange({
              waveEffect: { ...params.waveEffect, amplitude: value },
            })
          }
          min={1}
          max={100}
          step={1}
        />
      </div>
      <div className={styles.controlGroup}>
        <RangeControl
          id="wave-easing"
          label="Gradient Smoothness"
          tooltip="Makes the wave transitions sharper or smoother"
          value={params.waveEffect.easing}
          onChange={(value) =>
            onChange({
              waveEffect: { ...params.waveEffect, easing: value },
            })
          }
          min={0}
          max={10}
          step={0.1}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className={styles.controlGroup}>
            <div className={styles.animateRow}>
              <label htmlFor="wave-animate">Animate it?</label>
              <label htmlFor="wave-animate" className={styles.checkboxLabel}>
                <input
                  id="wave-animate"
                  type="checkbox"
                  checked={params.waveEffect.animate}
                  onChange={(e) =>
                    onChange({
                      waveEffect: {
                        ...params.waveEffect,
                        animate: e.target.checked,
                      },
                    })
                  }
                />
              </label>
            </div>
          </div>
          {params.waveEffect.animate && (
            <div className={styles.controlGroup}>
              <RangeControl
                id="wave-animation-speed"
                label="Speed"
                tooltip="How many seconds it takes for the waves to cycle"
                value={params.waveEffect.animationSpeed}
                onChange={(value) =>
                  onChange({
                    waveEffect: {
                      ...params.waveEffect,
                      animationSpeed: value,
                    },
                  })
                }
                min={0.1}
                max={30}
                step={0.1}
              />
            </div>
          )}
          {!params.waveEffect.animate && (
            <div className={styles.controlGroup}>
              <RangeControl
                id="wave-offset"
                label="Offset"
                tooltip="Where the wave pattern starts - like freezing the animation at different moments"
                value={params.waveEffect.animationOffset}
                onChange={(value) =>
                  onChange({
                    waveEffect: {
                      ...params.waveEffect,
                      animationOffset: value,
                    },
                  })
                }
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          )}
        </div>
        <div className={styles.gradientPreviewWrapper}>
          <GradientPreview
            gradientType={params.waveEffect.gradientType}
            frequency={params.waveEffect.frequency}
            easing={params.waveEffect.easing}
            animationOffset={params.waveEffect.animationOffset}
            animate={params.waveEffect.animate}
            animationSpeed={params.waveEffect.animationSpeed}
          />
        </div>
      </div>
    </div>
  );
}
