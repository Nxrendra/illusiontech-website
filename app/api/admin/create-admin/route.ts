import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function GET() {
  // This is a security measure to ensure this endpoint is not run in production more than once.
  // It's best to delete this file after its first successful run.
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_ADMIN_CREATION) {
    return NextResponse.json(
      { message: 'Admin creation is disabled.' },
      { status: 403 }
    );
  }

  const { INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD } = process.env;

  if (!INITIAL_ADMIN_EMAIL || !INITIAL_ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: 'Initial admin credentials are not set in environment variables.' },
      { status: 500 }
    );
  }

  try {
    await connectToDB();

    const existingUser = await User.findOne({ email: INITIAL_ADMIN_EMAIL });
    if (existingUser) {
      // In production, we prevent any changes to an existing user.
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: 'Admin user already exists.' }, { status: 409 /* Conflict */ });
      }

      // In development, it's helpful to be able to reset the password.
      existingUser.password = INITIAL_ADMIN_PASSWORD;
      await existingUser.save();
      return NextResponse.json({ message: 'Admin user password has been reset successfully.' });
    }

    await User.create({
      email: INITIAL_ADMIN_EMAIL,
      password: INITIAL_ADMIN_PASSWORD,
      firstName: 'Admin', // Default value
      lastName: 'User',   // Default value
    });

    return NextResponse.json({ message: 'Admin user created successfully.' });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the admin user.' },
      { status: 500 }
    );
  }
}

