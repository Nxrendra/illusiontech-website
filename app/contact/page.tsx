import type { Metadata } from 'next';
import ContactClientPage from './client-page';
import { connectToDB } from '@/lib/mongoose';
import { getPageContent } from '@/lib/data/pageContent';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import React from 'react';
import { getIcon } from '@/lib/get-icon';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us | IllusionTech Development',
  description: 'Get in touch with IllusionTech for custom web development, design, and automation services. We are based in Trinidad and Tobago and ready to help you with your next project.',
  alternates: {
    canonical: '/contact',
  },
};

export type ServiceForForm = Omit<IServiceData, 'icon'> & {
  _id: string;
  icon: React.ReactElement;
};

async function getServicesForForm(): Promise<ServiceForForm[]> {
  try {
    await connectToDB();
    const servicesFromDB = await ServiceModel.find({
      type: { $in: ['web-development', 'support'] }
    }).sort({ position: 1 }).lean();

    const serializedServices: (IServiceData & { _id: string })[] = JSON.parse(JSON.stringify(servicesFromDB));

    return serializedServices.map(service => ({ ...service, icon: getIcon(service.icon) as React.ReactElement }));
  } catch (error) {
    console.error("Failed to fetch services for contact form:", error);
    return [];
  }
}

export default async function ContactPage() {
  const content = await getPageContent();
  const services = await getServicesForForm();

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
      <ContactClientPage content={content} services={services} />
    </>
  );
}