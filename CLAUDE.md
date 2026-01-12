# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BanánMester** is a product photography tool that uses Google's Gemini AI (`gemini-3-pro-image-preview` model, aka "Nano Banana Pro") to generate professional ad creatives from product photos. Built with Vite + React + TypeScript.

## Commands

```bash
cd app
npm run dev      # Start dev server with HMR
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Environment Setup

Required environment variable:
```
VITE_GEMINI_API_KEY=your_google_generative_ai_key
```

## Architecture

### Wizard Flow Pattern
The app implements a 4-step wizard: **Upload → Flow Select → Configure → Results**

- **Upload**: User uploads product image
- **Flow Select**: Choose generation mode (Grid/Individual/Custom) + settings (aspect ratio, resolution, variations)
- **Configure**: Select concepts (Individual) or write prompt (Custom). Grid flow skips this step.
- **Results**: Display generated images with download options

### State Management
`useWizard` hook uses React Context + useReducer for centralized state:
- Current step, uploaded image, selected flow, concepts, prompts
- Generation settings (aspectRatio, resolution, variations)
- Generated images array, loading/error states

### Generation Flows
Three distinct flows handled by `useGemini` hook:
1. **Grid**: Generates 3x3 grid image with all 9 concepts
2. **Individual**: Generates selected concepts one-by-one (uses `CONCEPTS` from `constants/concepts.ts`)
3. **Custom**: User writes their own prompt (optionally optimized via `promptOptimizer` service)

### Services
- `geminiApi.ts`: Direct Gemini API integration (generateGrid, generateConcept, generateCustom)
- `promptOptimizer.ts`: Uses Gemini 2.0 Flash to enhance user prompts

### Component Organization
```
components/
├── layout/    # TopBar, FloatingActionBar, WizardLayout
├── ui/        # Button, Card, ImageUploader, Lightbox, SettingsPanel
└── wizard/    # Step components (StepUpload, StepFlowSelect, etc.)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useWizard.tsx` | Central state management (Context + Reducer) |
| `src/hooks/useGemini.ts` | Image generation orchestration |
| `src/services/geminiApi.ts` | Gemini API calls |
| `src/constants/concepts.ts` | 9 pre-defined creative concepts with prompts |
| `src/constants/prompts.ts` | Grid generation prompt template |
| `src/types/index.ts` | All TypeScript types |

## Key Types

```typescript
type FlowType = 'grid' | 'individual' | 'custom'
type WizardStep = 'upload' | 'flow' | 'configure' | 'results'
type AspectRatio = 'auto' | '1:1' | '3:4' | '4:3' | '16:9' | '9:16'
type Resolution = '1k' | '2k' | '4k'
type VariationCount = 1 | 2
```

## Design Reference

See `DESIGN.md` for the aesthetic philosophy - the UI follows a distinctive editorial style with soft pastel colors, avoiding generic AI-generated looks.

See `NANOBANANAPROMPTING.md` for comprehensive Gemini Nano Banana Pro prompting techniques.

## Deployment

Configured for Vercel with `vercel.json` for SPA routing. Build outputs to `dist/`.
