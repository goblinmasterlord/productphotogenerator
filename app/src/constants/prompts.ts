export const GRID_PROMPT = `Create a 3×3 grid in 3:4 aspect ratio for a high-end commercial marketing campaign using the uploaded product as the central subject.

Each frame must present a distinct visual concept while maintaining perfect product consistency across all nine images.

Grid Concepts (one per cell):

1. Iconic hero still life with bold composition

2. Extreme macro detail highlighting material, surface, or texture

3. Dynamic liquid or particle interaction surrounding the product

4. Minimal sculptural arrangement with abstract forms

5. Floating elements composition suggesting lightness and innovation

6. Sensory close-up emphasizing tactility and realism

7. Color-driven conceptual scene inspired by the product palette

8. Ingredient or component abstraction (non-literal, symbolic)

9. Surreal yet elegant fusion scene combining realism and imagination

Visual Rules:
Product must remain 100% accurate in shape, proportions, label, typography, color, and branding
No distortion, deformation, or redesign of the product
Clean separation between product and background

Lighting & Style:
Soft, controlled studio lighting
Subtle highlights, realistic shadows
High dynamic range, ultra-sharp focus
Editorial luxury advertising aesthetic
Premium sensory marketing look

Overall Feel:
Modern, refined, visually cohesive
High-end commercial campaign
Designed for brand websites, social grids, and digital billboards
Hyperreal, cinematic, polished, and aspirational`;

export const INDIVIDUAL_PROMPT_TEMPLATE = `Create a single high-end commercial marketing image using the uploaded product as the central subject.

Concept: {CONCEPT_PROMPT}

Visual Rules:
Product must remain 100% accurate in shape, proportions, label, typography, color, and branding
No distortion, deformation, or redesign of the product
Clean separation between product and background

Lighting & Style:
Soft, controlled studio lighting
Subtle highlights, realistic shadows
High dynamic range, ultra-sharp focus
Editorial luxury advertising aesthetic
Premium sensory marketing look

Overall Feel:
Modern, refined, visually cohesive
High-end commercial campaign
Designed for brand websites, social grids, and digital billboards
Hyperreal, cinematic, polished, and aspirational`;

export const PROMPT_OPTIMIZER_SYSTEM = `You are an expert prompt engineer specializing in AI image generation. Your task is to optimize user prompts following these golden rules:

1. USE NATURAL LANGUAGE & FULL SENTENCES
Talk as if briefing a human artist. Use proper grammar and descriptive adjectives.
- Bad: "Cool car, neon, city, night, 8k"
- Good: "A cinematic wide shot of a futuristic sports car speeding through a rainy Tokyo street at night. The neon signs reflect off the wet pavement and the car's metallic chassis."

2. BE SPECIFIC AND DESCRIPTIVE
Define the subject, setting, lighting, and mood.
- Subject: Instead of "a woman," say "a sophisticated elderly woman wearing a vintage chanel-style suit"
- Materiality: Describe textures like "matte finish," "brushed steel," "soft velvet," "crumpled paper"

3. PROVIDE CONTEXT (THE "WHY" OR "FOR WHOM")
Giving context helps the model make logical artistic decisions.
- Example: "Create an image of a sandwich for a Brazilian high-end gourmet cookbook"
- The model will infer professional plating, shallow depth of field, and perfect lighting

4. FOCUS ON PROFESSIONAL ASSET PRODUCTION
This model excels at:
- Text rendering
- Character consistency
- Visual synthesis
- High-resolution (4K) output

Take the user's prompt and rewrite it following these rules. Keep the core intent but make it more descriptive, specific, and professional. Output ONLY the optimized prompt, nothing else.`;
