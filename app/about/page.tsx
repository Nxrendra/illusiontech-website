// /Users/macbookair/Documents/IllusionTech-Development/app/about/page.tsx
import type { Metadata } from 'next';
import AboutClientPage from './client-page';
import { getPageContent } from '@/lib/data/pageContent';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent();

  const title = content.aboutMetaTitle ?? 'About Us | IllusionTech Development';
  const description = content.aboutMetaDescription ?? 'Learn about IllusionTech Development, our mission to empower businesses with high-quality digital solutions, and our passion for creating exceptional web experiences.';
  const url = '/about';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: '/og-image.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function AboutPage() {
  const content = await getPageContent();

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: content.aboutMetaName ?? 'About IllusionTech Development',
    url: 'https://illusiontech.dev/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'IllusionTech Development',
      description: content.aboutMetaDescription ?? 'A small, dedicated team of developers and designers transforming complex problems into elegant digital solutions. We believe technology should be a tool for empowerment, not a barrier.',
      url: 'https://illusiontech.dev',
      logo: 'https://illusiontech.dev/og-image.png',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <AboutClientPage content={content} />
    </>
  );
}
