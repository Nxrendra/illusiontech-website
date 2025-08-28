import type { Metadata } from 'next';
import SupportMaintenanceClientPage from './client-page';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import { connectToDB } from '@/lib/mongoose';
import { getIcon } from '@/lib/get-icon';
import React from 'react';
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.illusiontechdevelopment.com';

const supportMaintenanceServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Support & Maintenance',
  name: 'Website Support & Maintenance Services',
  description:
    'Keep your website secure, updated, and performing at its best with ongoing support from IllusionTech. We offer multiple tiers to fit your needs, from basic care to premium, 24/7 monitoring.',
  url: `${siteUrl}/services/support-maintenance`,
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
  title: 'Website Support & Maintenance in Trinidad | IllusionTech',
  description:
    'Keep your website secure, updated, and performing at its best with our support and maintenance plans. We offer reliable service for businesses in Trinidad and Tobago.',
  alternates: {
    canonical: '/services/support-maintenance',
  },
  openGraph: {
    type: 'website',
    url: '/services/support-maintenance',
    title: 'Website Support & Maintenance in Trinidad | IllusionTech',
    description: 'Keep your website secure, updated, and performing at its best.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Support & Maintenance in Trinidad | IllusionTech',
    description: 'Keep your website secure, updated, and performing at its best.',
    images: ['/og-image.png'],
  },
};

export type ServiceWithIcon = Omit<IServiceData, 'icon'> & {
  _id: string;
  icon: React.ReactElement;
};

async function getSupportPageData(): Promise<{ mainService: (IServiceData & { _id: string }) | null; plans: ServiceWithIcon[] }> {
  try {
    await connectToDB();

    // Fetch the main support-maintenance service for header content
    const mainServiceFromDB = await ServiceModel.findOne({ type: 'support-main' }).lean();
    const mainService = mainServiceFromDB ? JSON.parse(JSON.stringify(mainServiceFromDB)) : null;

    // Fetch all individual support plans
    const plansFromDB = await ServiceModel.find({ type: 'support' }).sort({ position: 1, name: 1 }).lean();
    const serializedPlans: (IServiceData & { _id: string })[] = JSON.parse(JSON.stringify(plansFromDB));
    const plansWithIcons = serializedPlans.map(service => ({
      ...service,
      icon: getIcon(service.icon) as React.ReactElement,
    }));

    return { mainService, plans: plansWithIcons };
  } catch (error) {
    console.error("Failed to fetch support services:", error);
    // Return null for mainService and empty array for plans on error
    return { mainService: null, plans: [] };
  }
}

export default async function SupportMaintenancePage() {
  const { mainService, plans } = await getSupportPageData();
   return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportMaintenanceServiceSchema) }}
      />
      <SupportMaintenanceClientPage mainService={mainService} plans={plans} />
    </>
  );
}