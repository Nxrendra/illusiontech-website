import type { Metadata } from 'next';
import AutomationClientPage from './client-page';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

const automationServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Business Process Automation',
  name: 'Custom Automation & API Integration Services',
  url: `${siteUrl}/services/automation`,
  description:
    'Streamline your business with custom workflow automation and API integration solutions. We connect your systems to boost efficiency and reduce manual work.',
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
    name: 'Automation & Integration Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Custom Automation & Integration' },
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
  title: 'Custom Automation & API Integration Services | IllusionTech',
  description:
    'Streamline your business with custom workflow automation and API integration solutions. We connect your systems to boost efficiency and reduce manual work.',
  alternates: {
    canonical: '/services/automation',
  },
  openGraph: {
    type: 'website',
    url: '/services/automation',
    title: 'Custom Automation & API Integration Services | IllusionTech',
    description: 'Streamline your business with custom workflow automation and API integration solutions.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Automation & API Integration Services | IllusionTech',
    description: 'Streamline your business with custom workflow automation and API integration solutions.',
    images: ['/og-image.png'],
  },
};

export default function AutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(automationServiceSchema) }}
      />
      <AutomationClientPage />
    </>
  );
}
