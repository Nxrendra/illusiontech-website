'use client';

import { INewsletterSubscriber } from '@/lib/models/NewsletterSubscriber';
import { Mail } from 'lucide-react';

type SerializedSubscriber = Omit<INewsletterSubscriber, 'subscribed_at' | '_id'> & {
  _id: string;
  subscribed_at: string;
};

interface SubscribersListProps {
  subscribers: SerializedSubscriber[];
}

export default function SubscribersList({ subscribers }: SubscribersListProps) {
  if (subscribers.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground">No Subscribers Yet</h3>
        <p className="text-muted-foreground mt-2 text-sm">When users subscribe, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg border border-border max-h-[600px] overflow-y-auto">
      <ul className="divide-y divide-border">
        {subscribers.map((subscriber) => (
          <li key={subscriber._id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">{subscriber.email}</span>
            </div>
            <span className="text-xs text-muted-foreground">{new Date(subscriber.subscribed_at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}