import express from "express";
import { registerUser, loginUser } from "../services/auth.service.js";

const router = express.Router();

/* ===============================
   REGISTER
================================ */
router.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await registerUser({ email, password });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
});

/* ===============================
   LOGIN
================================ */
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await loginUser({ email, password });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
});

/* ===============================
   LOGOUT
================================ */
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;