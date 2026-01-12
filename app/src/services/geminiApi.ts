import { GoogleGenerativeAI } from '@google/generative-ai';
import { GRID_PROMPT, INDIVIDUAL_PROMPT_TEMPLATE } from '../constants/prompts';
import { CONCEPT_DATA } from '../constants/concepts';
import type { GeneratedImage, GenerationSettings } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. API calls will fail.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

async function fileToGenerativePart(file: File): Promise<{
  inlineData: { data: string; mimeType: string };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extractImageFromResponse(response: any): string | null {
  try {
    const candidates = response.response?.candidates;
    if (!candidates || candidates.length === 0) return null;

    const parts = candidates[0]?.content?.parts;
    if (!parts) return null;

    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting image from response:', error);
    return null;
  }
}

function buildSettingsPrompt(settings: GenerationSettings): string {
  const parts: string[] = [];

  if (settings.aspectRatio !== 'auto') {
    parts.push(`Aspect ratio: ${settings.aspectRatio}`);
  }

  const resolutionMap = {
    '1k': '1024px',
    '2k': '2048px',
    '4k': '4096px',
  };
  parts.push(`Output resolution: ${resolutionMap[settings.resolution]} on longest side`);

  return parts.length > 0 ? `\n\nImage Settings:\n${parts.join('\n')}` : '';
}

export async function generateGrid(
  image: File,
  settings: GenerationSettings
): Promise<GeneratedImage> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview',
    generationConfig: {
      responseModalities: ['Text', 'Image'],
    } as any,
  });

  const imagePart = await fileToGenerativePart(image);
  const settingsPrompt = buildSettingsPrompt(settings);
  const fullPrompt = GRID_PROMPT + settingsPrompt;

  const result = await model.generateContent([fullPrompt, imagePart]);

  const imageData = extractImageFromResponse(result);

  if (!imageData) {
    throw new Error('No image was generated. Please try again.');
  }

  return {
    id: crypto.randomUUID(),
    imageData,
    prompt: fullPrompt,
  };
}

export async function generateConcept(
  image: File,
  conceptId: number,
  settings: GenerationSettings,
  conceptName?: string
): Promise<GeneratedImage> {
  const concept = CONCEPT_DATA.find((c) => c.id === conceptId);
  if (!concept) {
    throw new Error(`Concept with ID ${conceptId} not found`);
  }

  const basePrompt = INDIVIDUAL_PROMPT_TEMPLATE.replace(
    '{CONCEPT_PROMPT}',
    concept.prompt
  );
  const settingsPrompt = buildSettingsPrompt(settings);
  const fullPrompt = basePrompt + settingsPrompt;

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview',
    generationConfig: {
      responseModalities: ['Text', 'Image'],
    } as any,
  });

  const imagePart = await fileToGenerativePart(image);

  const result = await model.generateContent([fullPrompt, imagePart]);

  const imageData = extractImageFromResponse(result);

  if (!imageData) {
    throw new Error(`Failed to generate concept. Please try again.`);
  }

  return {
    id: crypto.randomUUID(),
    conceptId: concept.id,
    conceptName: conceptName || `Concept ${concept.id}`,
    imageData,
    prompt: fullPrompt,
  };
}

export async function generateCustom(
  image: File,
  prompt: string,
  settings: GenerationSettings
): Promise<GeneratedImage> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview',
    generationConfig: {
      responseModalities: ['Text', 'Image'],
    } as any,
  });

  const imagePart = await fileToGenerativePart(image);
  const settingsPrompt = buildSettingsPrompt(settings);

  // Wrap the custom prompt with product-specific instructions
  const fullPrompt = `Using the uploaded product image as reference, create a professional marketing image based on the following concept:

${prompt}

Visual Rules:
- Product must remain 100% accurate in shape, proportions, label, typography, color, and branding
- No distortion, deformation, or redesign of the product
- Clean separation between product and background
- Soft, controlled studio lighting
- High dynamic range, ultra-sharp focus
- Editorial luxury advertising aesthetic${settingsPrompt}`;

  const result = await model.generateContent([fullPrompt, imagePart]);

  const imageData = extractImageFromResponse(result);

  if (!imageData) {
    throw new Error('Failed to generate image. Please try again.');
  }

  return {
    id: crypto.randomUUID(),
    imageData,
    prompt,
  };
}
