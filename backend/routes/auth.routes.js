import express from 'express';
import { registerUser, loginUser } from '../services/auth.service.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!validateEmail(email) || !validatePassword(password)) {
            return res.status(400).json({ message: 'Invalid email or password format' });
        }
        const result = await registerUser({ email, password });
        res.status(201).json({ user: { id: result.user._id, email: result.user.email }, token: result.token });
    } catch (err) {
        next(err);
    }
});

// Login route
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser({ email, password });

        // 🍪 Set JWT in HttpOnly cookie
        res.cookie("token", result.token, {
            httpOnly: true,        // JS access nahi kar sakta
            secure: false,         // true in production (https)
            sameSite: "lax",       // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            user: {
                id: result.user._id,
                email: result.user.email
            }
        });

    } catch (err) {
        next(err);
    }
});

export default router;
