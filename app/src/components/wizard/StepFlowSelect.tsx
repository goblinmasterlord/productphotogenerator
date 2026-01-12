import { useWizard } from '../../hooks/useWizard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SettingsPanel } from '../ui/SettingsPanel';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import type { FlowType } from '../../types';
import styles from './WizardSteps.module.css';

interface FlowOption {
  type: FlowType;
  icon: string;
  title: string;
  description: string;
}

const flowOptions: FlowOption[] = [
  {
    type: 'grid',
    icon: '🎯',
    title: 'Full Grid',
    description: 'Generate all 9 concepts in a 3x3 grid',
  },
  {
    type: 'individual',
    icon: '✨',
    title: 'Pick & Choose',
    description: 'Select specific concepts to generate',
  },
  {
    type: 'custom',
    icon: '✏️',
    title: 'Custom Prompt',
    description: 'Write your own prompt',
  },
];

export function StepFlowSelect() {
  const { state, dispatch, nextStep, prevStep, canProceed } = useWizard();

  const handleSelectFlow = (type: FlowType) => {
    dispatch({ type: 'SET_FLOW', payload: type });
  };

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>Choose Your Flow</h2>
        <p>Select generation mode and configure settings</p>
      </div>

      <SettingsPanel />

      <div className={styles.flowGrid}>
        {flowOptions.map((option) => (
          <Card
            key={option.type}
            variant={state.selectedFlow === option.type ? 'selected' : 'interactive'}
            className={styles.flowCard}
            onClick={() => handleSelectFlow(option.type)}
          >
            <span className={styles.flowIcon}>{option.icon}</span>
            <h3 className={styles.flowTitle}>{option.title}</h3>
            <p className={styles.flowDescription}>{option.description}</p>
          </Card>
        ))}
      </div>

      <FloatingActionBar>
        <Button variant="ghost" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!canProceed()}>
          Continue
        </Button>
      </FloatingActionBar>
    </div>
  );
}
