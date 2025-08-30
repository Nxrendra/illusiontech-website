import type { Metadata } from 'next';
import ContactClientPage from './client-page';
import { connectToDB } from '@/lib/mongoose';
import PageContent, { IPageContentData } from '@/lib/models/PageContent';
import React from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us | IllusionTech Development',
  description: 'Get in touch with IllusionTech for custom web development, design, and automation services. We are based in Trinidad and Tobago and ready to help you with your next project.',
  alternates: {
    canonical: '/contact',
  },
};

async function getPageContent(): Promise<IPageContentData> {
  try {
    await connectToDB();
    const content = await PageContent.findOne({}).lean();
    return content ? JSON.parse(JSON.stringify(content)) : {};
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    return {};
  }
}

export default async function ContactPage() {
  const content = await getPageContent();

  // Dynamically create the JSON-LD schema based on CMS content or defaults
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'IllusionTech Development',
    image: 'https://www.illusiontechdevelopment.com/og-image.png', // Assuming a static image
    url: 'https://www.illusiontechdevelopment.com/contact',
    telephone: content.contactPhone ?? '+1 (868) 467-1453',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TT',
      addressLocality: content.contactAddress ?? 'Trinidad and Tobago',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <ContactClientPage content={content} />
    </>
  );
}