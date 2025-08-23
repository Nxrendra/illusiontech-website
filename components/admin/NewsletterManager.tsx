'use client';

import { INewsletterSubscriber } from '@/lib/models/NewsletterSubscriber';
import { Users } from 'lucide-react';
import BroadcastForm from './BroadcastForm';
import SubscribersList from './SubscribersList';

type SerializedSubscriber = Omit<INewsletterSubscriber, 'subscribed_at' | '_id'> & {
  _id: string;
  subscribed_at: string;
};

interface NewsletterManagerProps {
  initialSubscribers: SerializedSubscriber[];
}

export default function NewsletterManager({ initialSubscribers }: NewsletterManagerProps) {
  return (
    <div className="bg-background p-4 sm:p-6 md:p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-foreground mb-2">Newsletter Management</h1>
      <p className="text-muted-foreground mb-8">View subscribers and broadcast emails.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-foreground mb-6">Compose Broadcast</h2>
          <BroadcastForm subscriberCount={initialSubscribers.length} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Users className="mr-3 h-6 w-6" /> Subscribers ({initialSubscribers.length})
          </h2>
          <SubscribersList subscribers={initialSubscribers} />
        </div>
      </div>
    </div>
  );
}