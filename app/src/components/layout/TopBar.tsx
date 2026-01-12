import { useState } from 'react';
import { useWizard } from '../../hooks/useWizard';
import { useLanguage } from '../../i18n/LanguageContext';
import type { WizardStep } from '../../types';
import styles from './TopBar.module.css';

interface StepInfo {
  key: WizardStep;
  num: number;
}

const stepKeys: StepInfo[] = [
  { key: 'upload', num: 1 },
  { key: 'flow', num: 2 },
  { key: 'configure', num: 3 },
  { key: 'results', num: 4 },
];

const resources = [
  {
    urlKey: 'promptingGuide' as const,
    url: 'https://x.com/googleaistudio/status/1994480371061469306',
    icon: '🍌',
  },
  {
    urlKey: 'adCreatives' as const,
    url: 'https://x.com/azed_ai/status/2000845183257292883',
    icon: '✨',
  },
];

export function TopBar() {
  const { state, dispatch } = useWizard();
  const { language, setLanguage, t } = useLanguage();
  const [showResources, setShowResources] = useState(false);

  const steps = stepKeys.map(s => ({
    ...s,
    label: t.topBar.steps[s.key],
  }));

  const currentIndex = steps.findIndex((s) => s.key === state.currentStep);

  const visibleSteps = state.selectedFlow === 'grid'
    ? steps.filter(s => s.key !== 'configure')
    : steps;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {/* Logo - clickable to go home */}
        <button
          className={styles.logo}
          onClick={() => dispatch({ type: 'RESET' })}
          title={t.topBar.backToHome}
        >
          <img src="/logo.png" alt="BanánMester" className={styles.logoImg} />
          <span className={styles.logoText}>BanánMester</span>
        </button>

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
                  {/* Only show label for current and future steps */}
                  {!isCompleted && (
                    <span className={styles.stepLabel}>{step.label}</span>
                  )}
                </div>
                {index < visibleSteps.length - 1 && (
                  <div className={`${styles.connector} ${isCompleted ? styles.connectorDone : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Language Selector */}
        <div className={styles.languageSelector}>
          <button
            className={`${styles.langBtn} ${language === 'hu' ? styles.langBtnActive : ''}`}
            onClick={() => setLanguage('hu')}
          >
            HU
          </button>
          <button
            className={`${styles.langBtn} ${language === 'en' ? styles.langBtnActive : ''}`}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>

        {/* Resources */}
        <div className={styles.resourcesWrapper}>
          <button
            className={styles.resourcesBtn}
            onClick={() => setShowResources(!showResources)}
            aria-expanded={showResources}
          >
            <span>📚</span>
            <span className={styles.resourcesBtnText}>{t.topBar.resources}</span>
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
                    <span>{t.topBar.resourceLinks[resource.urlKey]}</span>
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
