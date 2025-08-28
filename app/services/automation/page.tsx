import type { Metadata } from 'next';
import AutomationClientPage from './client-page';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import { connectToDB } from '@/lib/mongoose';
import React from 'react';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.illusiontechdevelopment.com';

const automationServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Automation & Integration',
  name: 'Automation & Integration Services',
  description:
    'Streamline your business workflows with custom API integrations and bot development from IllusionTech. We connect your systems and automate repetitive tasks to improve efficiency.',
  url: `${siteUrl}/services/automation`,
  
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
  title: 'Automation & Integration Services in Trinidad | IllusionTech',
  description:
    'Streamline your business with custom API integrations and workflow automation. We help businesses in Trinidad and Tobago connect systems and eliminate manual tasks.',
  alternates: {
    canonical: '/services/automation',
  },
  openGraph: {
    type: 'website',
    url: '/services/automation',
    title: 'Automation & Integration Services in Trinidad | IllusionTech',
    description: 'Streamline your business with custom API integrations and workflow automation.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automation & Integration Services in Trinidad | IllusionTech',
    description: 'Streamline your business with custom API integrations and workflow automation.',
    images: ['/og-image.png'],
  },
};

async function getAutomationService(): Promise<(IServiceData & { _id: string }) | null> {
  await connectToDB();
  const service = await ServiceModel.findOne({ slug: 'automation-and-integration' }).lean();
  return service ? JSON.parse(JSON.stringify(service)) : null;
}

export default async function AutomationPage() {
const service = await getAutomationService();
  return (    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(automationServiceSchema) }} />
      <AutomationClientPage service={service} />
    </>
  );
}
