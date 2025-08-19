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

    const existingSubscriber = await NewsletterSubscriber.findOne({ email: lowercasedEmail });
    if (existingSubscriber) {
      return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 409 });
    }

    // 3. Create new subscriber
    await NewsletterSubscriber.create({ email: lowercasedEmail });

    // 4. Send welcome email (fire-and-forget)
    sendWelcomeEmail(email);

    return NextResponse.json({ message: "You're subscribed! Thank you for joining our newsletter." }, { status: 201 });

  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}