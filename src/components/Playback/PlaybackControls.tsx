import {
  EasingType,
  easingGroups,
  getEasingVariants,
} from "../../lib/animation/easing";
import { LoopDirection } from "../../hooks/useAnimation";
import { NumberInput } from "../Controls/NumberInput";
import styles from "./PlaybackControls.module.css";

interface PlaybackControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  easing: EasingType;
  loopDirection: LoopDirection;
  showDot: boolean;
  showRings: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onProgressChange: (progress: number) => void;
  onDurationChange: (duration: number) => void;
  onEasingChange: (easing: EasingType) => void;
  onLoopDirectionChange: (direction: LoopDirection) => void;
  onShowDotChange: (show: boolean) => void;
  onShowRingsChange: (show: boolean) => void;
}

export function PlaybackControls({
  isPlaying,
  progress,
  duration,
  easing,
  loopDirection,
  showDot: _showDot,
  showRings: _showRings,
  onPlay,
  onPause: _onPause,
  onReset,
  onProgressChange,
  onDurationChange,
  onEasingChange,
  onLoopDirectionChange,
  onShowDotChange: _onShowDotChange,
  onShowRingsChange: _onShowRingsChange,
}: PlaybackControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.controlsRow}>
        <div className={styles.playbackButtons}>
          <button
            className={styles.button}
            onClick={isPlaying ? onReset : onPlay}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>

          {/* <button className={styles.button} onClick={onReset} title="Reset">
            Reset
          </button> */}
        </div>

        <div className={styles.controlsGrid}>
          <div className={styles.controlRow}>
            <label htmlFor="speed-slider" className={styles.controlLabel}>
              Speed
            </label>
            <div className={styles.speedSliderRow}>
              <input
                id="speed-slider"
                type="range"
                min={0.1}
                max={30}
                step={0.1}
                value={duration}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                className={styles.speedSlider}
              />
              <NumberInput
                value={duration}
                onChange={onDurationChange}
                min={0.1}
                max={30}
                step={0.1}
                className={styles.speedInput}
              />
            </div>
          </div>

          <div className={styles.controlRow}>
            <label htmlFor="easing" className={styles.controlLabel}>
              Easing
            </label>
            <select
              id="easing"
              value={easing}
              onChange={(e) => onEasingChange(e.target.value as EasingType)}
              className={styles.easingSelect}
            >
              {Object.entries(easingGroups).map(([groupName, families]) => (
                <optgroup key={groupName} label={groupName}>
                  {families.map((family) =>
                    getEasingVariants(family).map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
          </div>

          <div className={styles.controlRow}>
            <label htmlFor="loop-direction" className={styles.controlLabel}>
              Loop
            </label>
            <select
              id="loop-direction"
              value={loopDirection}
              onChange={(e) =>
                onLoopDirectionChange(e.target.value as LoopDirection)
              }
              className={styles.loopSelect}
            >
              <option value="none">None</option>
              <option value="continue">Continue</option>
              <option value="pingpong">Ping-Pong</option>
            </select>
          </div>

          <div className={styles.controlRow}>
            <div className={styles.progressLabel}>
              {Math.round(progress * 100)}%
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              onChange={(e) => onProgressChange(Number(e.target.value))}
              className={styles.timelineSlider}
            />
          </div>
        </div>

        {/* <div className={styles.dotToggle}>
          <label htmlFor="show-dot">
            <input
              id="show-dot"
              type="checkbox"
              checked={showDot}
              onChange={(e) => onShowDotChange(e.target.checked)}
              className={styles.dotCheckbox}
            />
            <span>Dot</span>
          </label>
        </div> */}

        {/* <div className={styles.ringToggle}>
          <label htmlFor="show-rings">
            <input
              id="show-rings"
              type="checkbox"
              checked={showRings}
              onChange={(e) => onShowRingsChange(e.target.checked)}
              className={styles.ringCheckbox}
            />
            <span>Rings</span>
          </label>
        </div> */}
      </div>
    </div>
  );
}
