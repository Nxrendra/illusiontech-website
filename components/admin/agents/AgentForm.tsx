'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2 } from 'lucide-react';
import { IAgent } from '@/lib/models/Agent';
import { createAgent, updateAgent } from '@/lib/actions/agent.actions';

interface AgentFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  agent: IAgent | null;
  onAgentAdd: (agent: IAgent) => void;
  onAgentUpdate: (agent: IAgent) => void;
}

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  bankAccountNumber: '',
  commissionRate: 0,
  status: 'Active' as 'Active' | 'Inactive',
  notes: '',
};

export function AgentForm({ isOpen, setIsOpen, agent, onAgentAdd, onAgentUpdate }: AgentFormProps) {
  const [formData, setFormData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (agent) {
        setFormData({
          fullName: agent.fullName, email: agent.email, phone: agent.phone,
          companyName: agent.companyName, bankAccountNumber: agent.bankAccountNumber || '',
          commissionRate: agent.commissionRate, status: agent.status, notes: agent.notes || '',
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [agent, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = { ...formData, commissionRate: Number(formData.commissionRate) || 0 };
      const result = agent ? await updateAgent(agent._id, dataToSave) : await createAgent(dataToSave);

      if (result.success && result.data) {
        toast.success(`Agent ${agent ? 'updated' : 'created'} successfully!`);
        if (agent) onAgentUpdate(result.data); else onAgentAdd(result.data);
        setIsOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{agent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
          <DialogDescription>{agent ? 'Update the details for this agent.' : 'Fill in the details for the new agent.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="companyName">Company Name</Label><Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="bankAccountNumber">Bank Account (Optional)</Label><Input id="bankAccountNumber" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="commissionRate">Commission Rate (%)</Label><Input id="commissionRate" name="commissionRate" type="number" value={formData.commissionRate} onChange={handleInputChange} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="status">Status</Label><Select name="status" value={formData.status} onValueChange={(value) => setFormData(p => ({...p, status: value as any}))}><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="notes">Notes (Internal)</Label><Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any internal notes about this agent..." /></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{agent ? 'Save Changes' : 'Create Agent'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

