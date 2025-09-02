import type { Metadata } from 'next';
import HomeClientPage from './client-page';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import { getIcon } from '@/lib/get-icon';
import { connectToDB } from '@/lib/mongoose';
import React from 'react';
import { getPageContent } from '@/lib/data/pageContent';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.illusiontechdevelopment.com';

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'IllusionTech Development',
  url: siteUrl,
  publisher: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};


export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent();

  const title = content.homeMetaTitle ?? 'Custom Web Development & Design in Trinidad | IllusionTech';
  const description = content.homeMetaDescription ?? 'IllusionTech builds bespoke, high-performance websites and web applications in Trinidad and Tobago. Specializing in Next.js, React, and modern tech stacks to elevate your digital presence.';

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      url: '/',
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

export type ServiceWithIcon = Omit<IServiceData, 'icon'> & {
  _id: string;
  icon: React.ReactElement;
};

async function getServices(): Promise<ServiceWithIcon[]> {
  try {
    await connectToDB();
    // Fetch core services, limit to 4 for the preview, and sort for consistency.
    const servicesFromDB = await ServiceModel.find({ featured: true }).sort({ homepagePosition: 1, position: 1, name: 1 }).limit(4).lean();

    // Properly serialize the data to convert complex types (like ObjectId) to simple strings.
    const serializedServices: (IServiceData & { _id: string })[] = JSON.parse(JSON.stringify(servicesFromDB));

    // Map the icon string from the DB to the actual icon component.
    const servicesWithIcons = serializedServices.map(service => ({
      ...service,
      icon: getIcon(service.icon) as React.ReactElement,
    }));

    return servicesWithIcons;
  } catch (error) {
    console.error("Failed to fetch services for homepage:", error);
    return [];
  }
}

export default async function HomePage() {
  const services = await getServices();
  const content = await getPageContent();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <HomeClientPage services={services} content={content} />
    </>
  );
}