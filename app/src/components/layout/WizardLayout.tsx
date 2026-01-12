import type { ReactNode } from 'react';
import { useWizard } from '../../hooks/useWizard';
import type { WizardStep } from '../../types';
import styles from './WizardLayout.module.css';

interface StepInfo {
  key: WizardStep;
  label: string;
  number: number;
}

const steps: StepInfo[] = [
  { key: 'upload', label: 'Upload', number: 1 },
  { key: 'flow', label: 'Choose Flow', number: 2 },
  { key: 'configure', label: 'Configure', number: 3 },
  { key: 'results', label: 'Results', number: 4 },
];

interface WizardLayoutProps {
  children: ReactNode;
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { state } = useWizard();
  const currentIndex = steps.findIndex((s) => s.key === state.currentStep);

  // For grid flow, we skip configure, so adjust display
  const visibleSteps = state.selectedFlow === 'grid'
    ? steps.filter(s => s.key !== 'configure')
    : steps;

  return (
    <div className={styles.layout}>
      <div className={styles.stepIndicator}>
        {visibleSteps.map((step, index) => {
          const actualIndex = steps.findIndex(s => s.key === step.key);
          const isActive = state.currentStep === step.key;
          const isCompleted = currentIndex > actualIndex;

          return (
            <div key={step.key} className={styles.stepWrapper}>
              <div
                className={`${styles.step} ${isActive ? styles.active : ''} ${
                  isCompleted ? styles.completed : ''
                }`}
              >
                <div className={styles.stepNumber}>
                  {isCompleted ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
              {index < visibleSteps.length - 1 && (
                <div
                  className={`${styles.connector} ${
                    isCompleted ? styles.connectorCompleted : ''
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
