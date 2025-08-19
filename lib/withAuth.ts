import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { jwtVerify } from 'jose';

const verifyToken = async (req: NextApiRequest) => {
  const token = req.cookies.auth_token;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
};

export const withAuth = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!(await verifyToken(req))) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    return handler(req, res);
  };
};