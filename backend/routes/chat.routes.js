import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import Bot from '../models/Bot.model.js';
import Conversation from '../models/Conversation.model.js';
import { generateResponse } from '../services/claude.service.js';
import { translate } from '../services/lingo.service.js';
import WebsiteData from "../models/websiteSchema.model.js";
const router = express.Router();

router.post('/:botId', authMiddleware, async (req, res) => {
    try {
        const { botId } = req.params;
        let { message } = req.body;


        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        if (message.length > 2000) {
            return res.status(400).json({ message: "Message too long" });
        }

        message = message.trim();

        const bot = await Bot.findById(botId);
        if (!bot) {
            return res.status(404).json({ message: "Bot not found" });
        }

        // ================================
        // 👋 GREETING SHORTCUT
        // ================================

        const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
        if (greetings.includes(message.toLowerCase())) {
            return res.json({
                botId: bot._id,
                aiResponse: `Hello! How can I help you regarding ${bot.name}?`,
                responseTimeMs: 0
            });
        }

        // ================================
        // 🌍 TRANSLATE TO BOT LANGUAGE
        // ================================

        const incoming = await translate(message, bot.language || "en");

        // ================================
        // 🧠 INTENT DETECTION
        // ================================

        const lowerMsg = incoming.toLowerCase();

        const isPricing = lowerMsg.includes("price") || lowerMsg.includes("plan");
        const isFAQ = lowerMsg.includes("how") || lowerMsg.includes("what") || lowerMsg.includes("why");
        const isDocs = lowerMsg.includes("documentation") || lowerMsg.includes("api");

        // ================================
        // 📦 SMART CONTEXT SELECTION (Mini RAG)
        // ================================

        let selectedContext = `
Website Name: ${bot.name}
Description: ${bot.description || "Not provided"}
`;

        if (isFAQ && bot.faqs?.length > 0) {
            selectedContext += `
FAQs:
${bot.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}
`;
        }

        if (isPricing && bot.pricing?.length > 0) {
            selectedContext += `
Pricing:
${bot.pricing.map(p =>
                `${p.plan} - ${p.price} - ${(p.features || []).join(", ")}`
            ).join("\n\n")}
`;
        }

        if (isDocs && bot.docs) {
            selectedContext += `
                Documentation:
                ${bot.docs}
                `;
        }

        // If no section matched → send full compressed context
        if (!isFAQ && !isPricing && !isDocs) {
            selectedContext += `
            FAQs:
            ${bot.faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n") || "None"}

            Pricing:
            ${bot.pricing?.map(p =>
                            `${p.plan} - ${p.price}`
                        ).join("\n") || "None"}

            Documentation:
            ${bot.docs || "None"}
            `;
        }

        // ================================
        // 🧾 SYSTEM PROMPT
        // ================================

        const systemPrompt = `
            You are LinguaBot, an AI assistant for "${bot.name}".

            Rules:
            - Answer ONLY from provided website information.
            - Keep responses short (max 3 sentences).
            - Be professional and friendly.
            - If answer is not found, say exactly:
            "I will connect you with our support team."
            - Never guess.
            - Never hallucinate.
            `;

        // ================================
        // 🤖 AI CALL
        // ================================

        const start = Date.now();

        const aiResponse = await generateResponse(
            incoming,
            selectedContext,
            systemPrompt,
            { temperature: 0.2 }
        );

        const responseTimeMs = Date.now() - start;

        // ================================
        // 💾 SAVE CONVERSATION
        // ================================

        await Conversation.create({
            botId: bot._id,
            userMessage: message,
            aiMessage: aiResponse,
            responseTimeMs,
        });

        // ================================
        // 🌍 TRANSLATE BACK IF NEEDED
        // ================================

        const finalResponse =
            bot.language && bot.language !== "en"
                ? await translate(aiResponse, bot.language)
                : aiResponse;

        res.json({
            botId: bot._id,
            aiResponse: finalResponse,
            responseTimeMs,
        });

    } catch (err) {
        console.error("AI ERROR:", err.message);
        res.status(500).json({ message: "AI response failed" });
    }
});

// train bot with new data
router.post("/train", authMiddleware, async (req, res) => {
    try {
        const data = await WebsiteData.create(req.body);
        res.status(201).json({
            success: true,
            message: "Bot trained successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
