import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Checks if the request has a valid admin session using your existing JWT_SECRET
export async function isAdminSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('auth_token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) {
    return false;
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}