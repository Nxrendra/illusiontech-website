'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, type Message as VercelAIMessage } from 'ai/react';
import { IMessage } from '@/lib/models/Message';
import { Message } from '@/components/chat/Message';
import { Send } from 'lucide-react';
import { getPusherClient } from '@/lib/pusher';

interface ChatWindowProps {
  sessionId: string;
}

export default function ChatWindow({ sessionId }: ChatWindowProps) {
  // The useChat hook manages the chat state and interactions.
  const {
    messages,         // The array of chat messages.
    input,            // The current value of the input field.
    handleInputChange,// A handler for the input field's onChange event.
    handleSubmit,     // A handler for the form's onSubmit event.
    setMessages,      // A function to update the messages state.
    isLoading,        // A boolean indicating if the AI is generating a response.
  } = useChat({
    // The API endpoint that the hook will call.
    api: '/api/chat',
    // The ID for this chat session. This is sent to the GET endpoint to fetch initial messages.
    id: sessionId,
    // Additional data to send with each POST request to the API.
    body: {
      sessionId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
      // This callback is called when the stream from the API has finished.
    onFinish: async (message) => {
      // The user's message is already saved by the API route.
      // Now, save the assistant's final message to the database.
      if (message.role === 'assistant') {
        await fetch('/api/save-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...message,
            sessionId,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        socket_id: socketId,

          }),
        });
      }
    },
  });

  const [socketId, setSocketId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create a ref to hold the latest messages array. This allows us to access
  // the most current messages inside the Pusher callback without needing to
  // add `messages` as a dependency to the `useEffect` hook.
  const messagesRef = useRef<VercelAIMessage[]>([]);
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

        const messageIndex = currentMessages.findIndex(m => m.id === newMessage._id);

      // If the message already exists (e.g., from the stream), update it.
      if (messageIndex !== -1) {
        const updatedMessages = [...currentMessages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          content: newMessage.text, // Ensure content is the final, saved version.
        };
        setMessages(updatedMessages);
      } else {
        // If it's a new message (e.g., from another user), add it to the list.
        const newVercelMessage: VercelAIMessage = {
          id: newMessage._id,
          role: newMessage.sender === 'bot' ? 'assistant' : 'user',
          content: newMessage.text,
        };
        setMessages([...currentMessages, newVercelMessage]);
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

  // We wrap the default handleSubmit to inject the Pusher socket_id into the request body.
  // This allows the server to avoid broadcasting the message back to the client that sent it.
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e, {
      options: {
        body: {
          socket_id: socketId,
        },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full h-full flex flex-col overflow-hidden">
      <div className="bg-gray-800 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">How can we help?</h3>
        <p className="text-sm text-gray-300">We typically reply in a few minutes.</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg: VercelAIMessage) => {
          // Adapt the Vercel AI SDK message format to what our <Message /> component expects.
          const messageProps: IMessage = {
            _id: msg.id,
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'bot',
            sessionId: sessionId,
            timestamp: msg.createdAt || new Date(),
            timezone: '', // Not essential for display.
          };
          return <Message key={msg.id} message={messageProps} />;
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-xs animate-pulse">
              <span className="italic">Assistant is typing...</span>
            </div>
          </div>
        )}
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
