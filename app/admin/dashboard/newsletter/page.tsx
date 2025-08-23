import { cookies } from 'next/headers';
import { connectToDB } from '@/lib/mongoose';
import { jwtVerify } from 'jose';
import NewsletterSubscriber, { INewsletterSubscriber } from '@/lib/models/NewsletterSubscriber';
import NewsletterManager from '@/components/admin/NewsletterManager';

const JWT_SECRET = process.env.JWT_SECRET;

// Type for serialized subscriber data, where ObjectId and Date are strings.
type SerializedSubscriber = Omit<INewsletterSubscriber, 'subscribed_at' | '_id'> & {
  _id: string;
  subscribed_at: string;
};

async function getSubscribers(): Promise<{ subscribers?: SerializedSubscriber[]; error?: string }> {
  const token = cookies().get('auth_token')?.value;
  if (!token || !JWT_SECRET) {
    return { error: 'Authentication required.' };
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);

    await connectToDB();
    const subscribersData = await NewsletterSubscriber.find({}).sort({ subscribed_at: -1 }).lean();
    
    return { subscribers: JSON.parse(JSON.stringify(subscribersData)) };
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return { error: 'Session invalid. Please log in again.' };
  }
}

export default async function NewsletterPage() {
  const { subscribers, error } = await getSubscribers();

  if (error) {
    return <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert"><p className="font-bold">Access Denied</p><p>{error}</p></div>;
  }

  return <NewsletterManager initialSubscribers={subscribers || []} />;
}
