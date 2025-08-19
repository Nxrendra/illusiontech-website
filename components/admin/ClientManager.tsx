'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Dynamically import the Modal component. It will only be loaded when the user needs it.
const Modal = dynamic(() => import('./Modal'));

const servicePlans = ['None', 'Solo', 'Basic', 'Pro', 'Elite'];
const statuses = ['Active', 'Paused', 'Inactive'];

// This type represents the client data after being serialized for the client-side.
// It should match the structure of the data passed from the server component.
export type Client = {
  _id: string;
  name: string;
  email:string;
  company?: string;
  servicePlan?: string;
  status?: string;
  notes?: string;
  joinedDate: string;
};

export default function ClientManager({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});

  const openModalForNew = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', company: '', servicePlan: 'None', status: 'Active', notes: '' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (client: Client) => {
    setEditingClient(client);
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingClient ? `/api/clients/${editingClient._id}` : '/api/clients';
    const method = editingClient ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const savedClient = await response.json();
      if (editingClient) {
        setClients(clients.map(c => c._id === savedClient._id ? savedClient : c));
      } else {
        setClients([...clients, savedClient]);
      }
      setIsModalOpen(false);
    } else {
      alert('Failed to save client.');
    }
  };

  const handleDelete = async (clientId: string | any) => {
    if (confirm('Are you sure you want to delete this client?')) {
      const response = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
      if (response.ok) {
        setClients(clients.filter(c => c._id !== clientId));
      } else {
        alert('Failed to delete client.');
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
        <Button onClick={openModalForNew}>
          <Plus size={18} className="mr-2" />
          Add Client
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client._id as string}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.company || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                         client.servicePlan === 'Solo'
                        ? 'bg-yellow-100 text-yellow-800'
                        : client.servicePlan === 'Pro'
                        ? 'bg-blue-100 text-blue-800'
                        : client.servicePlan === 'Elite'
                        ? 'bg-purple-100 text-purple-800'
                        : client.servicePlan === 'Basic'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {client.servicePlan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModalForEdit(client)} className="text-accent hover:text-accent-hover mr-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(client._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Edit Client' : 'Add New Client'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
            <input type="text" name="company" id="company" value={formData.company || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
          </div>
          <div>
            <label htmlFor="servicePlan" className="block text-sm font-medium text-gray-700">Service Plan</label>
            <select name="servicePlan" id="servicePlan" value={formData.servicePlan || 'None'} onChange={handleFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md">
              {servicePlans.map(plan => <option key={plan} value={plan}>{plan}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status || 'Active'} onChange={handleFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md">
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleFormChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"></textarea>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Client</Button>
          </div>
        </form>
      </Modal>}
    </div>
  );
}
