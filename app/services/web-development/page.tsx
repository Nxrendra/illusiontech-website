import type { Metadata } from 'next';
import WebDevelopmentClientPage from './client-page';
import { services } from '@/lib/data/services';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

// Filter for web development packages to be used in the schema
const packages = services.filter((s) => s.type === 'web-development');

// Create a more comprehensive schema for the Web Development service,
// including all available packages in an OfferCatalog.
const webDevelopmentServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Web Development',
  name: 'Custom Web Development Services',
  description:
    'Bespoke web development packages from IllusionTech, catering to individuals, startups, and enterprises in Trinidad and Tobago. We build high-performance websites using modern technology.',
  url: `${siteUrl}/services/web-development`,
  provider: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Trinidad and Tobago',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Development Packages',
    itemListElement: packages.map((pkg) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: pkg.name,
        description: pkg.longDescription,
        url: `${siteUrl}/services/web-development#${pkg.id}`,
      },
      priceSpecification: (() => {
        const baseSpec = {
          '@type': 'PriceSpecification',
          priceCurrency: 'TTD',
          valueAddedTaxIncluded: false,
        };
        if (pkg.price.includes('Starting at')) {
          const priceValue = parseFloat(pkg.price.replace(/[^0-9.]/g, ''));
          return { ...baseSpec, minPrice: priceValue };
        }
        if (pkg.price.includes(' - ')) {
          const [min, max] = pkg.price
            .replace(/\$|,/g, '')
            .split(' - ')
            .map((p) => parseFloat(p.trim()));
          return { ...baseSpec, minPrice: min, maxPrice: max };
        }
        // Fallback for custom pricing or other formats
        return { ...baseSpec, price: '0', description: 'Custom Quote Required' };
      })(),
    })),
  },
};

export const metadata: Metadata = {
  title: 'Web Development Packages in Trinidad | IllusionTech',
  description:
    'Explore web development packages in Trinidad and Tobago. From one-page sites to e-commerce stores, IllusionTech offers tailored solutions for your business.',
  alternates: { canonical: '/services/web-development' },
  openGraph: {
    type: 'website',
    url: '/services/web-development',
    title: 'Web Development Packages in Trinidad | IllusionTech',
    description: 'From one-page sites to e-commerce stores, we offer tailored web solutions.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Packages in Trinidad | IllusionTech',
    description: 'From one-page sites to e-commerce stores, we offer tailored web solutions.',
    images: ['/og-image.png'],
  },
};

export default function WebDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webDevelopmentServiceSchema),
        }}
      />
      <WebDevelopmentClientPage />
    </>
  );
}
