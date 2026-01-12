import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROMPT_OPTIMIZER_SYSTEM } from '../constants/prompts';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function optimizePrompt(userPrompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
  });

  const prompt = `${PROMPT_OPTIMIZER_SYSTEM}

User's prompt to optimize:
"${userPrompt}"

Optimized prompt:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean up the response - remove quotes if present
  let optimized = text.trim();
  if (optimized.startsWith('"') && optimized.endsWith('"')) {
    optimized = optimized.slice(1, -1);
  }

  return optimized;
}
