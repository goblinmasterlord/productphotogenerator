import { GoogleGenerativeAI } from '@google/generative-ai';
import { GRID_PROMPT, INDIVIDUAL_PROMPT_TEMPLATE, MACRO_SET_PROMPTS, MACRO_SET_BASE_RULES } from '../constants/prompts';
import { CONCEPT_DATA } from '../constants/concepts';
import type { GeneratedImage, GenerationSettings, UsageMetadata } from '../types';

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

interface ExtractedResponse {
  imageData: string | null;
  usage: UsageMetadata | null;
}

function extractImageFromResponse(response: any): ExtractedResponse {
  const result: ExtractedResponse = { imageData: null, usage: null };

  try {
    // Extract usage metadata
    const usageMetadata = response.response?.usageMetadata;
    if (usageMetadata) {
      result.usage = {
        promptTokenCount: usageMetadata.promptTokenCount || 0,
        candidatesTokenCount: usageMetadata.candidatesTokenCount || 0,
        totalTokenCount: usageMetadata.totalTokenCount || 0,
      };
    }

    // Extract image
    const candidates = response.response?.candidates;
    if (!candidates || candidates.length === 0) return result;

    const parts = candidates[0]?.content?.parts;
    if (!parts) return result;

    for (const part of parts) {
      if (part.inlineData?.data) {
        result.imageData = part.inlineData.data;
        break;
      }
    }
    return result;
  } catch (error) {
    console.error('Error extracting image from response:', error);
    return result;
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

  const { imageData, usage } = extractImageFromResponse(result);

  if (!imageData) {
    throw new Error('No image was generated. Please try again.');
  }

  return {
    id: crypto.randomUUID(),
    imageData,
    prompt: fullPrompt,
    usage: usage || undefined,
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

  const { imageData, usage } = extractImageFromResponse(result);

  if (!imageData) {
    throw new Error(`Failed to generate concept. Please try again.`);
  }

  return {
    id: crypto.randomUUID(),
    conceptId: concept.id,
    conceptName: conceptName || `Concept ${concept.id}`,
    imageData,
    prompt: fullPrompt,
    usage: usage || undefined,
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

  const { imageData, usage } = extractImageFromResponse(result);

  if (!imageData) {
    throw new Error('Failed to generate image. Please try again.');
  }

  return {
    id: crypto.randomUUID(),
    imageData,
    prompt,
    usage: usage || undefined,
  };
}

export async function generateMacroSetImage(
  image: File,
  macroIndex: number,
  settings: GenerationSettings
): Promise<GeneratedImage> {
  const macroPrompt = MACRO_SET_PROMPTS[macroIndex];
  if (!macroPrompt) {
    throw new Error(`Macro prompt with index ${macroIndex} not found`);
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview',
    generationConfig: {
      responseModalities: ['Text', 'Image'],
    } as any,
  });

  const imagePart = await fileToGenerativePart(image);
  const settingsPrompt = buildSettingsPrompt(settings);
  const fullPrompt = `${macroPrompt.prompt}${MACRO_SET_BASE_RULES}${settingsPrompt}`;

  const result = await model.generateContent([fullPrompt, imagePart]);

  const { imageData, usage } = extractImageFromResponse(result);

  if (!imageData) {
    throw new Error(`Failed to generate macro image. Please try again.`);
  }

  return {
    id: crypto.randomUUID(),
    conceptName: macroPrompt.name,
    imageData,
    prompt: fullPrompt,
    usage: usage || undefined,
  };
}

export { MACRO_SET_PROMPTS };
