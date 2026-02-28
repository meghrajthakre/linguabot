import express from "express";
import publicAuth from "../middleware/publicAuth.js";
import Conversation from "../models/Conversation.model.js";
import { generateResponse } from "../services/claude.service.js";

const router = express.Router();

router.post("/", publicAuth, async (req, res) => {
    try {
        const { message } = req.body;
        const bot = req.bot;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message required" });
        }

        let context = `
            Website Name: ${bot.name}
            Description: ${bot.description || ""}
            `;

        const aiResponse = await generateResponse(
            message,
            context,
            `
                You are AI assistant for "${bot.name}".
                Answer only from context.
                Max 3 short sentences.
                If answer not found say:
                "I will connect you with our support team."
                `
                        );

        await Conversation.create({
            botId: bot._id,
            userMessage: message,
            aiMessage: aiResponse,
        });

        res.json({ aiResponse });

    } catch (err) {
        console.error("Public AI error:", err);
        res.status(500).json({ message: "AI failed" });
    }
});

export default router;