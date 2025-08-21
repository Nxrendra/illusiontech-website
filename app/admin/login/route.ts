import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { connectToDB } from '@/lib/mongoose';
 import User from '@/lib/models/User';
import { verifyRecaptcha } from '@/lib/server-utils';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment variables.');
}

const key = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email, password, token: recaptchaToken } = await request.json();

    if (!email || !password || !recaptchaToken) {
      return NextResponse.json(
        { message: 'Email, password, and reCAPTCHA token are required.' },
        { status: 400 }
      );
    }
    // 1. Verify the reCAPTCHA token first to prevent unnecessary DB queries
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json({ message: recaptchaResult.message }, { status: 400 });
    }

    // 2. If reCAPTCHA is valid, proceed with user authentication

    await connectToDB();

    // Find the user by email. Assuming your User model has a 'password' field.
    const user = await User.findOne({ email }).select('+password').lean();

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 }
      );
    }
 // Create a JWT token
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Token expires in 1 hour
      .sign(key);
     

    // Set the token in an HTTP-Only cookie for security
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
