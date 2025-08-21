import type { Metadata } from 'next';
import UIUXDesignClientPage from './client-page';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

const uiUxServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'UI/UX Design',
  name: 'UI/UX Design Services',
  description:
    'Craft intuitive, user-friendly digital experiences with expert UI/UX design services from IllusionTech. We focus on user research, wireframing, prototyping, and creating full brand identity systems.',
  url: `${siteUrl}/services/ui-ux-design`,
  provider: {
    '@type': 'LocalBusiness',
    name: 'IllusionTech Development',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Trinidad and Tobago',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'UI/UX Design Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'UI/UX Design Consultation & Strategy' },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '0',
          priceCurrency: 'TTD',
          description: 'Custom Quote Required',
        },
      },
    ],
  },
};

export const metadata: Metadata = {
  title: 'UI/UX Design Services in Trinidad | IllusionTech',
  description:
    'Craft intuitive, user-friendly digital experiences with expert UI/UX design services in Trinidad and Tobago. We specialize in user research, prototyping, and brand identity.',
  alternates: {
    canonical: '/services/ui-ux-design',
  },
  openGraph: {
    type: 'website',
    url: '/services/ui-ux-design',
    title: 'UI/UX Design Services in Trinidad | IllusionTech',
    description: 'Craft intuitive, user-friendly digital experiences with expert UI/UX design services.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI/UX Design Services in Trinidad | IllusionTech',
    description: 'Craft intuitive, user-friendly digital experiences with expert UI/UX design services.',
    images: ['/og-image.png'],
  },
};

export default function UIUXDesignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(uiUxServiceSchema) }} />
      <UIUXDesignClientPage />
    </>
  );
}
