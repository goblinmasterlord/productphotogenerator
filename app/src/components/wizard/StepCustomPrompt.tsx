import { useState } from 'react';
import { useWizard } from '../../hooks/useWizard';
import { Button } from '../ui/Button';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import { optimizePrompt } from '../../services/promptOptimizer';
import styles from './WizardSteps.module.css';

export function StepCustomPrompt() {
  const { state, dispatch, prevStep, canProceed } = useWizard();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_CUSTOM_PROMPT', payload: e.target.value });
    dispatch({ type: 'SET_OPTIMIZED_PROMPT', payload: null });
  };

  const handleOptimize = async () => {
    if (!state.customPrompt.trim()) return;

    setIsOptimizing(true);
    try {
      const optimized = await optimizePrompt(state.customPrompt);
      dispatch({ type: 'SET_OPTIMIZED_PROMPT', payload: optimized });
    } catch (error) {
      console.error('Failed to optimize prompt:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to optimize prompt. Please try again.',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleUseOptimized = () => {
    if (state.optimizedPrompt) {
      dispatch({ type: 'SET_CUSTOM_PROMPT', payload: state.optimizedPrompt });
      dispatch({ type: 'SET_OPTIMIZED_PROMPT', payload: null });
    }
  };

  const handleGenerate = () => {
    dispatch({ type: 'SET_STEP', payload: 'results' });
  };

  return (
    <div className={styles.step}>
      <div className={styles.header}>
        <h2>Custom Prompt</h2>
        <p>Write your own prompt or use AI to optimize it</p>
      </div>

      <div className={styles.promptContainer}>
        <textarea
          className={styles.promptTextarea}
          value={state.customPrompt}
          onChange={handlePromptChange}
          placeholder="Describe the creative you want to generate...&#10;&#10;Example: Create a luxurious product shot with soft lighting, floating on a bed of rose petals with morning dew droplets..."
        />

        <div className={styles.promptActions}>
          <Button
            variant="secondary"
            onClick={handleOptimize}
            isLoading={isOptimizing}
            disabled={!state.customPrompt.trim()}
          >
            Optimize with AI
          </Button>
        </div>

        {state.optimizedPrompt && (
          <div className={styles.optimizedSection}>
            <div className={styles.optimizedLabel}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Optimized Prompt
            </div>
            <p className={styles.optimizedText}>{state.optimizedPrompt}</p>
            <div className={styles.optimizedActions}>
              <Button size="sm" onClick={handleUseOptimized}>
                Use This
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dispatch({ type: 'SET_OPTIMIZED_PROMPT', payload: null })}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>

      {state.error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{state.error}</p>
        </div>
      )}

      <FloatingActionBar>
        <Button variant="ghost" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleGenerate} disabled={!canProceed()}>
          Generate Image
        </Button>
      </FloatingActionBar>
    </div>
  );
}
