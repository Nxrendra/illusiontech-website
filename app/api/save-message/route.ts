// /Users/macbookair/Documents/IllusionTech-Development/app/api/save-message/route.ts

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Message from '@/lib/models/Message';
import { getPusherServer } from '@/lib/pusher';

// Define the expected request body shape
interface SaveMessageRequestBody {
  text: string;
  sender: 'user' | 'bot';
  sessionId: string;
  timezone?: string;
  socket_id?: string;
}

export async function POST(request: Request) {
  try {
    await connectToDB();

    const {
      text,
      sender,
      sessionId,
      timezone,
      socket_id,
    }: SaveMessageRequestBody = await request.json();

    const newMessage = await Message.create({
      sessionId,
      text,
      sender,
      timestamp: new Date(),
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // Broadcast the final, saved message to all clients.
    // This ensures data consistency if a client's stream was interrupted.
    await getPusherServer().trigger(
      `chat-${sessionId}`,
      'new-message',
      { ...newMessage.toObject(), _id: newMessage._id.toString() },
      { socket_id }    );

    return NextResponse.json(newMessage);
  } catch (error) {
    // Check for MongoDB duplicate key error (code 11000)
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      // This is expected if the message was already saved, so we can safely ignore it.
      return NextResponse.json({ status: 'ok', message: 'Message already saved.' });
    }
    
    console.error('POST /api/save-message error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
