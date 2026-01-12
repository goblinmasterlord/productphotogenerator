import { useWizard } from '../../hooks/useWizard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import { CONCEPTS } from '../../constants/concepts';
import styles from './WizardSteps.module.css';

export function StepConceptSelect() {
  const { state, dispatch, prevStep, canProceed } = useWizard();

  const handleToggleConcept = (conceptId: number) => {
    dispatch({ type: 'TOGGLE_CONCEPT', payload: conceptId });
  };

  const handleGenerate = () => {
    dispatch({ type: 'SET_STEP', payload: 'results' });
  };

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>Select Concepts</h2>
        <p>Choose which creative concepts to generate for your product</p>
      </div>

      <div className={styles.conceptGrid}>
        {CONCEPTS.map((concept) => (
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
          <strong>{state.selectedConcepts.length}</strong> concept
          {state.selectedConcepts.length !== 1 ? 's' : ''} selected
        </p>
      )}

      <FloatingActionBar>
        <Button variant="ghost" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleGenerate} disabled={!canProceed()}>
          Generate {state.selectedConcepts.length} Image
          {state.selectedConcepts.length !== 1 ? 's' : ''}
        </Button>
      </FloatingActionBar>
    </div>
  );
}
