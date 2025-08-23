'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the RichTextEditor to ensure it only loads on the client-side.
// We also provide a loading component for a better user experience.
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-[405px] w-full bg-muted rounded-md animate-pulse" />,
});

interface BroadcastFormProps {
  subscriberCount: number;
}

export default function BroadcastForm({ subscriberCount }: BroadcastFormProps) {
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check for empty editor state, as Quill might return an empty paragraph tag.
    if (!subject || !htmlBody || htmlBody === '<p><br></p>') {
      toast.error('Please fill out both the subject and email body.');
      return;
    }

    setIsSending(true);
    toast.info('Broadcasting email to subscribers...');

    try {
      const response = await fetch('/api/admin/newsletter/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          htmlBody,
          // The textBody generation remains the same and is still a good idea for email clients that don't render HTML.
          textBody: htmlBody.replace(/<[^>]*>?/gm, ''),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred.');
      }

      toast.success(result.message || 'Broadcast sent successfully!');
      setSubject('');
      setHtmlBody('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send broadcast.';
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleBroadcast} className="space-y-6">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Email Subject</label>
        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your amazing newsletter subject" required disabled={isSending} />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email Body</label>
        <RichTextEditor
          value={htmlBody}
          onChange={setHtmlBody}
          placeholder="<h1>Hello Subscribers!</h1><p>Here's your weekly update...</p>"
          disabled={isSending}
        />
        <p className="text-xs text-muted-foreground mt-2">A rich text editor with HTML support.</p>
      </div>
      <Button type="submit" disabled={isSending || subscriberCount === 0} className="w-full sm:w-auto">
        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Broadcast to {subscriberCount} Subscribers
      </Button>
    </form>
  );
}