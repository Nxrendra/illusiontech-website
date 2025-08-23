import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import { sendBroadcastEmail } from '@/lib/email';
import { verifyAdminSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    // 1. Authenticate the admin user using the centralized helper
    await verifyAdminSession();

    // 2. Get email content from the request body
    const { subject, htmlBody, textBody } = await request.json();
    if (!subject || !htmlBody || !textBody) {
      return NextResponse.json({ error: 'Subject and email body are required.' }, { status: 400 });
    }

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
    let errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    // Provide a more specific error message for authentication failures
    if (errorMessage.includes('Authentication') || errorMessage.includes('Session invalid')) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json({ error: `Failed to send broadcast: ${errorMessage}` }, { status: 500 });
  }
}