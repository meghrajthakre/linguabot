import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"; 

import connectDB from './config/db.js';
import rateLimiter from './middleware/rateLimiter.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';

import publicRoutes from './routes/public.routes.js'
import authRoutes from './routes/auth.routes.js';
import botsRoutes from './routes/bots.routes.js';
import chatRoutes from './routes/chat.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// ========== CORS CONFIGURATION ==========
// Allow multiple origins for development
const allowedOrigins = [
  "http://localhost:5173",      // React Vite dev server
  "http://localhost:3000",      // Alternative frontend port
  "http://localhost:8000",      // Another common port
  "http://127.0.0.1:5173",      // IPv4 localhost Vite
  "http://127.0.0.1:5500",      // VS Code Live Server
  "http://127.0.0.1:8000",      // Alternative IPv4
  "http://127.0.0.1:15500",     // Another port
  "http://localhost:15500",     // Another common port
];

// For production, use environment variable
if (process.env.NODE_ENV === 'production') {
  // In production, use specific domain
  allowedOrigins.length = 0;
  allowedOrigins.push(process.env.FRONTEND_URL || "https://linguabot-xi.vercel.app");
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Middleware
app.use(express.json()); // parse JSON body
app.use(cookieParser());
// app.use(rateLimiter); // global rate limiter

// Register routes
app.use(express.static("public"));
app.use('/api/auth', authRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public/chat', publicRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 LinguaBot backend running on http://localhost:${PORT}`);
    console.log(`📝 Allowed origins:`, allowedOrigins);
});