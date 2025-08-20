import type { Metadata } from 'next';
import { poppins, playfair } from '@/lib/fonts';
import './../styles/globals.css';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: {
    default: 'IllusionTech Development — Custom Web Solutions',
    template: '%s | IllusionTech Development',
  },
  description:
    'IllusionTech builds high-performance, custom websites and web applications for startups and growing businesses worldwide.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} font-sans !scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-screen flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
