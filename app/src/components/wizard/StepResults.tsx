import { useEffect, useCallback, useState, useRef } from 'react';
import { useWizard } from '../../hooks/useWizard';
import { useGemini } from '../../hooks/useGemini';
import { Button } from '../ui/Button';
import { Lightbox } from '../ui/Lightbox';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import type { GeneratedImage } from '../../types';
import styles from './StepResults.module.css';

export function StepResults() {
  const { state, dispatch } = useWizard();
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const hasStartedRef = useRef(false);

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
    // Using ref instead of state to prevent React Strict Mode double-execution
    if (
      !hasStartedRef.current &&
      state.generatedImages.length === 0 &&
      state.uploadedImage &&
      state.selectedFlow &&
      !isGenerating &&
      !state.error
    ) {
      hasStartedRef.current = true;
      generate(
        state.uploadedImage,
        state.selectedFlow,
        state.settings,
        state.selectedConcepts,
        state.customPrompt
      );
    }
  }, []);

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

  const handleDownloadAll = () => {
    state.generatedImages.forEach((image, index) => {
      setTimeout(() => handleDownload(image), index * 200);
    });
  };

  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_GENERATED_IMAGES', payload: [] });
    dispatch({ type: 'SET_ERROR', payload: null });
    hasStartedRef.current = false;
    if (state.selectedFlow === 'grid') {
      dispatch({ type: 'SET_STEP', payload: 'flow' });
    } else {
      dispatch({ type: 'SET_STEP', payload: 'configure' });
    }
  };

  const totalExpected = state.selectedFlow === 'grid'
    ? 9 * (state.settings.variations || 1)
    : state.selectedFlow === 'individual'
      ? state.selectedConcepts.length * (state.settings.variations || 1)
      : state.settings.variations || 1;

  // Error state with no images
  if (state.error && state.generatedImages.length === 0 && !isGenerating) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Something went wrong</h2>
          <p>We couldn't generate your images</p>
        </div>

        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{state.error}</p>
        </div>

        <FloatingActionBar>
          <Button variant="ghost" onClick={handleBack}>
            Go Back
          </Button>
          <Button onClick={handleStartOver}>Start Over</Button>
        </FloatingActionBar>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          {isGenerating ? 'Creating Your Creatives' : 'Your Creatives'}
        </h2>
        <p className={styles.progressText}>
          {isGenerating ? (
            <>
              <span className={styles.progressCount}>{state.generatedImages.length}</span>
              <span className={styles.progressDivider}>/</span>
              <span>{totalExpected}</span>
              <span className={styles.progressLabel}> images</span>
              {progress.currentConcept && (
                <span className={styles.currentConcept}>
                  — Generating {progress.currentConcept}...
                </span>
              )}
            </>
          ) : (
            <>
              {state.generatedImages.length} image
              {state.generatedImages.length !== 1 ? 's' : ''} generated
            </>
          )}
        </p>
      </div>

      {state.error && state.generatedImages.length > 0 && (
        <div className={styles.warningBanner}>
          <span className={styles.warningIcon}>⚠️</span>
          <span>Some images failed to generate: {state.error}</span>
        </div>
      )}

      {/* Gallery Grid */}
      <div className={styles.gallery}>
        {state.generatedImages.map((image, index) => (
          <div
            key={image.id}
            className={styles.galleryItem}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={styles.imageContainer}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={`data:image/png;base64,${image.imageData}`}
                alt={image.conceptName || 'Generated creative'}
                className={styles.image}
              />
              <div className={styles.imageHover}>
                <span className={styles.expandIcon}>⤢</span>
              </div>
            </div>
            <div className={styles.itemInfo}>
              {image.conceptName && (
                <span className={styles.conceptName}>{image.conceptName}</span>
              )}
              <button
                className={styles.downloadBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(image);
                }}
                title="Download"
              >
                ↓
              </button>
            </div>
          </div>
        ))}

        {/* Placeholder slots while generating */}
        {isGenerating && Array.from({ length: Math.max(0, totalExpected - state.generatedImages.length) }).map((_, i) => (
          <div key={`placeholder-${i}`} className={styles.placeholder}>
            <div className={styles.placeholderInner}>
              <div className={styles.placeholderPulse} />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar>
        {!isGenerating && (
          <>
            <Button variant="ghost" onClick={handleBack}>
              Generate More
            </Button>
            {state.generatedImages.length > 1 && (
              <Button variant="secondary" onClick={handleDownloadAll}>
                Download All
              </Button>
            )}
            <Button onClick={handleStartOver}>
              Start Over
            </Button>
          </>
        )}
        {isGenerating && (
          <div className={styles.generatingStatus}>
            <div className={styles.spinner} />
            <span>Generating...</span>
          </div>
        )}
      </FloatingActionBar>

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
