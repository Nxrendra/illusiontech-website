import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDB } from '@/lib/mongoose';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import { sendWelcomeEmail } from '@/lib/email';
import { verifyEmailDeliverability } from '@/lib/server-utils';

const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email } = parsed.data;
    const lowercasedEmail = email.toLowerCase();

    // 1. Verify Email Deliverability
    const emailValidationResult = await verifyEmailDeliverability(email);
    if (!emailValidationResult.success) {
      return NextResponse.json(
        { message: emailValidationResult.message },
        { status: emailValidationResult.status || 400 }
      );
    }

    // 2. Connect to DB and check for existing subscriber
    await connectToDB();
    console.log('Database connection established.');

    // Ensure the unique index on the email field is enforced before querying.
    // This is a robust way to prevent duplicates in serverless environments.
    await NewsletterSubscriber.syncIndexes();
    console.log('Indexes are synced.');

    const existingSubscriber = await NewsletterSubscriber.findOne({ email: lowercasedEmail }).lean();
    if (existingSubscriber) {
      console.log(`Email already exists in DB: ${lowercasedEmail}`);
      return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 409 });
    }

    // 3. Create new subscriber
    console.log('Attempting to create subscriber...');
    const subscriber = new NewsletterSubscriber({ email: lowercasedEmail });
    const newSubscriber = await subscriber.save();

    if (!newSubscriber) {
      // This is a critical check. If creation fails without an error, this will catch it.
      console.error('Database write failed: newSubscriber is null or undefined.');
      throw new Error('Failed to save subscriber to the database.');
    }
    console.log(`Subscriber created successfully with ID: ${newSubscriber._id}`);

    // 4. Send welcome email (fire-and-forget)
    sendWelcomeEmail(email).catch(err => {
      console.error(`Failed to send welcome email to ${lowercasedEmail}:`, err);
    });

    return NextResponse.json({ message: "You're subscribed! Thank you for joining our newsletter." }, { status: 201 });

  } catch (error) {
    // This specifically catches the database error for a unique constraint violation.
    // The 'code' property is a non-standard but common way to check for specific DB errors.
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 409 });
    }

    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}