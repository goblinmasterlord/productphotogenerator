import { useEffect, useCallback, useState, useRef } from 'react';
import { useWizard } from '../../hooks/useWizard';
import { useLanguage } from '../../i18n/LanguageContext';
import { useGemini } from '../../hooks/useGemini';
import { Button } from '../ui/Button';
import { Lightbox } from '../ui/Lightbox';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import type { GeneratedImage, UsageMetadata } from '../../types';
import styles from './StepResults.module.css';

export function StepResults() {
  const { state, dispatch } = useWizard();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const hasStartedRef = useRef(false);

  const handleImageGenerated = useCallback(
    (image: GeneratedImage) => {
      dispatch({ type: 'ADD_GENERATED_IMAGE', payload: image });
    },
    [dispatch]
  );

  const handleUsage = useCallback(
    (usage: UsageMetadata) => {
      dispatch({ type: 'ADD_USAGE', payload: usage });
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
    onUsage: handleUsage,
    onError: handleError,
    translations: t,
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
    if (state.selectedFlow === 'grid' || state.selectedFlow === 'macroSet') {
      dispatch({ type: 'SET_STEP', payload: 'flow' });
    } else {
      dispatch({ type: 'SET_STEP', payload: 'configure' });
    }
  };

  const totalExpected = state.selectedFlow === 'grid'
    ? 9 * (state.settings.variations || 1)
    : state.selectedFlow === 'individual'
      ? state.selectedConcepts.length * (state.settings.variations || 1)
      : state.selectedFlow === 'macroSet'
        ? 4 // 4 macro images in the set
        : state.settings.variations || 1;

  // Error state with no images
  if (state.error && state.generatedImages.length === 0 && !isGenerating) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t.stepResults.errorTitle}</h2>
          <p>{t.stepResults.errorSubtitle}</p>
        </div>

        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{state.error}</p>
        </div>

        <FloatingActionBar>
          <Button variant="ghost" onClick={handleBack}>
            {t.stepResults.actions.goBack}
          </Button>
          <Button onClick={handleStartOver}>{t.stepResults.actions.startOver}</Button>
        </FloatingActionBar>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          {isGenerating ? t.stepResults.title.generating : t.stepResults.title.done}
        </h2>
        <p className={styles.progressText}>
          {isGenerating ? (
            <>
              <span className={styles.progressCount}>{state.generatedImages.length}</span>
              <span className={styles.progressDivider}>/</span>
              <span>{totalExpected}</span>
              <span className={styles.progressLabel}> {t.stepResults.progress.images}</span>
              {progress.currentConcept && (
                <span className={styles.currentConcept}>
                  — {t.stepResults.progress.generating} {progress.currentConcept}...
                </span>
              )}
            </>
          ) : (
            <>
              {state.generatedImages.length}{' '}
              {state.generatedImages.length === 1
                ? t.stepResults.generated.single
                : t.stepResults.generated.plural}
            </>
          )}
        </p>

        {/* Cost Summary */}
        {!isGenerating && state.sessionCosts.imageCount > 0 && (
          <div className={styles.costSummary}>
            <span className={styles.costIcon}>⚡</span>
            <span className={styles.costText}>
              {t.stepResults.cost.estimated}: ~${state.sessionCosts.estimatedCost.toFixed(2)}
            </span>
            <span className={styles.costDetails}>
              ({state.sessionCosts.imageCount} {state.sessionCosts.imageCount === 1 ? t.stepResults.cost.image : t.stepResults.cost.images})
            </span>
          </div>
        )}
      </div>

      {state.error && state.generatedImages.length > 0 && (
        <div className={styles.warningBanner}>
          <span className={styles.warningIcon}>⚠️</span>
          <span>{t.stepResults.warningPrefix} {state.error}</span>
        </div>
      )}

      {/* Gallery Grid */}
      <div
        className={styles.gallery}
        data-aspect-ratio={state.settings.aspectRatio}
      >
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
              {t.stepResults.actions.generateMore}
            </Button>
            {state.generatedImages.length > 1 && (
              <Button variant="secondary" onClick={handleDownloadAll}>
                {t.stepResults.actions.downloadAll}
              </Button>
            )}
            <Button onClick={handleStartOver}>
              {t.stepResults.actions.startOver}
            </Button>
          </>
        )}
        {isGenerating && (
          <div className={styles.generatingStatus}>
            <div className={styles.spinner} />
            <span>{t.stepResults.generatingStatus}</span>
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
