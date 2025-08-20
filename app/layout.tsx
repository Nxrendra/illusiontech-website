'use client';

import { poppins, playfair } from "@/lib/fonts";
import dynamic from 'next/dynamic';
import "./../styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from 'react-hot-toast';
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";

const ChatWidgetContainer = dynamic(() => import('@/components/chat/ChatWidgetContainer'), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} font-sans !scroll-smooth`} suppressHydrationWarning>
       <body className="relative flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
          <Navbar />
          {children}
          <Footer />
          <ChatWidgetContainer />
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
