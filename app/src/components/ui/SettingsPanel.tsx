import { useWizard } from '../../hooks/useWizard';
import type { AspectRatio, Resolution, VariationCount } from '../../types';
import styles from './SettingsPanel.module.css';

const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: '1:1', label: '1:1' },
  { value: '3:4', label: '3:4' },
  { value: '4:3', label: '4:3' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
];

const resolutions: { value: Resolution; label: string; desc: string }[] = [
  { value: '1k', label: '1K', desc: 'Fast' },
  { value: '2k', label: '2K', desc: 'Balanced' },
  { value: '4k', label: '4K', desc: 'High Quality' },
];

const variations: { value: VariationCount; label: string }[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
];

export function SettingsPanel() {
  const { state, dispatch } = useWizard();

  return (
    <div className={styles.panel}>
      <div className={styles.setting}>
        <label className={styles.label}>Aspect Ratio</label>
        <div className={styles.options}>
          {aspectRatios.map((ar) => (
            <button
              key={ar.value}
              type="button"
              className={`${styles.option} ${
                state.settings.aspectRatio === ar.value ? styles.selected : ''
              }`}
              onClick={() =>
                dispatch({ type: 'SET_SETTINGS', payload: { aspectRatio: ar.value } })
              }
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.setting}>
        <label className={styles.label}>Resolution</label>
        <div className={styles.options}>
          {resolutions.map((res) => (
            <button
              key={res.value}
              type="button"
              className={`${styles.option} ${styles.resOption} ${
                state.settings.resolution === res.value ? styles.selected : ''
              }`}
              onClick={() =>
                dispatch({ type: 'SET_SETTINGS', payload: { resolution: res.value } })
              }
            >
              <span className={styles.resLabel}>{res.label}</span>
              <span className={styles.resDesc}>{res.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.setting}>
        <label className={styles.label}>Variations</label>
        <div className={styles.options}>
          {variations.map((v) => (
            <button
              key={v.value}
              type="button"
              className={`${styles.option} ${
                state.settings.variations === v.value ? styles.selected : ''
              }`}
              onClick={() =>
                dispatch({ type: 'SET_SETTINGS', payload: { variations: v.value } })
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
