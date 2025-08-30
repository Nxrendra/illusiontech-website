'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BreakdownList } from './BreakdownList';
import { BreakdownForm } from './BreakdownForm';
import { IPriceBreakdown } from '@/lib/models/PriceBreakdown';

type SerializedBreakdown = IPriceBreakdown & { serviceId: { _id: string, name: string } };

interface BreakdownManagerProps {
  initialBreakdowns: SerializedBreakdown[];
  services: { _id: string; name: string }[];
}

export default function BreakdownManager({ initialBreakdowns, services }: BreakdownManagerProps) {
  const [breakdowns, setBreakdowns] = useState(initialBreakdowns);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<SerializedBreakdown | null>(null);

  const handleOpenForm = (breakdown: SerializedBreakdown | null = null) => {
    setSelectedBreakdown(breakdown);
    setIsFormOpen(true);
  };

  const handleSave = (savedBreakdown: IPriceBreakdown) => {
    // This is a bit of a hack to update the list without a full re-fetch
    const service = services.find(s => s._id === savedBreakdown.serviceId.toString());
    const displayData = { ...savedBreakdown, serviceId: { _id: service?._id || '', name: service?.name || 'N/A' } };

    if (selectedBreakdown) {
      setBreakdowns(prev => prev.map(b => b._id === savedBreakdown._id ? displayData : b));
    } else {
      setBreakdowns(prev => [displayData, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setBreakdowns(prev => prev.filter(b => b._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => handleOpenForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add Breakdown</Button></div>
      <BreakdownList breakdowns={breakdowns} onEdit={handleOpenForm} onDelete={handleDelete} />
      {isFormOpen && <BreakdownForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} breakdown={selectedBreakdown} services={services} />}
    </div>
  );
}

