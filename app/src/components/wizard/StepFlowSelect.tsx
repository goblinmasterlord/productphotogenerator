import { useWizard } from '../../hooks/useWizard';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SettingsPanel } from '../ui/SettingsPanel';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import type { FlowType } from '../../types';
import styles from './WizardSteps.module.css';

interface FlowOption {
  type: FlowType;
  icon: string;
}

const flowOptionIcons: FlowOption[] = [
  { type: 'grid', icon: '🎯' },
  { type: 'individual', icon: '✨' },
  { type: 'macroSet', icon: '🔍' },
  { type: 'custom', icon: '✏️' },
];

export function StepFlowSelect() {
  const { state, dispatch, nextStep, prevStep, canProceed } = useWizard();
  const { t } = useLanguage();

  const flowOptions = flowOptionIcons.map(({ type, icon }) => ({
    type,
    icon,
    title: t.stepFlowSelect.flows[type].title,
    description: t.stepFlowSelect.flows[type].description,
  }));

  const handleSelectFlow = (type: FlowType) => {
    dispatch({ type: 'SET_FLOW', payload: type });
  };

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>{t.stepFlowSelect.title}</h2>
        <p>{t.stepFlowSelect.subtitle}</p>
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
          {t.stepFlowSelect.back}
        </Button>
        <Button onClick={nextStep} disabled={!canProceed()}>
          {t.stepFlowSelect.continue}
        </Button>
      </FloatingActionBar>
    </div>
  );
}
