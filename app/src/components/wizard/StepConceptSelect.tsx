import { useWizard } from '../../hooks/useWizard';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import { getConcepts } from '../../constants/concepts';
import styles from './WizardSteps.module.css';

export function StepConceptSelect() {
  const { state, dispatch, prevStep, canProceed } = useWizard();
  const { t } = useLanguage();

  const concepts = getConcepts(t);

  const handleToggleConcept = (conceptId: number) => {
    dispatch({ type: 'TOGGLE_CONCEPT', payload: conceptId });
  };

  const handleGenerate = () => {
    dispatch({ type: 'SET_STEP', payload: 'results' });
  };

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>{t.stepConceptSelect.title}</h2>
        <p>{t.stepConceptSelect.subtitle}</p>
      </div>

      <div className={styles.conceptGrid}>
        {concepts.map((concept) => (
          <Card
            key={concept.id}
            variant={state.selectedConcepts.includes(concept.id) ? 'selected' : 'interactive'}
            className={styles.conceptCard}
            onClick={() => handleToggleConcept(concept.id)}
            padding="md"
          >
            <span className={styles.conceptIcon}>{concept.icon}</span>
            <h4 className={styles.conceptName}>{concept.name}</h4>
            <p className={styles.conceptDescription}>{concept.description}</p>
          </Card>
        ))}
      </div>

      {state.selectedConcepts.length > 0 && (
        <p className={styles.selectedCount}>
          <strong>{state.selectedConcepts.length}</strong>{' '}
          {state.selectedConcepts.length === 1
            ? t.stepConceptSelect.selectedCount.single
            : t.stepConceptSelect.selectedCount.plural}
        </p>
      )}

      <FloatingActionBar>
        <Button variant="ghost" onClick={prevStep}>
          {t.stepConceptSelect.back}
        </Button>
        <Button onClick={handleGenerate} disabled={!canProceed()}>
          {t.stepConceptSelect.generate} {state.selectedConcepts.length}
        </Button>
      </FloatingActionBar>
    </div>
  );
}
