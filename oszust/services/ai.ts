import { GoogleGenAI, Type } from "@google/genai";
import { GameData } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGameData = async (category: string): Promise<GameData> => {
  try {
    const prompt = `Generate a single secret word in Polish (noun), verify it fits the category '${category}', and a subtle, cryptic hint in Polish that describes the object but doesn't give it away completely. This is for a game where an imposter receives the hint and everyone else receives the word.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            secretWord: {
              type: Type.STRING,
              description: "The secret object in Polish.",
            },
            category: {
              type: Type.STRING,
              description: "The category name in Polish.",
            },
            imposterHint: {
              type: Type.STRING,
              description: "A helpful but vague hint in Polish for the imposter.",
            },
          },
          required: ["secretWord", "category", "imposterHint"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GameData;
    }
    throw new Error("No text returned from AI");
  } catch (error) {
    console.error("Error generating game data:", error);
    // Fallback data in case of API failure (Polish)
    return {
      secretWord: "Ekspres do kawy",
      category: "Sprzęt domowy",
      imposterHint: "Robi gorący, ciemny napój energetyczny."
    };
  }
};