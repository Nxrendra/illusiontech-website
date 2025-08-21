import type { Metadata } from 'next';
import ServicesClientPage from './client-page';
import { services } from '@/lib/data/services';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

// Create an ItemList schema for all the services offered
const servicesItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'IllusionTech Development Services',
  description: 'A comprehensive list of web development, design, and automation services offered by IllusionTech Development.',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      url: `${siteUrl}${service.link}`,
      provider: {
        '@type': 'LocalBusiness',
        name: 'IllusionTech Development',
      },
    },
  })),
};

export const metadata: Metadata = {
  title: 'Our Services | Web Development, Design & Automation',
  description:
    'Discover the full range of services offered by IllusionTech in Trinidad and Tobago, including custom web development, UI/UX design, website maintenance, and process automation.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    type: 'website',
    url: '/services',
    title: 'Our Services | Web Development, Design & Automation',
    description: 'Discover the full range of services offered by IllusionTech in Trinidad and Tobago.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Web Development, Design & Automation',
    description: 'Discover the full range of services offered by IllusionTech in Trinidad and Tobago.',
    images: ['/og-image.png'],
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesItemListSchema) }}
      />
      <ServicesClientPage />
    </>
  );
}