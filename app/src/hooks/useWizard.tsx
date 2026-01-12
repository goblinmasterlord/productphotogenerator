import { createContext, useContext, useReducer } from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { WizardState, WizardAction, WizardStep } from '../types';

// Nano Banana Pro pricing (USD per 1M tokens)
const PRICING = {
  inputTokens: 2.0 / 1_000_000,  // $2.00 per 1M input tokens
  outputTokens: 8.0 / 1_000_000, // $8.00 per 1M output tokens
  imageGeneration: {
    '1k': 0.13,
    '2k': 0.13,
    '4k': 0.24,
  },
};

const initialState: WizardState = {
  currentStep: 'upload',
  uploadedImage: null,
  imagePreview: null,
  selectedFlow: null,
  selectedConcepts: [],
  customPrompt: '',
  optimizedPrompt: null,
  generatedImages: [],
  isLoading: false,
  error: null,
  settings: {
    aspectRatio: 'auto',
    resolution: '1k',
    variations: 1,
  },
  sessionCosts: {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    imageCount: 0,
    estimatedCost: 0,
  },
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_IMAGE':
      return {
        ...state,
        uploadedImage: action.payload.file,
        imagePreview: action.payload.preview,
        error: null,
      };
    case 'CLEAR_IMAGE':
      return {
        ...state,
        uploadedImage: null,
        imagePreview: null,
      };
    case 'SET_FLOW':
      return {
        ...state,
        selectedFlow: action.payload,
        selectedConcepts: [],
        customPrompt: '',
        optimizedPrompt: null,
      };
    case 'TOGGLE_CONCEPT':
      const conceptId = action.payload;
      const isSelected = state.selectedConcepts.includes(conceptId);
      return {
        ...state,
        selectedConcepts: isSelected
          ? state.selectedConcepts.filter((id) => id !== conceptId)
          : [...state.selectedConcepts, conceptId],
      };
    case 'SET_CUSTOM_PROMPT':
      return {
        ...state,
        customPrompt: action.payload,
      };
    case 'SET_OPTIMIZED_PROMPT':
      return {
        ...state,
        optimizedPrompt: action.payload,
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'ADD_GENERATED_IMAGE':
      return {
        ...state,
        generatedImages: [...state.generatedImages, action.payload],
      };
    case 'SET_GENERATED_IMAGES':
      return {
        ...state,
        generatedImages: action.payload,
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'ADD_USAGE': {
      const usage = action.payload;
      const newInputTokens = state.sessionCosts.totalInputTokens + usage.promptTokenCount;
      const newOutputTokens = state.sessionCosts.totalOutputTokens + usage.candidatesTokenCount;
      const newImageCount = state.sessionCosts.imageCount + 1;

      // Calculate cost: tokens + per-image cost based on resolution
      const tokenCost = (newInputTokens * PRICING.inputTokens) + (newOutputTokens * PRICING.outputTokens);
      const imageCost = newImageCount * PRICING.imageGeneration[state.settings.resolution];
      const totalCost = tokenCost + imageCost;

      return {
        ...state,
        sessionCosts: {
          totalInputTokens: newInputTokens,
          totalOutputTokens: newOutputTokens,
          imageCount: newImageCount,
          estimatedCost: totalCost,
        },
      };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface WizardContextValue {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
  goToStep: (step: WizardStep) => void;
  canProceed: () => boolean;
  nextStep: () => void;
  prevStep: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

const stepOrder: WizardStep[] = ['upload', 'flow', 'configure', 'results'];

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const goToStep = (step: WizardStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const canProceed = (): boolean => {
    switch (state.currentStep) {
      case 'upload':
        return state.uploadedImage !== null;
      case 'flow':
        return state.selectedFlow !== null;
      case 'configure':
        if (state.selectedFlow === 'grid') return true;
        if (state.selectedFlow === 'individual') return state.selectedConcepts.length > 0;
        if (state.selectedFlow === 'custom') return state.customPrompt.trim().length > 0;
        return false;
      case 'results':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const currentIndex = stepOrder.indexOf(state.currentStep);
    if (currentIndex < stepOrder.length - 1 && canProceed()) {
      // Skip configure step for grid and macroSet flows
      if (state.currentStep === 'flow' && (state.selectedFlow === 'grid' || state.selectedFlow === 'macroSet')) {
        dispatch({ type: 'SET_STEP', payload: 'results' });
      } else {
        dispatch({ type: 'SET_STEP', payload: stepOrder[currentIndex + 1] });
      }
    }
  };

  const prevStep = () => {
    const currentIndex = stepOrder.indexOf(state.currentStep);
    if (currentIndex > 0) {
      // Handle back from results with grid or macroSet flow
      if (state.currentStep === 'results' && (state.selectedFlow === 'grid' || state.selectedFlow === 'macroSet')) {
        dispatch({ type: 'SET_STEP', payload: 'flow' });
      } else {
        dispatch({ type: 'SET_STEP', payload: stepOrder[currentIndex - 1] });
      }
    }
  };

  return (
    <WizardContext.Provider
      value={{ state, dispatch, goToStep, canProceed, nextStep, prevStep }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
