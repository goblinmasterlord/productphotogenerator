import { useState } from 'react';
import { useWizard } from '../../hooks/useWizard';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';
import { FloatingActionBar } from '../layout/FloatingActionBar';
import { optimizePrompt } from '../../services/promptOptimizer';
import styles from './WizardSteps.module.css';

export function StepCustomPrompt() {
  const { state, dispatch, prevStep, canProceed } = useWizard();
  const { t } = useLanguage();
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
        payload: t.common.errors.optimizeFailed,
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
        <h2>{t.stepCustomPrompt.title}</h2>
        <p>{t.stepCustomPrompt.subtitle}</p>
      </div>

      <div className={styles.promptContainer}>
        <textarea
          className={styles.promptTextarea}
          value={state.customPrompt}
          onChange={handlePromptChange}
          placeholder={t.stepCustomPrompt.placeholder}
        />

        <div className={styles.promptActions}>
          <Button
            variant="secondary"
            onClick={handleOptimize}
            isLoading={isOptimizing}
            disabled={!state.customPrompt.trim()}
          >
            {t.stepCustomPrompt.optimizeBtn}
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
              {t.stepCustomPrompt.optimizedLabel}
            </div>
            <p className={styles.optimizedText}>{state.optimizedPrompt}</p>
            <div className={styles.optimizedActions}>
              <Button size="sm" onClick={handleUseOptimized}>
                {t.stepCustomPrompt.useThis}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dispatch({ type: 'SET_OPTIMIZED_PROMPT', payload: null })}
              >
                {t.stepCustomPrompt.dismiss}
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
          {t.stepCustomPrompt.back}
        </Button>
        <Button onClick={handleGenerate} disabled={!canProceed()}>
          {t.stepCustomPrompt.generate}
        </Button>
      </FloatingActionBar>
    </div>
  );
}
