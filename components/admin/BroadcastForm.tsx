'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface BroadcastFormProps {
  subscriberCount: number;
}

export default function BroadcastForm({ subscriberCount }: BroadcastFormProps) {
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !htmlBody) {
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
        <label htmlFor="htmlBody" className="block text-sm font-medium text-foreground mb-2">Email Body (HTML)</label>
        <Textarea id="htmlBody" value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} placeholder="<h1>Hello Subscribers!</h1><p>Here's your weekly update...</p>" required rows={15} disabled={isSending} className="font-mono" />
        <p className="text-xs text-muted-foreground mt-2">You can use HTML tags for formatting.</p>
      </div>
      <Button type="submit" disabled={isSending || subscriberCount === 0} className="w-full sm:w-auto">
        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Broadcast to {subscriberCount} Subscribers
      </Button>
    </form>
  );
}