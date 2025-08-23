import { connectToDB } from '@/lib/mongoose';
import NewsletterSubscriber, { INewsletterSubscriber } from '@/lib/models/NewsletterSubscriber';
import NewsletterManager from '@/components/admin/NewsletterManager';
import { verifyAdminSession } from '@/lib/auth-utils';

// Type for serialized subscriber data, where ObjectId and Date are strings.
type SerializedSubscriber = Omit<INewsletterSubscriber, 'subscribed_at' | '_id'> & {
  _id: string;
  subscribed_at: string;
};

async function getSubscribers(): Promise<{ subscribers?: SerializedSubscriber[]; error?: string }> {
  try {
    await verifyAdminSession();

    await connectToDB();
    const subscribersData = await NewsletterSubscriber.find({}).sort({ subscribed_at: -1 }).lean();
    
    return { subscribers: JSON.parse(JSON.stringify(subscribersData)) };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error("Failed to fetch subscribers:", errorMessage);
    return { error: errorMessage };
  }
}

export default async function NewsletterPage() {
  const { subscribers, error } = await getSubscribers();

  if (error) {
    return <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert"><p className="font-bold">Access Denied</p><p>{error}</p></div>;
  }

  return <NewsletterManager initialSubscribers={subscribers || []} />;
}
