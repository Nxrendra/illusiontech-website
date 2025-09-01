'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/shared/Footer';
import { Toaster } from 'react-hot-toast';
import CookieConsentBanner from '@/components/ui/CookieConsentBanner';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
      <ChatWidgetContainer />
      <CookieConsentBanner />
    </ThemeProvider>
  );
}