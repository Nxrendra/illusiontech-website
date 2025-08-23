import { connectToDB } from '@/lib/mongoose';
import { verifyAdminSession } from '@/lib/auth-utils';
import ServiceModel, { IServiceData } from '@/lib/models/Service';
import ServiceManager from '@/components/admin/ServiceManager';

type SerializedService = IServiceData & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface ServicesPageData {
  services?: SerializedService[];
  error?: string;
}

async function getServices(): Promise<ServicesPageData> {
  try {
    await verifyAdminSession();
    await connectToDB();

    const servicesData = await ServiceModel.find({}).sort({ name: 1 }).lean();

    return { services: JSON.parse(JSON.stringify(servicesData)) };
  } catch (error) {
    console.error("Failed to fetch services:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: errorMessage };
  }
}

export default async function ServicesPage() {
  const { services, error } = await getServices();

  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
      <ServiceManager initialServices={services || []} />
    </div>
  );
}