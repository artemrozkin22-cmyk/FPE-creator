
import { GoogleGenAI } from "@google/genai";

const STYLE_PROMPT = `
Style: Fundamental Paper Education (FPE), Katieee art style.
Visual Rules:
- 2D Flat Paper aesthetic, angular and sharp linework.
- Dominant Black and White high-contrast palette.
- Detached floating head (head is NOT connected to the neck/collar).
- Extremely long, thin, stylized legs (up to 2-3 meters proportional scale).
- Sharp, claw-like or angular fingers, often black.
- Simplified facial features with expressive, often single or unique eyes.
- Character should be full-body, standing.
- Background: Minimalist white or light grey sketch paper texture.
- Accents: Small splashes of color are allowed only if specified (e.g., eye color or specific clothing part).
`;

export async function generateFPECharacter(
  description: string,
  pose: string,
  emotion: string
): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const fullPrompt = `
Generate a full-body character art based on this description: ${description}.
Pose: ${pose}.
Emotion/Expression: ${emotion}.
${STYLE_PROMPT}
Ensure the character looks like they belong in the Fundamental Paper Education universe.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating FPE character:", error);
    throw error;
  }
}
