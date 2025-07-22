import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-poppins', 
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

export const metadata: Metadata = {
   metadataBase: new URL(siteUrl),
  title: {
    default: 'IllusionTech Development — Custom Web Solutions',
    template: '%s | IllusionTech Development',
  },
  description: "Professional web development and design services for small to medium businesses.",
  openGraph: {
    title: 'IllusionTech Development — Custom Web Solutions',
    description: 'Professional web development and design services for small to medium businesses.',
    url: siteUrl,
    siteName: 'IllusionTech Development',
    images: [
      {
        url: '/og-image.png', // Must be an absolute URL
        width: 1200,
        height: 630,
        alt: 'IllusionTech Development',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans !scroll-smooth`}>
      <body>
        <Navbar />
                {children}
        <Footer />
      </body>
    </html>
  );
}