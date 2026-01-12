import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid user' });
    if (user.workspaceId.toString() !== payload.workspaceId) {
      return res.status(401).json({ error: 'Workspace mismatch' });
    }

    req.user = {
      id: user._id.toString(),
      workspaceId: user.workspaceId.toString(),
      role: user.role,
      email: user.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireRole(allowedRoles = []) {
  return function roleCheck(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }
  return null;
}

