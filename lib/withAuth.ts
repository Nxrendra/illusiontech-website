import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

const verifyToken = (req: NextApiRequest) => {
  const token = req.cookies.auth_token;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (e) {
    return null;
  }
};

export const withAuth = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!verifyToken(req)) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    return handler(req, res);
  };
};