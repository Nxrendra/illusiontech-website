import type { Metadata } from 'next';
import WebsiteDesignClientPage from './client-page';
export const dynamic = 'force-dynamic';

const designServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Website Design',
  name: 'Custom Website Design Services',
  description:
    'Visually stunning and intuitive website designs that engage users and reflect your brand identity. We specialize in custom layouts, visual branding, and data-driven design.',
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
    price: '0', // Indicates custom pricing, as design is often quoted
    priceCurrency: 'TTD',
  },
};

export const metadata: Metadata = {
  title: 'Custom Website Design in Trinidad | IllusionTech',
  description:
    'Elevate your brand with stunning, user-centric website design from IllusionTech. We create custom, data-driven designs for businesses in Trinidad and Tobago.',
};

export default function WebsiteDesignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(designServiceSchema) }} />
      <WebsiteDesignClientPage />
    </>
  );
}