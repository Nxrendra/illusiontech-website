import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY);
    
    await connectToDB();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      env: {
        mongodb: !!process.env.MONGODB_URI,
        google: !!process.env.GOOGLE_API_KEY,
        recaptcha: !!process.env.RECAPTCHA_SECRET_KEY
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        mongodb: !!process.env.MONGODB_URI,
        google: !!process.env.GOOGLE_API_KEY,
        recaptcha: !!process.env.RECAPTCHA_SECRET_KEY
      }
    }, { status: 500 });
  }
}
