'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import ServiceList from './ServiceList';
import { IServiceData } from '@/lib/models/Service';

type SerializedService = IServiceData & {
  _id: string;
  createdAt: string;
};

interface DashboardServicePreviewProps {
  services: SerializedService[];
}

export function DashboardServicePreview({ services }: DashboardServicePreviewProps) {
  const featuredServices = services.filter(s => s.featured);
  const coreServices = services.filter(s => s.isCoreService && !s.featured);
  const otherServices = services.filter(s => !s.featured && !s.isCoreService);

  return (
    <Tabs defaultValue="featured" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="featured">Featured ({featuredServices.length})</TabsTrigger>
        <TabsTrigger value="core">Core ({coreServices.length})</TabsTrigger>
        <TabsTrigger value="other">Other ({otherServices.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="featured" className="mt-4">
        <ServiceList services={featuredServices} isReadOnly={true} />
      </TabsContent>
      <TabsContent value="core" className="mt-4">
        <ServiceList services={coreServices} isReadOnly={true} />
      </TabsContent>
      <TabsContent value="other" className="mt-4">
        <ServiceList services={otherServices} isReadOnly={true} />
      </TabsContent>
    </Tabs>
  );
}