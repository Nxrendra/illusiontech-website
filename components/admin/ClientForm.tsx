'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { IClient } from '@/lib/models/Client';

type SerializedClient = Omit<IClient, 'joinedDate' | '_id'> & {
  _id: string;
  joinedDate: string;
};

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: SerializedClient) => void;
  client: SerializedClient | null;
  servicePlans: string[];
}

const statuses = ['Active', 'Inactive', 'On-Hold', 'Completed'];

export default function ClientForm({ isOpen, onClose, onSave, client, servicePlans }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    servicePlan: servicePlans[0] || '',
    status: 'Active',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        servicePlan: client.servicePlan || servicePlans[0] || '',
        status: client.status || 'Active',
      });
    } else {
      setFormData({ name: '', email: '', servicePlan: servicePlans[0] || '', status: 'Active' });
    }
  }, [client, isOpen, servicePlans]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const url = client ? `/api/admin/clients/${client._id}` : '/api/admin/clients';
    const method = client ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save client.');
      }

      toast.success(`Client ${client ? 'updated' : 'added'} successfully!`);
      onSave(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>{client ? 'Update the details for this client.' : 'Fill in the details for the new client.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="client-form" className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">Name</label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right">Email</label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="servicePlan" className="text-right">Plan</label>
            <Select value={formData.servicePlan} onValueChange={(value) => setFormData({ ...formData, servicePlan: value })}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a plan" /></SelectTrigger>
              <SelectContent>{servicePlans.map(plan => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="text-right">Status</label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a status" /></SelectTrigger>
              <SelectContent>{statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="client-form" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {client ? 'Save Changes' : 'Add Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}