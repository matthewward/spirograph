import styles from './PlaybackControls.module.css';

interface PlaybackControlsProps {
  isPlaying: boolean;
  progress: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onProgressChange: (progress: number) => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  isPlaying,
  progress,
  speed,
  onPlay,
  onPause,
  onReset,
  onProgressChange,
  onSpeedChange,
}: PlaybackControlsProps) {
  const speedOptions = [0.25, 0.5, 1, 2, 4];

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="5" y="4" width="3" height="12" />
              <rect x="12" y="4" width="3" height="12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4 L5 16 L15 10 Z" />
            </svg>
          )}
        </button>

        <button
          className={styles.button}
          onClick={onReset}
          title="Reset"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 6 A6 6 0 1 1 6 6" />
            <path d="M11 3 L14 6 L11 9" />
          </svg>
        </button>

        <div className={styles.speedControl}>
          <label>Speed</label>
          <div className={styles.speedButtons}>
            {speedOptions.map((s) => (
              <button
                key={s}
                className={`${styles.speedButton} ${speed === s ? styles.active : ''}`}
                onClick={() => onSpeedChange(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          className={styles.timelineSlider}
        />
        <div className={styles.progressLabel}>
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}
