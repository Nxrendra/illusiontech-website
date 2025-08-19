import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextApiRequest, NextApiResponse } from 'next';

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 1 minute by IP
});

export const applyRateLimit = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    await rateLimiter.consume(ip as string);
    return true;
  } catch (rateLimiterRes) {
    res.status(429).json({ message: 'Too Many Requests. Please try again in a minute.' });
    return false;
  }
};
