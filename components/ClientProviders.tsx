'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/shared/Footer';
import { Toaster } from 'react-hot-toast';
import CookieConsentBanner from '@/components/ui/CookieConsentBanner';

const ChatWidgetContainer = dynamic(
  () => import('@/components/chat/ChatWidgetContainer'),
  {
    ssr: false,
  }
);

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
      <Navbar />
      {children}
      <Footer />
      <ChatWidgetContainer />
      <CookieConsentBanner />
    </ThemeProvider>
  );
}