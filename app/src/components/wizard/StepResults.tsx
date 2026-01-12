import { useEffect, useCallback, useState } from 'react';
import { useWizard } from '../../hooks/useWizard';
import { useGemini } from '../../hooks/useGemini';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingScreen } from '../ui/LoadingScreen';
import { Lightbox } from '../ui/Lightbox';
import type { GeneratedImage } from '../../types';
import styles from './WizardSteps.module.css';

export function StepResults() {
  const { state, dispatch } = useWizard();
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleImageGenerated = useCallback(
    (image: GeneratedImage) => {
      dispatch({ type: 'ADD_GENERATED_IMAGE', payload: image });
    },
    [dispatch]
  );

  const handleError = useCallback(
    (error: string) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    [dispatch]
  );

  const { generate, isGenerating, progress } = useGemini({
    onImageGenerated: handleImageGenerated,
    onError: handleError,
  });

  useEffect(() => {
    // Only generate if we haven't already and have an image
    if (
      !hasStarted &&
      state.generatedImages.length === 0 &&
      state.uploadedImage &&
      state.selectedFlow &&
      !isGenerating &&
      !state.error
    ) {
      setHasStarted(true);
      dispatch({ type: 'SET_LOADING', payload: true });
      generate(
        state.uploadedImage,
        state.selectedFlow,
        state.settings,
        state.selectedConcepts,
        state.customPrompt
      ).finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
    }
  }, [hasStarted]);

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image.imageData}`;
    link.download = image.conceptName
      ? `${image.conceptName.toLowerCase().replace(/\s+/g, '-')}.png`
      : 'generated-creative.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_GENERATED_IMAGES', payload: [] });
    dispatch({ type: 'SET_ERROR', payload: null });
    setHasStarted(false);
    if (state.selectedFlow === 'grid') {
      dispatch({ type: 'SET_STEP', payload: 'flow' });
    } else {
      dispatch({ type: 'SET_STEP', payload: 'configure' });
    }
  };

  // Loading state
  if (isGenerating || state.isLoading) {
    return (
      <div className={styles.step}>
        <LoadingScreen progress={progress} />
      </div>
    );
  }

  // Error state
  if (state.error && state.generatedImages.length === 0) {
    return (
      <div className={styles.step}>
        <div className={styles.header}>
          <h2>Something went wrong</h2>
          <p>We couldn't generate your images</p>
        </div>

        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{state.error}</p>
        </div>

        <div className={styles.actionsSpaced}>
          <Button variant="ghost" onClick={handleBack}>
            Go Back
          </Button>
          <Button onClick={handleStartOver}>Start Over</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>Your Creatives</h2>
        <p>
          {state.generatedImages.length} image
          {state.generatedImages.length !== 1 ? 's' : ''} generated successfully
        </p>
      </div>

      {state.error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            Some images failed to generate: {state.error}
          </p>
        </div>
      )}

      <div className={styles.resultsGrid}>
        {state.generatedImages.map((image) => (
          <Card key={image.id} padding="none" className={styles.resultCard}>
            <div
              className={styles.resultImageWrapper}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={`data:image/png;base64,${image.imageData}`}
                alt={image.conceptName || 'Generated creative'}
                className={styles.resultImage}
              />
              <div className={styles.imageOverlay}>
                <span>Click to enlarge</span>
              </div>
            </div>
            <div className={styles.resultInfo}>
              {image.conceptName && (
                <h4 className={styles.resultName}>{image.conceptName}</h4>
              )}
              <Button
                variant="outline"
                size="sm"
                className={styles.downloadButton}
                onClick={() => handleDownload(image)}
              >
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.actionsSpaced}>
        <Button variant="ghost" onClick={handleBack}>
          Generate More
        </Button>
        <Button onClick={handleStartOver}>Start Over</Button>
      </div>

      {selectedImage && (
        <Lightbox
          imageSrc={`data:image/png;base64,${selectedImage.imageData}`}
          imageAlt={selectedImage.conceptName}
          onClose={() => setSelectedImage(null)}
          onDownload={() => handleDownload(selectedImage)}
        />
      )}
    </div>
  );
}
