'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import { IClient } from '@/lib/models/Client';

type SerializedClient = Omit<IClient, 'joinedDate' | '_id'> & {
  _id: string;
  joinedDate: string;
};

interface ClientManagerProps {
  initialClients: SerializedClient[];
}

export default function ClientManager({ initialClients }: ClientManagerProps) {
  const [clients, setClients] = useState(initialClients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<SerializedClient | null>(null);

  const handleAddClick = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (client: SerializedClient) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleSave = (savedClient: SerializedClient) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map((c) => (c._id === savedClient._id ? savedClient : c)));
    } else {
      // Add new client
      setClients([savedClient, ...clients]);
    }
    handleFormClose();
  };

  const handleRemove = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete client.');
      }

      setClients(clients.filter((c) => c._id !== clientId));
      toast.success('Client removed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-muted/50 p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Client Roster</h2>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      <ClientList clients={clients} onEdit={handleEditClick} onRemove={handleRemove} />

      <ClientForm isOpen={isFormOpen} onClose={handleFormClose} onSave={handleSave} client={editingClient} />
    </div>
  );
}