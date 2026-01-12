import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/tokens.js';
import { redis } from '../clients/redisClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const REFRESH_PREFIX = 'refresh:';

router.post('/signup', async (req, res) => {
  try {
    const { email, password, workspaceName } = req.body;
    if (!email || !password || !workspaceName) {
      return res.status(400).json({ error: 'email, password, workspaceName required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const workspace = await Workspace.create({
      name: workspaceName,
      ownerId: null,
    });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      role: 'owner',
      workspaceId: workspace._id,
    });

    workspace.ownerId = user._id;
    await workspace.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await storeRefreshToken(user._id, refreshToken);

    res.json({
      user: { id: user._id, email: user.email, role: user.role, workspaceId: user.workspaceId },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await storeRefreshToken(user._id, refreshToken);

    res.json({
      user: { id: user._id, email: user.email, role: user.role, workspaceId: user.workspaceId },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await revokeRefreshToken(req.user.id, refreshToken);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/token/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    const payload = verifyToken(refreshToken, { refresh: true });
    const stored = await redis.get(refreshKey(payload.sub, refreshToken));
    if (!stored) return res.status(401).json({ error: 'Invalid refresh' });

    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid user' });

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    await storeRefreshToken(user._id, newRefresh);
    await revokeRefreshToken(user._id, refreshToken);

    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Could not refresh' });
  }
});

function refreshKey(userId, token) {
  return `${REFRESH_PREFIX}${userId}:${token}`;
}

async function storeRefreshToken(userId, token) {
  const payload = verifyToken(token, { refresh: true });
  const ttlSeconds = Math.floor(payload.exp - Date.now() / 1000);
  await redis.set(refreshKey(userId, token), '1', { EX: ttlSeconds });
}

async function revokeRefreshToken(userId, token) {
  await redis.del(refreshKey(userId, token));
}

export default router;

