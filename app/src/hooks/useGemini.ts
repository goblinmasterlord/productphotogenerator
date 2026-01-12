import { useState, useCallback } from 'react';
import { generateGrid, generateConcept, generateCustom } from '../services/geminiApi';
import { getConcepts } from '../constants/concepts';
import type { GeneratedImage, FlowType, GenerationSettings } from '../types';
import type { Translations } from '../i18n/translations';

interface UseGeminiOptions {
  onImageGenerated?: (image: GeneratedImage) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  translations?: Translations;
}

export function useGemini(options: UseGeminiOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentConcept: '' });

  const generate = useCallback(
    async (
      image: File,
      flow: FlowType,
      settings: GenerationSettings,
      selectedConcepts: number[] = [],
      customPrompt: string = ''
    ): Promise<GeneratedImage[]> => {
      setIsGenerating(true);
      const results: GeneratedImage[] = [];
      const variationCount = settings.variations || 1;

      try {
        if (flow === 'grid') {
          const total = variationCount;
          setProgress({ current: 0, total, currentConcept: 'Full Grid' });

          for (let v = 0; v < variationCount; v++) {
            try {
              const result = await generateGrid(image, settings);
              results.push(result);
              options.onImageGenerated?.(result);
              setProgress({ current: v + 1, total, currentConcept: variationCount > 1 ? `Grid ${v + 1}` : '' });
            } catch (error) {
              console.error(`Failed to generate grid variation ${v + 1}:`, error);
            }
          }
        } else if (flow === 'individual') {
          const total = selectedConcepts.length * variationCount;
          let current = 0;

          // Get localized concept names if translations are provided
          const concepts = options.translations ? getConcepts(options.translations) : null;

          for (let i = 0; i < selectedConcepts.length; i++) {
            const conceptId = selectedConcepts[i];
            const concept = concepts?.find((c) => c.id === conceptId);
            const conceptName = concept?.name || `Concept ${conceptId}`;

            for (let v = 0; v < variationCount; v++) {
              setProgress({
                current,
                total,
                currentConcept: conceptName,
              });

              try {
                const result = await generateConcept(image, conceptId, settings, conceptName);
                results.push(result);
                options.onImageGenerated?.(result);
              } catch (error) {
                console.error(`Failed to generate concept ${conceptName} variation ${v + 1}:`, error);
              }
              current++;
            }
          }
          setProgress({ current: total, total, currentConcept: '' });
        } else if (flow === 'custom') {
          const total = variationCount;
          setProgress({ current: 0, total, currentConcept: 'Custom Creative' });

          for (let v = 0; v < variationCount; v++) {
            try {
              const result = await generateCustom(image, customPrompt, settings);
              results.push(result);
              options.onImageGenerated?.(result);
              setProgress({ current: v + 1, total, currentConcept: variationCount > 1 ? `Variation ${v + 1}` : '' });
            } catch (error) {
              console.error(`Failed to generate custom variation ${v + 1}:`, error);
            }
          }
        }

        options.onComplete?.();
        return results;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate images';
        options.onError?.(message);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [options]
  );

  return {
    generate,
    isGenerating,
    progress,
  };
}
