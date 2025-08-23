import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifies the admin's JWT from cookies on the server-side.
 * Throws an error if the session is invalid.
 * @returns {Promise<void>}
 * @throws {Error} If authentication fails.
 */
export async function verifyAdminSession(): Promise<void> {
  const token = cookies().get('auth_token')?.value;

  if (!token || !JWT_SECRET) {
    throw new Error('Authentication required. No token or secret found.');
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);
  } catch (error) {
    throw new Error('Session invalid or expired. Please log in again.');
  }
}