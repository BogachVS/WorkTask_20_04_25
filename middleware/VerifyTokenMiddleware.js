import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const jwtSecret = process.env.JWT_SECRET;

export default async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'NO_TOKEN' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
    }
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'TOKEN_EXPIRED_OR_INVALID' });
  }
}
