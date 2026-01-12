import { useWizard } from '../../hooks/useWizard';
import { useLanguage } from '../../i18n/LanguageContext';
import { ImageUploader } from '../ui/ImageUploader';
import { Button } from '../ui/Button';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import styles from './StepUpload.module.css';

export function StepUpload() {
  const { state, dispatch, nextStep, canProceed } = useWizard();
  const { t } = useLanguage();

  const handleImageSelect = (file: File, preview: string) => {
    dispatch({ type: 'SET_IMAGE', payload: { file, preview } });
  };

  const handleImageClear = () => {
    dispatch({ type: 'CLEAR_IMAGE' });
  };

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>{t.stepUpload.title}</h2>
        <p>{t.stepUpload.subtitle}</p>
      </div>

      <div className={styles.content}>
        <ImageUploader
          preview={state.imagePreview}
          onImageSelect={handleImageSelect}
          onImageClear={handleImageClear}
        />

        {!state.imagePreview && (
          <div className={styles.tipsSection}>
            <h3 className={styles.tipsTitle}>{t.stepUpload.tips.title}</h3>
            <div className={styles.tipsGrid}>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>📸</span>
                <span>{t.stepUpload.tips.highQuality}</span>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>🎯</span>
                <span>{t.stepUpload.tips.centered}</span>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>💡</span>
                <span>{t.stepUpload.tips.lighting}</span>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>🖼️</span>
                <span>{t.stepUpload.tips.background}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <FloatingActionBar>
        <Button
          onClick={nextStep}
          disabled={!canProceed()}
          size="lg"
        >
          {t.stepUpload.continue}
        </Button>
      </FloatingActionBar>
    </div>
  );
}
