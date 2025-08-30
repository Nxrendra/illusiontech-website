import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

interface AdminJWTPayload extends JWTPayload {
  userId: string;
  email: string;
}

/**
 * Verifies the admin's JWT from cookies on the server-side.
 * Throws an error if the session is invalid.
 * @returns {Promise<{ user: AdminJWTPayload }>} The decoded user payload from the token.
 * @throws {Error} If authentication fails.
 */
export async function verifyAdminSession(): Promise<{ user: AdminJWTPayload }> {
  const token = cookies().get('auth_token')?.value;

  if (!token || !JWT_SECRET) {
    throw new Error('Authentication required. No token or secret found.');
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify<AdminJWTPayload>(token, secretKey);
    if (!payload.userId) throw new Error('Invalid token payload.');
    return { user: payload };
  } catch (error) {
    throw new Error('Session invalid or expired. Please log in again.');
  }
}