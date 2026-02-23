import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



export async function generateResponse(prompt) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
}