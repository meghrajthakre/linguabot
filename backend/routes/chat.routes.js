import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import Bot from '../models/Bot.model.js';
import Conversation from '../models/Conversation.model.js';
import { generateResponse } from '../services/claude.service.js';
import { translate } from '../services/lingo.service.js';

const router = express.Router();

// POST /api/chat/:botId - send user message to the bot and store conversation
router.post('/:botId', authMiddleware, async (req, res, next) => {
    try {
        const { botId } = req.params;
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        // Fetch bot configuration and training data
        const bot = await Bot.findById(botId);
        if (!bot) return res.status(404).json({ message: 'Bot not found' });

        // Optionally translate incoming message to bot language
        const incoming = await translate(message, bot.language || 'en');

        // Build context using bot training data and recent messages (simple approach)
        const context = `Bot: ${bot.name}\nTraining Data:\n${bot.trainingData || ''}`;

        const start = Date.now();
        const aiResponse = await generateResponse(incoming, context);
        const responseTimeMs = Date.now() - start;

        // Store conversation
        const conv = new Conversation({ botId: bot._id, userMessage: message, aiMessage: aiResponse, responseTimeMs });
        await conv.save();

        res.json({ botId: bot._id, aiResponse, responseTimeMs });
    } catch (err) {
        next(err);
    }
});

export default router;
