import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import Bot from '../models/Bot.model.js';
import Conversation from '../models/Conversation.model.js';
import { generateResponse } from '../services/claude.service.js';
import { translate } from '../services/lingo.service.js';
import WebsiteData from "../models/websiteSchema.model.js";
const router = express.Router();

// POST /api/chat/:botId - send user message to the bot and store conversation
router.post('/:botId', authMiddleware, async (req, res, next) => {
    try {
        const { botId } = req.params;
        const { message } = req.body;
        console.log(`Received message for bot ${botId}:`, message);

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const bot = await Bot.findById(botId);
        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' });
        }

        // 🌍 Translate to bot language if needed
        const incoming = await translate(message, bot.language || 'en');

        // 🔥 Build Structured Website Context
        const websiteContext = `
            Website Name: ${bot.name}
            Description: ${bot.description || ''}

            FAQs:
            ${(bot.faqs || [])
                .map(f => `Q: ${f.question}\nA: ${f.answer}`)
                .join('\n')}

            Pricing:
            ${(bot.pricing || [])
                .map(p => `${p.plan} - ${p.price} - ${p.features?.join(', ')}`)
                .join('\n')}

            Documentation:
            ${bot.docs || ''}
            `;

        const systemPrompt = `
        You are LinguaBot, a professional AI assistant for the website "${bot.name}".

        Rules:
        - Give short responses (max 2-3 sentences).
        - Be friendly and professional.
        - Use only the provided website context.
        - If answer is not found in context, say:
        "I will connect you with our support team."
        - Do not hallucinate.
        - Do not give long explanations.
        `;

        const start = Date.now();

        const aiResponse = await generateResponse(
            incoming,
            websiteContext,
            systemPrompt
        );

        const responseTimeMs = Date.now() - start;

        await Conversation.create({
            botId: bot._id,
            userMessage: message,
            aiMessage: aiResponse,
            responseTimeMs,
        });

        res.json({
            botId: bot._id,
            aiResponse,
            responseTimeMs,
        });

    } catch (err) {
        console.error("AI ERROR:", err.response?.data || err.message || err);
        throw new Error("AI response failed");
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
