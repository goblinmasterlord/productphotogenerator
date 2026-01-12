import type { Concept } from '../types';
import type { Translations } from '../i18n/translations';

type ConceptKey = 'heroStillLife' | 'macroDetail' | 'dynamicInteraction' | 'sculpturalMinimal' | 'floatingElements' | 'sensoryCloseup' | 'colorConcept' | 'abstractEssence' | 'surrealFusion';

interface ConceptData {
  id: number;
  key: ConceptKey;
  icon: string;
  prompt: string;
}

export const CONCEPT_DATA: ConceptData[] = [
  {
    id: 1,
    key: 'heroStillLife',
    icon: '🎯',
    prompt: 'Iconic hero still life with bold composition',
  },
  {
    id: 2,
    key: 'macroDetail',
    icon: '🔍',
    prompt: 'Extreme macro detail highlighting material, surface, or texture',
  },
  {
    id: 3,
    key: 'dynamicInteraction',
    icon: '💫',
    prompt: 'Dynamic liquid or particle interaction surrounding the product',
  },
  {
    id: 4,
    key: 'sculpturalMinimal',
    icon: '🔷',
    prompt: 'Minimal sculptural arrangement with abstract forms',
  },
  {
    id: 5,
    key: 'floatingElements',
    icon: '☁️',
    prompt: 'Floating elements composition suggesting lightness and innovation',
  },
  {
    id: 6,
    key: 'sensoryCloseup',
    icon: '✋',
    prompt: 'Sensory close-up emphasizing tactility and realism',
  },
  {
    id: 7,
    key: 'colorConcept',
    icon: '🎨',
    prompt: 'Color-driven conceptual scene inspired by the product palette',
  },
  {
    id: 8,
    key: 'abstractEssence',
    icon: '✨',
    prompt: 'Ingredient or component abstraction (non-literal, symbolic)',
  },
  {
    id: 9,
    key: 'surrealFusion',
    icon: '🌙',
    prompt: 'Surreal yet elegant fusion scene combining realism and imagination',
  },
];

export function getConcepts(t: Translations): Concept[] {
  return CONCEPT_DATA.map(({ id, key, icon, prompt }) => ({
    id,
    name: t.stepConceptSelect.concepts[key].name,
    description: t.stepConceptSelect.concepts[key].description,
    icon,
    prompt,
  }));
}
