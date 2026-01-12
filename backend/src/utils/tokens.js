import jwt from 'jsonwebtoken';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      workspaceId: user.workspaceId.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: ACCESS_TTL }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      workspaceId: user.workspaceId.toString(),
      role: user.role,
      type: 'refresh',
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: REFRESH_TTL }
  );
}

export function verifyToken(token, opts = { refresh: false }) {
  const secret = opts.refresh
    ? process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-secret'
    : process.env.JWT_SECRET || 'dev-secret';
  return jwt.verify(token, secret);
}

