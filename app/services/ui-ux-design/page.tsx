import type { Metadata } from 'next';
import UIUXDesignClientPage from './client-page';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import { connectToDB } from '@/lib/mongoose';
import React from 'react';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.illusiontechdevelopment.com';

const uiUxServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'UI/UX Design',
  name: 'UI/UX Design Services',
  description:
    'Craft intuitive, user-friendly digital experiences with expert UI/UX design services in Trinidad and Tobago. We specialize in user research, prototyping, and brand identity.',
  url: `${siteUrl}/services/ui-ux-design`,
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
    description: 'Craft intuitive, user-friendly digital experiences with expert UI/UX design services in Trinidad and Tobago. We specialize in user research, prototyping, and brand identity.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI/UX Design Services in Trinidad | IllusionTech',
    description: 'Craft intuitive, user-friendly digital experiences with expert UI/UX design services in Trinidad and Tobago. We specialize in user research, prototyping, and brand identity.',
    images: ['/og-image.png'],
  },
};

async function getUiUxDesignService(): Promise<(IServiceData & { _id: string }) | null> {
  await connectToDB();
  const service = await ServiceModel.findOne({ slug: 'ui-ux-design' }).lean();
  return service ? JSON.parse(JSON.stringify(service)) : null;
}

export default async function UIUXDesignPage() {
  const service = await getUiUxDesignService();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(uiUxServiceSchema) }} />
      <UIUXDesignClientPage service={service} />
    </>
  );
}
