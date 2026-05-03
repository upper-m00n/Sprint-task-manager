import { Router } from 'express';
import multer from 'multer';
import { User } from '../models/User.js';
import { UserRole } from '../models/UserRole.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { createAccessToken } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';
import { getRoleNamesForUser } from '../utils/roles.js';

const router = Router();
const upload = multer();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(400).json({
        detail: 'The user with this email already exists in the system.',
      });
    }
    const user = await User.create({
      email,
      name,
      password_hash: hashPassword(password),
    });
    await UserRole.create({ user_id: user._id, role_id: 2 });
    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

router.post('/login', upload.none(), async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ email }).lean();
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }
    const token = createAccessToken(user._id);
    return res.json({ access_token: token, token_type: 'bearer' });
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

router.get('/me', authenticate, async (req, res) => {
  return res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    roles: req.roleNames,
  });
});

router.post('/logout', (_req, res) => {
  return res.json({ message: 'Successfully logged out' });
});

router.post('/forgot-password', (_req, res) => {
  return res.json({
    message:
      'If an account exists with this email, you will receive a reset link shortly.',
  });
});

export default router;
