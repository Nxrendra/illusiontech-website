'use client';

import { useState } from 'react';
import { INewsletterSubscriber } from '@/lib/models/NewsletterSubscriber';
import { Users, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import BroadcastForm from './BroadcastForm';
import SubscribersList from './SubscribersList';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type SerializedSubscriber = Omit<INewsletterSubscriber, 'subscribed_at' | '_id'> & {
  _id: string;
  subscribed_at: string;
};

interface NewsletterManagerProps {
  initialSubscribers: SerializedSubscriber[];
}

export default function NewsletterManager({ initialSubscribers }: NewsletterManagerProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      toast.error('Please enter an email address.');
      return;
    }
    setIsAdding(true);
    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add subscriber.');
      }

      setSubscribers((prev) => [...prev, result]);
      setNewEmail('');
      toast.success('Subscriber added successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSubscriber = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to remove subscriber.');
      }

      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      toast.success('Subscriber removed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-background p-4 sm:p-6 md:p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-foreground mb-2">Newsletter Management</h1>
      <p className="text-muted-foreground mb-8">View subscribers and broadcast emails.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-foreground mb-6">Compose Broadcast</h2>
          <BroadcastForm subscriberCount={subscribers.length} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Users className="mr-3 h-6 w-6" /> Subscribers ({subscribers.length})
          </h2>
          <form onSubmit={handleAddSubscriber} className="flex items-center gap-2 mb-4">
            <Input
              type="email"
              placeholder="Add subscriber email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isAdding}
              className="flex-grow"
            />
            <Button type="submit" disabled={isAdding} size="icon" aria-label="Add subscriber">
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </form>
          <SubscribersList subscribers={subscribers} onRemove={handleRemoveSubscriber} />
        </div>
      </div>
    </div>
  );
}