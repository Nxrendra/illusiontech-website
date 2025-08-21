// /Users/macbookair/Documents/IllusionTech-Development/app/about/page.tsx
import type { Metadata } from 'next';
import AboutClientPage from './client-page';

export const dynamic = 'force-dynamic';

const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About IllusionTech Development',
  url: 'https://illusiontech.dev/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'IllusionTech Development',
    description:
      'A small, dedicated team of developers and designers transforming complex problems into elegant digital solutions. We believe technology should be a tool for empowerment, not a barrier.',
    url: 'https://illusiontech.dev',
    logo: 'https://illusiontech.dev/og-image.png',
  },
};

export const metadata: Metadata = {
  title: 'About Us | IllusionTech Development',
  description:
    'Learn about IllusionTech Development, our mission to empower businesses with high-quality digital solutions, and our passion for creating exceptional web experiences.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    type: 'website',
    url: '/about',
    title: 'About Us | IllusionTech Development',
    description: 'Learn about our mission to empower businesses with high-quality digital solutions.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | IllusionTech Development',
    description: 'Learn about our mission to empower businesses with high-quality digital solutions.',
    images: ['/og-image.png'],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <AboutClientPage />
    </>
  );
}
