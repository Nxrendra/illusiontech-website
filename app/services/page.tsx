import type { Metadata } from 'next';
import ServicesClientPage from './client-page';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import { getIcon } from '@/lib/get-icon';
import React from 'react';
import { connectToDB } from '@/lib/mongoose';
import { getPageContent } from '@/lib/data/pageContent';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.illusiontechdevelopment.com';

// Define types for the structured data schema to prevent type inference issues.
type SchemaListItem = {
  '@type': 'ListItem';
  position: number;
  item: {
    '@type': 'Service';
    name: string;
    description?: string;
    url: string;
    provider: {
      '@type': 'LocalBusiness';
      name: string;
    };
  };
};

// Create an ItemList schema for all the services offered
const servicesItemListSchema: {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  itemListElement: SchemaListItem[];
} = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'IllusionTech Development Services',
  description: 'A comprehensive list of web development, design, and automation services offered by IllusionTech Development.',
  // This will be populated dynamically below
  itemListElement: [],
};

export type ServiceWithIcon = Omit<IServiceData, 'icon'> & {
  _id: string;
  icon: React.ReactElement;
};

async function getAllServices(): Promise<ServiceWithIcon[]> {
  try {
    await connectToDB();
    // Fetch all services, sorted by name for consistency
    const servicesFromDB = await ServiceModel.find({}).sort({ position: 1, name: 1 }).lean();

    const serializedServices: (IServiceData & { _id: string })[] = JSON.parse(JSON.stringify(servicesFromDB));

    // Update the schema for SEO
    servicesItemListSchema.itemListElement = serializedServices
      .filter(service => service.link) // Filter out services without a link
      .map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: `${siteUrl}${service.link}`, // Now service.link is guaranteed to exist
          provider: {
            '@type': 'LocalBusiness',
            name: 'IllusionTech Development',
          },
        },
      }));

    return serializedServices.map(service => ({
      ...service,
      icon: getIcon(service.icon) as React.ReactElement,
    }));
  } catch (error) {
    console.error("Failed to fetch services for services page:", error);
    return [];
  }
}

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

export default async function ServicesPage() {
  const services = await getAllServices();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesItemListSchema) }}
      />
      <ServicesClientPage services={services} />
    </>
  );
}
