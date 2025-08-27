'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { IServiceData } from '@/lib/models/Service';
import ServiceList from './ServiceList';
import ServiceForm from './ServiceForm';

type SerializedService = IServiceData & {
  _id: string;
};

interface ServiceManagerProps {
  initialServices: SerializedService[];
}

export default function ServiceManager({ initialServices }: ServiceManagerProps) {
  const [services, setServices] = useState(initialServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<SerializedService | null>(null);

  const handleAddClick = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (service: SerializedService) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleSave = (savedService: SerializedService) => {
    let updatedServices;
    if (editingService) {
      // Update existing service
      updatedServices = services.map((s) => (s._id === savedService._id ? savedService : s));
    } else {
      // Add new service
      updatedServices = [savedService, ...services];
    }
    // Re-sort the services array to match the server-side sorting
    updatedServices.sort((a, b) => {
      const posA = a.position ?? 99;
      const posB = b.position ?? 99;
      if (posA !== posB) return posA - posB;
      return a.name.localeCompare(b.name);
    });
    setServices(updatedServices);
    handleFormClose();
  };

  const handleRemove = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete service.');
      }

      setServices(services.filter((s) => s._id !== serviceId));
      toast.success('Service removed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-muted/50 p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Service Offerings</h2>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <ServiceList services={services} onEdit={handleEditClick} onRemove={handleRemove} />

      <ServiceForm isOpen={isFormOpen} onClose={handleFormClose} onSave={handleSave} service={editingService} />
    </div>
  );
}
