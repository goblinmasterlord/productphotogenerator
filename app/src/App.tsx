import { WizardProvider, useWizard } from './hooks/useWizard';
import { LanguageProvider } from './i18n/LanguageContext';
import { TopBar } from './components/layout/TopBar';
import { StepUpload } from './components/wizard/StepUpload';
import { StepFlowSelect } from './components/wizard/StepFlowSelect';
import { StepConceptSelect } from './components/wizard/StepConceptSelect';
import { StepCustomPrompt } from './components/wizard/StepCustomPrompt';
import { StepResults } from './components/wizard/StepResults';
import './styles/globals.css';

function WizardContent() {
  const { state } = useWizard();

  const renderStep = () => {
    switch (state.currentStep) {
      case 'upload':
        return <StepUpload />;
      case 'flow':
        return <StepFlowSelect />;
      case 'configure':
        if (state.selectedFlow === 'individual') {
          return <StepConceptSelect />;
        }
        if (state.selectedFlow === 'custom') {
          return <StepCustomPrompt />;
        }
        // Grid flow skips configure
        return null;
      case 'results':
        return <StepResults />;
      default:
        return <StepUpload />;
    }
  };

  return (
    <div className="wizard-content">
      {renderStep()}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <WizardProvider>
        <div className="app-layout">
          <TopBar />
          <main className="main-content">
            <WizardContent />
          </main>
        </div>
      </WizardProvider>
    </LanguageProvider>
  );
}

export default App;
