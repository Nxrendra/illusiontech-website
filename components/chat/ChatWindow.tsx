'use client';

import { useState, useEffect, useRef } from 'react';
import { IMessage } from '@/lib/models/Message';
import { Message } from '@/components/chat/Message';
import { Send } from 'lucide-react';
import { getPusherClient } from '@/lib/pusher';

interface ChatWindowProps {
  sessionId: string;
}

export default function ChatWindow({ sessionId }: ChatWindowProps) {
  const [socketId, setSocketId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This effect fetches the initial chat history when the component mounts.
  useEffect(() => {
    const fetchHistory = async () => {
      if (!sessionId) return;
      try {
        const response = await fetch(`/api/messages?sessionId=${sessionId}`);
        if (response.ok) {
          const history: IMessage[] = await response.json();
          setMessages(history);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };
    fetchHistory();
  }, [sessionId]);

  // Create a ref to hold the latest messages array. This allows us to access
  // the most current messages inside the Pusher callback without needing to
  // add `messages` as a dependency to the `useEffect` hook.
  const messagesRef = useRef<IMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);


  // This effect handles real-time updates from other clients via Pusher.
  useEffect(() => {
    const pusherClient = getPusherClient();

    // When the Pusher connection is established, get the unique socket ID.
    pusherClient.connection.bind('connected', () => {
      setSocketId(pusherClient.connection.socket_id);
    });

    // Subscribe to the channel for this specific chat session.
    const channel = pusherClient.subscribe(`chat-${sessionId}`);

    // Bind to the 'new-message' event on the channel.
    channel.bind('new-message', (newMessage: IMessage) => {
         // Use the ref to get the latest messages to avoid stale state in the closure.
      const currentMessages = messagesRef.current;

      const messageExists = currentMessages.some(m => m._id === newMessage._id);

      // If the message doesn't exist, add it to the list.
      if (!messageExists) {
        setMessages(prev => [...prev, newMessage]);
      }
    });

    // Cleanup function to run when the component unmounts.
    return () => {
      channel.unbind_all();
      pusherClient.connection.unbind('connected');
      pusherClient.unsubscribe(`chat-${sessionId}`);
    };
  }, [sessionId, setMessages]); // Dependencies for the effect.

  // This effect scrolls the chat window to the bottom whenever new messages are added.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const tempId = Date.now().toString();
    const newMessage: IMessage = {
      _id: tempId,
      text: input,
      sender: 'user',
      sessionId,
      timestamp: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/save-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newMessage.text,
          sender: 'user',
          sessionId,
          socket_id: socketId,
          timezone: newMessage.timezone,
        }),
      });
      if (!response.ok) {
        throw new Error('Server failed to save the message.');
      }

      const savedMessage: IMessage = await response.json();

      // Update the message in the state with the real _id from the database
      setMessages(prev => prev.map(msg => (msg._id === tempId ? savedMessage : msg)));
    } catch (error) {
      console.error('Failed to send message', error);
      // If the API call fails, remove the optimistic message from the UI.
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full h-full flex flex-col overflow-hidden">
      <div className="bg-gray-800 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">How can we help?</h3>
        <p className="text-sm text-gray-300">We typically reply in a few minutes.</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleFormSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 min-w-0 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!socketId || isLoading}
            className="ml-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
