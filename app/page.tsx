import type { Metadata } from 'next';
import HomeClientPage from './client-page';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'IllusionTech Development',
  url: siteUrl,
  publisher: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const metadata: Metadata = {
  title: 'Custom Web Development & Design in Trinidad | IllusionTech',
  description:
    'IllusionTech builds bespoke, high-performance websites and web applications in Trinidad and Tobago. Specializing in Next.js, React, and modern tech stacks to elevate your digital presence.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Custom Web Development & Design in Trinidad | IllusionTech',
    description: 'Bespoke, high-performance websites and web applications in Trinidad and Tobago.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web Development & Design in Trinidad | IllusionTech',
    description: 'Bespoke, high-performance websites and web applications in Trinidad and Tobago.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <HomeClientPage />
    </>
  );
}