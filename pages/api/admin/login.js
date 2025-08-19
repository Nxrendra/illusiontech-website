import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';
import { applyRateLimit } from '../../../lib/rate-limiter';

const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET, RECAPTCHA_SECRET_KEY } = process.env;

// Fail-fast if essential environment variables are missing
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET || !RECAPTCHA_SECRET_KEY) {
  throw new Error('One or more critical environment variables for authentication are missing.');
}

// Decode the password hash from Base64 to prevent .env parsing issues
let decodedAdminPassword;
try {
  decodedAdminPassword = Buffer.from(ADMIN_PASSWORD, 'base64').toString('ascii');
} catch (e) {
  throw new Error('ADMIN_PASSWORD in .env.local is not a valid Base64 string. Please re-run the hash-password script.');
}

async function validateCaptcha(token) {
  const secret = RECAPTCHA_SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    { method: 'POST' }
  );
  const data = await response.json();
  return data.success;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ message: 'Too many requests.' });
  }
  
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const { email, password, token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'reCAPTCHA token is missing.' });
    }

    const isHuman = await validateCaptcha(token);

    if (!isHuman) {
      return res.status(400).json({ message: 'reCAPTCHA validation failed.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, decodedAdminPassword);

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && isPasswordCorrect) {
      const authToken = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: '30m', // Session expires in 30 minutes
      });

      const cookie = serialize('auth_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 30, // 30 minutes
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);
      console.log(`Login successful for ${email}. IP: ${ip}, Timestamp: ${new Date().toISOString()}`);
      return res.status(200).json({ success: true });
    }

    console.log(`Login failed: Invalid credentials for ${email}. IP: ${ip}, Timestamp: ${new Date().toISOString()}`);
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }
}
