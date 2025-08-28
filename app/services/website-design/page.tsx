import type { Metadata } from 'next';
import WebsiteDesignClientPage from './client-page';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import { connectToDB } from '@/lib/mongoose';
import React from 'react';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.illusiontechdevelopment.com';

const websiteDesignServiceSchema = {  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Website Design',
  name: 'Website Design Services',
  description:
    'Visually stunning and brand-aligned website designs from IllusionTech. We create high-fidelity mockups and interactive prototypes that look and work perfectly on all devices.',
  url: `${siteUrl}/services/website-design`,
    provider: {
    '@type': 'LocalBusiness',
    name: 'IllusionTech Development',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Trinidad and Tobago',
  },
 
};

export const metadata: Metadata = {
  title: 'Website Design Services in Trinidad | IllusionTech',
  description:
'Get a visually compelling and brand-aligned website design. We specialize in creating beautiful, responsive, and engaging layouts for businesses in Trinidad and Tobago.',
  alternates: {
    canonical: '/services/website-design',
  },
  openGraph: {
    type: 'website',
    url: '/services/website-design',
    title: 'Website Design Services in Trinidad | IllusionTech',
    description: 'Get a visually compelling and brand-aligned website design.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Design Services in Trinidad | IllusionTech',
    description: 'Get a visually compelling and brand-aligned website design.',
    images: ['/og-image.png'],
  },};

async function getWebsiteDesignService(): Promise<(IServiceData & { _id: string }) | null> {
  await connectToDB();
  const service = await ServiceModel.findOne({ slug: 'website-design' }).lean();
  return service ? JSON.parse(JSON.stringify(service)) : null;
}

export default async function WebsiteDesignPage() {
  const service = await getWebsiteDesignService();  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteDesignServiceSchema) }} />
      <WebsiteDesignClientPage service={service} />
    </>
  );
}