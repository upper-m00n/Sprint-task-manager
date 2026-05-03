import { User } from '../models/User.js';
import { decodeToken } from '../utils/jwt.js';
import { getRoleNamesForUser } from '../utils/roles.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(403).json({ detail: 'Could not validate credentials' });
  }
  const token = header.slice(7);
  try {
    const payload = decodeToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }
    req.user = user;
    req.roleNames = await getRoleNamesForUser(user._id);
    next();
  } catch {
    return res.status(403).json({ detail: 'Could not validate credentials' });
  }
}

export async function requireAdmin(req, res, next) {
  if (!req.roleNames?.includes('admin')) {
    return res.status(403).json({ detail: 'Only system administrators can perform this action' });
  }
  next();
}
