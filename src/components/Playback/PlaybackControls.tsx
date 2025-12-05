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
  rotation: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onProgressChange: (progress: number) => void;
  onDurationChange: (duration: number) => void;
  onEasingChange: (easing: EasingType) => void;
  onLoopDirectionChange: (direction: LoopDirection) => void;
  onShowDotChange: (show: boolean) => void;
  onShowRingsChange: (show: boolean) => void;
  onRotationChange: (rotation: number) => void;
}

export function PlaybackControls({
  isPlaying,
  // progress,
  duration,
  easing,
  loopDirection,
  showDot: _showDot,
  showRings: _showRings,
  rotation,
  onPlay,
  onPause: _onPause,
  onReset,
  // onProgressChange,
  onDurationChange,
  onEasingChange,
  onLoopDirectionChange,
  onShowDotChange: _onShowDotChange,
  onShowRingsChange: _onShowRingsChange,
  onRotationChange,
}: PlaybackControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.playbackButtons}>
        <button
          className={styles.button}
          onClick={isPlaying ? onReset : onPlay}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>

      <div className={styles.controlGroup}>
        <label
          htmlFor="speed-slider"
          title="How fast the pattern draws, in seconds"
        >
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

      <div className={styles.controlGroup}>
        <label
          htmlFor="rotation"
          title="Which direction do we start drawing from?"
        >
          Starting Position
        </label>
        <select
          id="rotation"
          value={rotation}
          onChange={(e) => onRotationChange(Number(e.target.value))}
          className={styles.select}
        >
          <option value="0">Right</option>
          <option value="90">Down</option>
          <option value="180">Left</option>
          <option value="270">Up</option>
        </select>
      </div>

      <div className={styles.controlGroup}>
        <label
          htmlFor="easing"
          title="How the animation accelerates and decelerates"
        >
          Easing
        </label>
        <select
          id="easing"
          value={easing}
          onChange={(e) => onEasingChange(e.target.value as EasingType)}
          className={styles.select}
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

      <div className={styles.controlGroup}>
        <label htmlFor="loop-direction" title="How the animation loops">
          Loop Style
        </label>
        <select
          id="loop-direction"
          value={loopDirection}
          onChange={(e) =>
            onLoopDirectionChange(e.target.value as LoopDirection)
          }
          className={styles.select}
        >
          <option value="none">None</option>
          <option value="continue">Continue</option>
          <option value="pingpong">Ping-Pong</option>
        </select>
      </div>

      {/* <div className={styles.controlGroup}>
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
          style={{ opacity: 0.5 }}
        />
      </div> */}
    </div>
  );
}
