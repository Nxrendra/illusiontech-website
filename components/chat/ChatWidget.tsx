'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client
    let storedSessionId = localStorage.getItem('chat_session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('chat_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  return (
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-6 md:bottom-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && sessionId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm h-[65vh] max-h-[380px] md:w-80 md:h-[420px] md:max-h-none mb-3 origin-bottom-right pointer-events-auto"
          >
            <ChatWindow sessionId={sessionId} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex h-12 w-12 items-center justify-center pointer-events-auto"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'message'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
