import { useWizard } from '../../hooks/useWizard';
import type { WizardStep } from '../../types';
import styles from './FloatingStepsBar.module.css';

interface StepInfo {
  key: WizardStep;
  label: string;
  icon: string;
}

const steps: StepInfo[] = [
  { key: 'upload', label: 'Upload', icon: '📷' },
  { key: 'flow', label: 'Settings', icon: '⚙️' },
  { key: 'configure', label: 'Configure', icon: '🎨' },
  { key: 'results', label: 'Results', icon: '✨' },
];

export function FloatingStepsBar() {
  const { state } = useWizard();
  const currentIndex = steps.findIndex((s) => s.key === state.currentStep);

  const visibleSteps = state.selectedFlow === 'grid'
    ? steps.filter(s => s.key !== 'configure')
    : steps;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {visibleSteps.map((step, index) => {
          const actualIndex = steps.findIndex(s => s.key === step.key);
          const isActive = state.currentStep === step.key;
          const isCompleted = currentIndex > actualIndex;

          return (
            <div
              key={step.key}
              className={`${styles.step} ${isActive ? styles.active : ''} ${
                isCompleted ? styles.completed : ''
              }`}
            >
              <span className={styles.icon}>{step.icon}</span>
              <span className={styles.label}>{step.label}</span>
              {index < visibleSteps.length - 1 && (
                <div className={`${styles.connector} ${isCompleted ? styles.connectorDone : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
