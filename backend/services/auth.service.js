import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '7d';

// Create JWT token for a user
export function generateToken(user) {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

// Register a new user
export async function registerUser({ email, password }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('User already exists');
    const user = new User({ email, password });
    await user.save();
    const token = generateToken(user);
    return { user, token };
}

// Login an existing user
export async function loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const ok = await user.comparePassword(password);
    if (!ok) throw new Error('Invalid credentials');
    const token = generateToken(user);
    return { user, token };
}
