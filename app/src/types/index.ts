export type FlowType = 'grid' | 'individual' | 'custom';

export type WizardStep = 'upload' | 'flow' | 'configure' | 'results';

export type AspectRatio = 'auto' | '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export type Resolution = '1k' | '2k' | '4k';

export type VariationCount = 1 | 2;

export interface Concept {
  id: number;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  resolution: Resolution;
  variations: VariationCount;
}

export interface WizardState {
  currentStep: WizardStep;
  uploadedImage: File | null;
  imagePreview: string | null;
  selectedFlow: FlowType | null;
  selectedConcepts: number[];
  customPrompt: string;
  optimizedPrompt: string | null;
  generatedImages: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  settings: GenerationSettings;
}

export interface GeneratedImage {
  id: string;
  conceptId?: number;
  conceptName?: string;
  imageData: string; // base64
  prompt: string;
}

export type WizardAction =
  | { type: 'SET_IMAGE'; payload: { file: File; preview: string } }
  | { type: 'CLEAR_IMAGE' }
  | { type: 'SET_FLOW'; payload: FlowType }
  | { type: 'TOGGLE_CONCEPT'; payload: number }
  | { type: 'SET_CUSTOM_PROMPT'; payload: string }
  | { type: 'SET_OPTIMIZED_PROMPT'; payload: string | null }
  | { type: 'SET_STEP'; payload: WizardStep }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_GENERATED_IMAGE'; payload: GeneratedImage }
  | { type: 'SET_GENERATED_IMAGES'; payload: GeneratedImage[] }
  | { type: 'SET_SETTINGS'; payload: Partial<GenerationSettings> }
  | { type: 'RESET' };
