// /app/admin/chats/page.tsx (Example)
import Link from 'next/link';
import { getChatSessions, ChatSessionSummary } from '@/lib/admin-chats';

export default async function AdminChatsPage() {
  const sessionsResult = await getChatSessions();

  if ('error' in sessionsResult) {
    return <div className="text-red-500 p-4">Error: {sessionsResult.error}</div>;
  }

  const sessions: ChatSessionSummary[] = sessionsResult;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Chat Sessions</h1>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <li key={session.sessionId} className="p-4 hover:bg-gray-50">
                 <Link href={`/admin/chat/${session.sessionId}`} className="block">
                  <div className="flex justify-between items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm text-gray-600 truncate">
                        ID: {session.sessionId}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(session.lastMessageTimestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-gray-800 italic">
                    &quot;{session.lastMessage.substring(0, 100)}...&quot;
                  </p>
                  <p className="text-right text-xs text-gray-500 mt-1">
                    {session.messageCount} messages
                  </p>
                </Link>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">No chat sessions found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
