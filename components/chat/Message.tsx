'use client';

import { IMessage } from '@/lib/models/Message';
import clsx from 'clsx';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';


interface MessageProps {
  message: IMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.sender === 'user';

  return (
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={clsx('flex items-end gap-2 mb-4', {
        'justify-end': isUser
      })}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <Bot size={18} className="text-gray-600" />
        </div>
      )}
      <div
        className={clsx('rounded-lg px-4 py-2 max-w-[75%]', {
          'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none': isUser,
          'bg-white text-gray-800 rounded-bl-none shadow-sm': !isUser,
        })}
      >
        <p className="text-sm">{message.text}</p>
<p className={clsx('text-xs mt-1 opacity-70', {
          'text-right text-blue-100': isUser,
          'text-left text-gray-500': !isUser,
        })}>          {format(new Date(message.timestamp), 'p')}
        </p>
      </div>
     {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <User size={18} className="text-gray-600" />
        </div>
      )}
    </motion.div>
  );
}

