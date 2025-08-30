'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2, Send } from 'lucide-react';
import TiptapEditor from '@/components/shared/TiptapEditor';
import { broadcastEmailToAgents } from '@/lib/actions/agent.actions';

export function BroadcastForm() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim() || content === '<p></p>') {
      toast.error('Subject and content cannot be empty.');
      return;
    }
    setIsSending(true);
    try {
      const result = await broadcastEmailToAgents({ subject, htmlContent: content });
      if (result.success) {
        toast.success(result.message);
        setSubject('');
        setContent('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Broadcast Email to Agents</CardTitle>
        <CardDescription>Compose and send an email to all active sales agents.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="e.g., New Commission Structure" value={subject} onChange={(e) => setSubject(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Content</Label><TiptapEditor content={content} onChange={setContent} placeholder="Write your message here..." /></div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit" disabled={isSending}>{isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Send Broadcast</Button></CardFooter>
      </form>
    </Card>
  );
}

