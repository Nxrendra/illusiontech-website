import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Calendar, Hash } from 'lucide-react';
import { ChatSessionSummary } from '@/lib/admin-chats';
import { Button } from '@/components/ui/Button';

export function ChatSessionCard({ session }: { session: ChatSessionSummary }) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col sm:flex-row items-start gap-6 hover:border-accent/50 transition-colors duration-200">
      <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-full flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-foreground truncate max-w-xs sm:max-w-sm">
              Session: <span className="font-mono text-sm text-accent">{session.sessionId}</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1 italic">
              &ldquo;{session.lastMessage}&rdquo;
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/dashboard/chat-sessions/${session.sessionId}`}>View Chat</Link>
          </Button>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground mt-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Last message {formatDistanceToNow(new Date(session.lastMessageTimestamp), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash size={14} />
            <span>{session.messageCount} messages</span>
          </div>
        </div>
      </div>
    </div>
  );
}