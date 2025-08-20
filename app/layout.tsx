import type { Metadata } from "next";
import { poppins, playfair } from "@/lib/fonts";
import "./../styles/globals.css";
import ClientProviders from "@/components/ClientProviders";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'IllusionTech Development',
  url: siteUrl,
  logo: `${siteUrl}/og-image.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-868-XXX-XXXX', // <-- Replace with your actual phone number
    contactType: 'Sales & Support',
    areaServed: 'TT',
    availableLanguage: ['en'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Innovation Drive', // <-- Replace with your actual address
    addressLocality: 'Port of Spain',
    addressRegion: 'POS',
    postalCode: '00000', // Trinidad doesn't use zip codes widely, but it's a required field for some validators
    addressCountry: 'TT',
  },
  sameAs: [], // <-- Add your social media profile URLs here
};

export const metadata: Metadata = {
   metadataBase: new URL(siteUrl),
  title: {
    default: 'IllusionTech Development — Custom Web Solutions',
    template: '%s | IllusionTech Development',
  },
  description: "IllusionTech builds high-performance, custom websites and web applications for startups and growing businesses worldwide. Specializing in Next.js, React, and modern web technologies.",
  openGraph: {
    title: 'IllusionTech Development — Custom Web Solutions',
    description: 'High-performance, custom websites and web applications for businesses worldwide. Specializing in Next.js, React, and modern web technologies.',
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
    <html lang="en" className={`${poppins.variable} ${playfair.variable} font-sans !scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
