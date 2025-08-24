import type { Metadata } from 'next';
import WebDevelopmentClientPage from './client-page';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import { connectToDB } from '@/lib/mongoose';
import { getIcon } from '@/lib/get-icon';
import React from 'react';
export const dynamic = 'force-dynamic';

const webDevServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Web Development',
  name: 'Custom Web Development Services',
  description:
    'High-performance, scalable, and secure web applications built with modern technologies like Next.js and React. We turn your complex ideas into elegant digital solutions.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'IllusionTech Development',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Trinidad and Tobago',
  },
  offers: {
    '@type': 'Offer',
    price: '0', // Indicates custom pricing
    priceCurrency: 'TTD',
  },
};

export const metadata: Metadata = {
  title: 'Custom Web Development in Trinidad | IllusionTech',
  description:
    'Build powerful, custom web applications with IllusionTech. We specialize in Next.js, React, and full-stack development for businesses in Trinidad and Tobago.',
};

export type ServiceWithIcon = Omit<IServiceData, 'icon'> & {
  _id: string;
  icon: React.ReactElement;
};

async function getWebDevServices(): Promise<ServiceWithIcon[]> {
  try {
    await connectToDB();
    const servicesFromDB = await ServiceModel.find({ type: 'web-development' }).sort({ name: 1 }).lean();
    const serializedServices: (IServiceData & { _id: string })[] = JSON.parse(JSON.stringify(servicesFromDB));
    return serializedServices.map(service => ({
      ...service,
      icon: getIcon(service.icon) as React.ReactElement,
    }));
  } catch (error) {
    console.error("Failed to fetch web development services:", error);
    return [];
  }
}

export default async function WebDevelopmentPage() {
  const services = await getWebDevServices();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webDevServiceSchema) }} />
      <WebDevelopmentClientPage services={services} />
    </>
  );
}