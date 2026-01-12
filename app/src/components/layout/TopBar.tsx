import { useState } from 'react';
import { useWizard } from '../../hooks/useWizard';
import type { WizardStep } from '../../types';
import styles from './TopBar.module.css';

interface StepInfo {
  key: WizardStep;
  label: string;
  num: number;
}

const steps: StepInfo[] = [
  { key: 'upload', label: 'Upload', num: 1 },
  { key: 'flow', label: 'Choose Flow', num: 2 },
  { key: 'configure', label: 'Configure', num: 3 },
  { key: 'results', label: 'Results', num: 4 },
];

const resources = [
  {
    title: 'BanánMester Prompting Guide',
    url: 'https://x.com/googleaistudio/status/1994480371061469306',
    icon: '🍌',
  },
  {
    title: 'Generate Ad Creatives',
    url: 'https://x.com/azed_ai/status/2000845183257292883',
    icon: '✨',
  },
];

export function TopBar() {
  const { state } = useWizard();
  const [showResources, setShowResources] = useState(false);
  const currentIndex = steps.findIndex((s) => s.key === state.currentStep);

  const visibleSteps = state.selectedFlow === 'grid'
    ? steps.filter(s => s.key !== 'configure')
    : steps;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {/* Logo */}
        <div className={styles.logo}>
          <img src="/logo.png" alt="BanánMester" className={styles.logoImg} />
          <span className={styles.logoText}>BanánMester</span>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {visibleSteps.map((step, index) => {
            const actualIndex = steps.findIndex(s => s.key === step.key);
            const isActive = state.currentStep === step.key;
            const isCompleted = currentIndex > actualIndex;

            return (
              <div key={step.key} className={styles.stepWrapper}>
                <div
                  className={`${styles.step} ${isActive ? styles.stepActive : ''} ${
                    isCompleted ? styles.stepCompleted : ''
                  }`}
                >
                  <span className={styles.stepNum}>
                    {isCompleted ? '✓' : index + 1}
                  </span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
                {index < visibleSteps.length - 1 && (
                  <div className={`${styles.connector} ${isCompleted ? styles.connectorDone : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Resources */}
        <div className={styles.resourcesWrapper}>
          <button
            className={styles.resourcesBtn}
            onClick={() => setShowResources(!showResources)}
            aria-expanded={showResources}
          >
            <span>📚</span>
            <span className={styles.resourcesBtnText}>Resources</span>
            <svg
              className={`${styles.chevron} ${showResources ? styles.chevronOpen : ''}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showResources && (
            <>
              <div className={styles.backdrop} onClick={() => setShowResources(false)} />
              <div className={styles.dropdown}>
                {resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resourceLink}
                    onClick={() => setShowResources(false)}
                  >
                    <span>{resource.icon}</span>
                    <span>{resource.title}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
