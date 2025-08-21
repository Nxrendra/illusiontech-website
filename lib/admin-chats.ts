import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectToDB } from '@/lib/mongoose';
import Message from '@/lib/models/Message';

export interface ChatSessionSummary {
  sessionId: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  messageCount: number;
}

async function verifyAuth() {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = cookies().get('auth_token')?.value;

    if (!token || !JWT_SECRET) {
        return false;
    }

    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secretKey);
        return true;
    } catch (error) {
        console.error('Auth verification failed:', error);
        return false;
    }
}

/**
 * Fetches a summary of all chat sessions for the admin dashboard.
 */
export async function getChatSessions(): Promise<ChatSessionSummary[] | { error: string }> {
    if (!await verifyAuth()) {
        return { error: 'Authentication required.' };
    }

    try {
        await connectToDB();

        const sessions: ChatSessionSummary[] = await Message.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: '$sessionId', lastMessage: { $first: '$text' }, lastMessageTimestamp: { $first: '$timestamp' }, messageCount: { $sum: 1 } } },
            { $sort: { lastMessageTimestamp: -1 } },
            { $project: { _id: 0, sessionId: '$_id', lastMessage: 1, lastMessageTimestamp: 1, messageCount: 1 } },
        ]);

        return JSON.parse(JSON.stringify(sessions));
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
        return { error: 'Failed to fetch chat sessions' };
    }
}