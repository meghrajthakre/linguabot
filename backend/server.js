import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser"; 

import connectDB from './config/db.js';
import rateLimiter from './middleware/rateLimiter.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';

import authRoutes from './routes/auth.routes.js';
import botsRoutes from './routes/bots.routes.js';
import chatRoutes from './routes/chat.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Middleware
app.use(express.json()); // parse JSON body
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL (React Vite)
  credentials: true
}));
app.use(rateLimiter); // global rate limiter
// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`LinguaBot backend running on port ${PORT}`);
});
