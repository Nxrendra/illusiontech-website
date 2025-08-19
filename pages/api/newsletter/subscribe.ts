import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { sendWelcomeEmail } from '@/lib/email';

// In a real app, you would save the email to a database or a service like Mailchimp.
// For this example, we'll just validate and send the email.

const subscribeSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const parsed = subscribeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { email } = parsed.data;

  try {
    // Here you would add logic to save the email to your database.
    // console.log(`Subscribing ${email} to the newsletter.`);

    await sendWelcomeEmail(email);
    return res.status(200).json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Subscription API Error:', error);
    return res.status(500).json({ success: false, message: 'Could not subscribe. Please try again later.' });
  }
}

