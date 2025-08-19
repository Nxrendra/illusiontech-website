import { getChatSessions } from '@/lib/admin-chats';
import { ChatSessionCard } from '@/components/admin/ChatSessionCard';
import { MessageSquare } from 'lucide-react';

export default async function ChatSessionsPage() {
  const result = await getChatSessions();

  if ('error' in result) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{result.error}</p>
      </div>
    );
  }

  const sessions = result;

  if (sessions.length === 0) {
    return (
      <div className="bg-background p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-foreground mb-2">Chat Sessions</h1>
        <p className="text-muted-foreground mb-8">A list of all recent chat conversations.</p>
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">No Chat Sessions Found</h2>
          <p className="text-muted-foreground mt-2">When new chat sessions are started, they will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 sm:p-6 md:p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-foreground mb-2">Chat Sessions</h1>
      <p className="text-muted-foreground mb-8">A list of all recent chat conversations.</p>
      <div className="space-y-6">
        {sessions.map((session) => (
          <ChatSessionCard key={session.sessionId} session={session} />
        ))}
      </div>
    </div>
  );
}