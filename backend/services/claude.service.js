import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateResponse(
  userMessage,
  websiteContext,
  systemPrompt
) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });

    const result = await model.generateContent([
      { text: websiteContext },
      { text: `User Question: ${userMessage}` }
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI response failed");
  }
}