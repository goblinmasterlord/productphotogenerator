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

const resolutions: { value: Resolution; label: string }[] = [
  { value: '1k', label: '1K' },
  { value: '2k', label: '2K' },
  { value: '4k', label: '4K' },
];

const variations: { value: VariationCount; label: string }[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
];

export function SettingsPanel() {
  const { state, dispatch } = useWizard();

  return (
    <div className={styles.panel}>
      <div className={styles.group}>
        <span className={styles.label}>Ratio</span>
        <div className={styles.options}>
          {aspectRatios.map((ar) => (
            <button
              key={ar.value}
              type="button"
              className={`${styles.btn} ${
                state.settings.aspectRatio === ar.value ? styles.btnSelected : ''
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

      <div className={styles.divider} />

      <div className={styles.group}>
        <span className={styles.label}>Resolution</span>
        <div className={styles.options}>
          {resolutions.map((res) => (
            <button
              key={res.value}
              type="button"
              className={`${styles.btn} ${
                state.settings.resolution === res.value ? styles.btnSelected : ''
              }`}
              onClick={() =>
                dispatch({ type: 'SET_SETTINGS', payload: { resolution: res.value } })
              }
            >
              {res.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <span className={styles.label}>Variations</span>
        <div className={styles.options}>
          {variations.map((v) => (
            <button
              key={v.value}
              type="button"
              className={`${styles.btn} ${
                state.settings.variations === v.value ? styles.btnSelected : ''
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
