import { Router } from 'express';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit || '50', 10) || 50, 100);
    const filter = {};
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { email: re }];
    }
    const users = await User.find(filter).sort({ name: 1 }).limit(limit).lean();
    return res.json(
      users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
      }))
    );
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

export default router;
