import type { Metadata } from 'next';
import WebDevelopmentClientPage from './client-page';
export const dynamic = 'force-dynamic';

const webDevServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Web Development',
  name: 'Custom Web Development Services',
  description:
    'High-performance, scalable, and secure web applications built with modern technologies like Next.js and React. We turn your complex ideas into elegant digital solutions.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'IllusionTech Development',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Trinidad and Tobago',
  },
  offers: {
    '@type': 'Offer',
    price: '0', // Indicates custom pricing
    priceCurrency: 'TTD',
  },
};

export const metadata: Metadata = {
  title: 'Custom Web Development in Trinidad | IllusionTech',
  description:
    'Build powerful, custom web applications with IllusionTech. We specialize in Next.js, React, and full-stack development for businesses in Trinidad and Tobago.',
};

export default function WebDevelopmentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webDevServiceSchema) }} />
      <WebDevelopmentClientPage />
    </>
  );
}