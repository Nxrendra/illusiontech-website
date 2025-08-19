'use client';

import { usePathname } from 'next/navigation';
import ChatWidget from '@/components/chat/ChatWidget';

export default function ChatWidgetContainer() {
  const pathname = usePathname();
 // If the pathname is not yet available, or if it's an admin page,
  // do not render the widget.
  if (!pathname || pathname.startsWith('/admin')) {
    return null;
  }

  return <ChatWidget />;
}

