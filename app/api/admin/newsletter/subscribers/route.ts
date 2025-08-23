import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose'; // Corrected from dbConnect for consistency
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import { z } from 'zod';

const addSubscriberSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();
    const validation = addSubscriberSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
    }

    const { email } = validation.data;

    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 });
    }

    const newSubscriber = await NewsletterSubscriber.create({ email });

    // Construct a new, clean payload object for the response.
    // This avoids issues with Mongoose's complex return types.
    // We use `any` as a type assertion because TS struggles to infer the
    // types on the Mongoose Document, but we know they exist at runtime.
    const responsePayload = {
      email: newSubscriber.email,
      _id: (newSubscriber as any)._id.toString(),
      subscribed_at: (newSubscriber as any).subscribed_at.toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
