import { presets } from '../../data/presets';
import { SpirographParams } from '../../lib/spirograph/types';
import styles from './PresetGallery.module.css';

interface PresetGalleryProps {
  onSelectPreset: (params: SpirographParams) => void;
}

export function PresetGallery({ onSelectPreset }: PresetGalleryProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={styles.presetCard}
            onClick={() => onSelectPreset(preset.params)}
            title={preset.description}
          >
            <div className={styles.previewCircle} style={{ borderColor: preset.params.strokeColor }}>
              <svg viewBox="0 0 40 40" className={styles.miniIcon}>
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  fill="none"
                  stroke={preset.params.strokeColor}
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>
            <div className={styles.info}>
              <h4>{preset.name}</h4>
              <p>{preset.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
