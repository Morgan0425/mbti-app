import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { MBTIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// 持久化缓存：尝试从 localStorage 加载，如果失败则使用内存 Map
const CACHE_KEY = "mbti_reactions_cache";
const getInitialCache = (): Map<string, MBTIResponse[]> => {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      return new Map(JSON.parse(saved));
    }
  } catch (e) {
    console.warn("Failed to load cache from localStorage", e);
  }
  return new Map();
};

const responseCache = getInitialCache();

const saveCache = () => {
  try {
    const data = Array.from(responseCache.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to save cache to localStorage", e);
  }
};

export async function getMBTIReactions(input: string): Promise<MBTIResponse[]> {
  const normalizedInput = input.trim().toLowerCase();
  
  if (responseCache.has(normalizedInput)) {
    return responseCache.get(normalizedInput)!;
  }

  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `针对事件“${input}”，给出16种MBTI人格的典型反应。要求语气极具人格特色，幽默犀利。`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            name: { type: Type.STRING },
            reaction: { type: Type.STRING },
            view: { type: Type.STRING },
          },
          required: ["type", "name", "reaction", "view"],
        },
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "[]");
    if (data.length > 0) {
      responseCache.set(normalizedInput, data);
      saveCache(); // 持久化
    }
    return data;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
