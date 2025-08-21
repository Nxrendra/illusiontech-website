import type { Metadata } from 'next';
import SupportMaintenanceClientPage from './client-page';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

const supportMaintenanceServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Website Support and Maintenance',
  name: 'Website Support & Maintenance Plans',
  description:
    'Protect your investment with our reliable website support and maintenance plans. We handle updates, security, and performance so you can focus on your business.',
  url: `${siteUrl}/services/support-maintenance`,
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
    name: 'Maintenance Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Basic Care' },
        priceSpecification: { '@type': 'PriceSpecification', price: '250', priceCurrency: 'TTD', unitText: 'month' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Growth' },
        priceSpecification: { '@type': 'PriceSpecification', price: '500', priceCurrency: 'TTD', unitText: 'month' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Premium' },
        priceSpecification: { '@type': 'PriceSpecification', price: '800', priceCurrency: 'TTD', unitText: 'month' },
      },
    ],
  },
};

export const metadata: Metadata = {
  title: 'Website Support & Maintenance Plans | IllusionTech',
  description:
    'Protect your investment with our reliable website support and maintenance plans. We handle updates, security, and performance so you can focus on your business.',
  alternates: {
    canonical: '/services/support-maintenance',
  },
  openGraph: {
    type: 'website',
    url: '/services/support-maintenance',
    title: 'Website Support & Maintenance Plans | IllusionTech',
    description: 'Keep your website secure, fast, and up-to-date with our flexible monthly maintenance plans.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Support & Maintenance Plans | IllusionTech',
    description: 'Keep your website secure, fast, and up-to-date with our flexible monthly maintenance plans.',
    images: ['/og-image.png'],
  },
};

export default function SupportMaintenancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportMaintenanceServiceSchema) }}
      />
      <SupportMaintenanceClientPage />
    </>
  );
}