import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Bot from "../models/Bot.model.js";

const router = express.Router();

/* ===============================
   CREATE BOT
================================ */
router.post("/", authMiddleware, async (req, res, next) => {
    try {
        const { name, description, trainingData, language } = req.body;

        if (!name || !language) {
            return res.status(400).json({ message: "Name and language are required" });
        }

        const bot = await Bot.create({
            name,
            description,
            trainingData,
            language,
            owner: req.user.id,
        });

        res.status(201).json(bot);
    } catch (err) {
        next(err);
    }
});

/* ===============================
   GET ALL USER BOTS
================================ */
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const bots = await Bot.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(bots);
    } catch (err) {
        next(err);
    }
});

/* ===============================
   UPDATE BOT
================================ */
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const bot = await Bot.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            req.body,
            { new: true }
        );

        if (!bot) {
            return res.status(404).json({ message: "Bot not found" });
        }

        res.json(bot);
    } catch (err) {
        next(err);
    }
});

/* ===============================
   DELETE BOT
================================ */
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const bot = await Bot.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id,
        });

        if (!bot) {
            return res.status(404).json({ message: "Bot not found" });
        }

        res.json({ message: "Bot deleted successfully" });
    } catch (err) {
        next(err);
    }
});

export default router;