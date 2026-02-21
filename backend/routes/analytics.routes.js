import express from 'express';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/auth.middleware.js';
import Conversation from '../models/Conversation.model.js';
import Bot from '../models/Bot.model.js';

const router = express.Router();

// Protected analytics endpoints
router.use(authMiddleware);

// Total conversations per bot
router.get('/bots/:botId/summary', async (req, res, next) => {
  try {
    const { botId } = req.params;
    const totalConversations = await Conversation.countDocuments({ botId });
    const totalMessages = await Conversation.countDocuments({ botId, userMessage: { $exists: true } });
    const avgResponse = await Conversation.aggregate([
      { $match: { botId: new mongoose.Types.ObjectId(botId) } },
      { $group: { _id: null, avgMs: { $avg: '$responseTimeMs' } } },
    ]);
    res.json({ botId, totalConversations, totalMessages, avgResponseMs: avgResponse[0]?.avgMs || 0 });
  } catch (err) {
    next(err);
  }
});

// Daily chat count for a bot (last 30 days)
router.get('/bots/:botId/daily', async (req, res, next) => {
  try {
    const { botId } = req.params;
    const pipeline = [
      { $match: { botId: new mongoose.Types.ObjectId(botId) } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];
    const daily = await Conversation.aggregate(pipeline);
    res.json(daily);
  } catch (err) {
    next(err);
  }
});

// Total messages across all bots for the user
router.get('/users/me/overview', async (req, res, next) => {
  try {
    // Find bots for this user
    const bots = await Bot.find({ owner: req.user.id }).select('_id name');
    const botIds = bots.map((b) => b._id);
    const totalConversations = await Conversation.countDocuments({ botId: { $in: botIds } });
    res.json({ botCount: bots.length, totalConversations });
  } catch (err) {
    next(err);
  }
});

export default router;
