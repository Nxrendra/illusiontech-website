'use client';

import { useState } from 'react';
import { INewsletterSubscriber } from '@/lib/models/NewsletterSubscriber';
import { Mail, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"

type SerializedSubscriber = Omit<INewsletterSubscriber, 'subscribed_at' | '_id'> & {
  _id: string;
  subscribed_at: string;
};

interface SubscribersListProps {
  subscribers: SerializedSubscriber[];
  onRemove: (id: string) => Promise<void>;
}

export default function SubscribersList({ subscribers, onRemove }: SubscribersListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleRemoveClick = async (id: string) => {
    setIsDeleting(id);
    await onRemove(id);
    setIsDeleting(null);
  };

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
          <li key={subscriber._id} className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">{subscriber.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{new Date(subscriber.subscribed_at).toLocaleDateString()}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting === subscriber._id}>
                    {isDeleting === subscriber._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the subscriber <span className="font-medium">{subscriber.email}</span>. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemoveClick(subscriber._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}