import { verifyAdminSession } from '@/lib/auth-utils';
import { connectToDB } from '@/lib/mongoose';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import ServiceManager from '@/components/admin/ServiceManager';
import React from 'react';

// This type is necessary for data passed from Server Components to Client Components
type SerializedService = IServiceData & {
  _id: string;
};

async function getServicesData(): Promise<{ services?: SerializedService[]; error?: string }> {
  try {
    await verifyAdminSession();
    await connectToDB();

    const servicesData = await ServiceModel.find({})
      .sort({ position: 1, name: 1 })
      .lean();

    // A robust way to serialize the data and remove Mongoose-specific properties
    const services = JSON.parse(JSON.stringify(servicesData));

    return { services };
  } catch (error) {
    console.error("Failed to fetch services data:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: errorMessage };
  }
}

export default async function ServicesPage() {
  const { services, error } = await getServicesData();

  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Services & Features</h1>
      <ServiceManager initialServices={services || []} />
    </div>
  );
}