
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

// 确保在每次调用前获取最新的实例（符合 API Key 选择逻辑）
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiChat = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8,
      topP: 0.95,
    },
  });
};

export const lookupDictionary = async (word: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Provide a detailed dictionary entry for the English word: "${word}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          phonetic: { type: Type.STRING },
          pos: { type: Type.STRING },
          definition_en: { type: Type.STRING },
          definition_zh: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
        },
        required: ["word", "phonetic", "pos", "definition_en", "definition_zh", "examples"],
      },
    },
  });
  
  const text = response.text;
  if (!text) throw new Error("Empty response from lexicon service");
  return JSON.parse(text);
};
