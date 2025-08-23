import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectToDB } from '@/lib/mongoose';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import { sendBroadcastEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  // 1. Authenticate the admin user
  const token = cookies().get('auth_token')?.value;
  if (!token || !JWT_SECRET) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);
  } catch (error) {
    return NextResponse.json({ error: 'Session invalid or expired.' }, { status: 401 });
  }

  // 2. Get email content from the request body
  const { subject, htmlBody, textBody } = await request.json();
  if (!subject || !htmlBody || !textBody) {
    return NextResponse.json({ error: 'Subject and email body are required.' }, { status: 400 });
  }

  try {
    // 3. Fetch all subscriber emails from the database
    await connectToDB();
    const subscribers = await NewsletterSubscriber.find({}).select('email').lean();
    
    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'There are no subscribers to send an email to.' });
    }

    const recipientEmails = subscribers.map(s => s.email);

    // 4. Send the broadcast email using the new function
    await sendBroadcastEmail({
      recipientEmails,
      subject,
      html: htmlBody,
      text: textBody
    });

    return NextResponse.json({ success: true, message: `Broadcast sent to ${recipientEmails.length} subscribers.` });

  } catch (error) {
    console.error('Broadcast email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Failed to send broadcast: ${errorMessage}` }, { status: 500 });
  }
}