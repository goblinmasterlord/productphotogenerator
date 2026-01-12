import { useWizard } from '../../hooks/useWizard';
import { ImageUploader } from '../ui/ImageUploader';
import { Button } from '../ui/Button';
import styles from './WizardSteps.module.css';

export function StepUpload() {
  const { state, dispatch, nextStep, canProceed } = useWizard();

  const handleImageSelect = (file: File, preview: string) => {
    dispatch({ type: 'SET_IMAGE', payload: { file, preview } });
  };

  const handleImageClear = () => {
    dispatch({ type: 'CLEAR_IMAGE' });
  };

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>Upload Your Product</h2>
        <p>Start by uploading a high-quality image of your product</p>
      </div>

      <ImageUploader
        preview={state.imagePreview}
        onImageSelect={handleImageSelect}
        onImageClear={handleImageClear}
      />

      <div className={styles.actions}>
        <Button
          onClick={nextStep}
          disabled={!canProceed()}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
