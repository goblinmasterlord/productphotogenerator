import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  progress: {
    current: number;
    total: number;
    currentConcept: string;
  };
}

const tips = [
  'Nano Banana Pro uses "thinking" to understand your intent before generating',
  'For best results, use high-quality product photos with clean backgrounds',
  'Each concept explores a different creative direction for your product',
  'The AI maintains 100% product accuracy across all generated images',
  'Higher resolutions take longer but produce sharper details',
  'You can download and use these images for your ad campaigns',
  'The model excels at editorial luxury advertising aesthetics',
  'Try different aspect ratios to match your campaign requirements',
];

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(tipInterval);
      clearInterval(dotInterval);
    };
  }, []);

  const percentage = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.visualContainer}>
          <div className={styles.orbitContainer}>
            <div className={styles.orbit}>
              <div className={styles.planet} />
            </div>
            <div className={styles.centerIcon}>🍌</div>
          </div>
        </div>

        <div className={styles.textContent}>
          <h2 className={styles.title}>
            Creating Magic{dots}
          </h2>

          {progress.currentConcept && (
            <p className={styles.currentTask}>
              Generating: <strong>{progress.currentConcept}</strong>
            </p>
          )}

          {progress.total > 1 && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {progress.current} of {progress.total} complete
              </span>
            </div>
          )}

          <div className={styles.tipContainer}>
            <div className={styles.tipIcon}>💡</div>
            <p className={styles.tip}>{tips[tipIndex]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
