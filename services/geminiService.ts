import { GoogleGenAI, Type } from "@google/genai";
import { Rarity, Pet } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

export const generateChatMessages = async (context: string): Promise<{ user: string; text: string }[]> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate 3 short, realistic chat messages you would see in a Roblox Simulator game. 
      The current context of the game server is: ${context}.
      Include a mix of:
      1. Trading requests (e.g., "Trading Frost Dragon", "ABC for Ice King")
      2. Noobs asking how to play or where the winter egg is
      3. Flexing/Bragging about pets (mention Mutated or Shiny if luck is high)
      4. Reactions to current active events (e.g. "OMG BOSS SPAWNED", "HALLOWEEN IS HERE")
      
      Output ONLY a JSON array of objects with 'user' and 'text' properties. 
      Usernames should look like Roblox usernames.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              user: { type: Type.STRING },
              text: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to generate chat:", error);
    return [
      { user: "System", text: "Chat server reconnecting..." }
    ];
  }
};

export const generatePet = async (
    eggTier: 'Basic' | 'Golden' | 'Diamond' | 'Winter', 
    luckMultiplier: number = 1
): Promise<Omit<Pet, 'id'>> => {
  try {
    let tierPrompt = "";
    switch (eggTier) {
      case 'Basic': tierPrompt = "Basic eggs give Common/Uncommon pets."; break;
      case 'Golden': tierPrompt = "Golden eggs give Rare/Epic pets."; break;
      case 'Diamond': tierPrompt = "Diamond eggs give Legendary/Mythical pets."; break;
      case 'Winter': tierPrompt = "Winter eggs give Ice, Snow, Holiday, or Frozen themed pets. High chance for Legendaries."; break;
    }

    const luckPrompt = luckMultiplier > 1 
        ? `The player has ${luckMultiplier.toFixed(1)}x LUCK active! DRAMATICALLY INCREASE the chance of Legendary and Mythical pets. Ignore normal tier restrictions if luck is high. If luck is > 20, consider adding prefixes like 'Mutated', 'Shiny', 'Radioactive', or 'Ghost' to the name.` 
        : "";

    const prompt = `Generate a unique, creative pet for a Roblox Simulator game. 
    The egg tier is ${eggTier}. 
    ${tierPrompt}
    ${luckPrompt}
    
    Return a JSON object with:
    - name: Creative name (e.g., "Neon Dragon", "Glitch Cat", "Frost Wolf", "Santa Dog")
    - rarity: One of [Common, Uncommon, Rare, Epic, Legendary, Mythical] based on tier and luck.
    - multiplier: A number between 1.2 and 50.0 based on rarity.
    - emoji: A single emoji representing the pet.
    - description: A funny or cool 1-sentence description.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            rarity: { type: Type.STRING, enum: Object.values(Rarity) },
            multiplier: { type: Type.NUMBER },
            emoji: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Omit<Pet, 'id'>;
  } catch (error) {
    console.error("Failed to generate pet:", error);
    // Fallback pet
    return {
      name: "Glitch Dog",
      rarity: Rarity.COMMON,
      multiplier: 1.1,
      emoji: "🐶",
      description: "The AI failed to load this pet, so here is a dog."
    };
  }
};