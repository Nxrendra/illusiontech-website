'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2, PlusCircle, XCircle } from 'lucide-react';
import { IPriceBreakdownData } from '@/lib/models/PriceBreakdown';
import { createPriceBreakdown, updatePriceBreakdown } from '@/lib/actions/priceBreakdown.actions';

type SerializedBreakdown = Omit<IPriceBreakdownData, 'serviceId'> & { _id: string; serviceId: { _id: string; name: string } };
type ServiceSelectItem = { _id: string; name: string };

interface BreakdownFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (breakdown: IPriceBreakdownData & { _id: string }) => void;
  breakdown: SerializedBreakdown | null;
  services: ServiceSelectItem[];
}

type BreakdownFormData = Omit<IPriceBreakdownData, 'slug' | 'serviceId'> & { serviceId: string };

const initialFormData: BreakdownFormData = { title: '', serviceId: '', summary: '', priceRange: '', timeframe: '', sections: [], notes: '' };

export function BreakdownForm({ isOpen, onClose, onSave, breakdown, services }: BreakdownFormProps) {
  const [formData, setFormData] = useState<BreakdownFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (breakdown) {
        // Destructure to create a clean form data object without the `_id` from the breakdown prop.
        const { title, summary, priceRange, timeframe, sections, notes, serviceId } = breakdown;
        setFormData({ title, summary, priceRange, timeframe, sections, notes: notes || '', serviceId: serviceId._id });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [breakdown, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSectionChange = (sectionIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex] = { ...newSections[sectionIndex], [e.target.name]: e.target.value };
    setFormData(p => ({ ...p, sections: newSections }));
  };
  const handleItemChange = (sectionIndex: number, itemIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].items[itemIndex] = { ...newSections[sectionIndex].items[itemIndex], [e.target.name]: e.target.value };
    setFormData(p => ({ ...p, sections: newSections }));
  };

  const addSection = () => setFormData(p => ({ ...p, sections: [...p.sections, { title: '', totalPrice: '', idealFor: '', description: '', items: [] }] }));
  const removeSection = (sectionIndex: number) => setFormData(p => ({ ...p, sections: p.sections.filter((_, i) => i !== sectionIndex) }));
  const addItem = (sectionIndex: number) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].items.push({ name: '', price: '' });
    setFormData(p => ({ ...p, sections: newSections }));
  };
  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    setFormData(p => ({ ...p, sections: newSections }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!formData.serviceId) {
      toast.error('Please link the breakdown to a service.');
      setIsSaving(false);
      return;
    }

    try {
      const result = breakdown ? await updatePriceBreakdown(breakdown._id, formData) : await createPriceBreakdown(formData);
      if (result.success && result.data) {
        toast.success(`Breakdown ${breakdown ? 'updated' : 'created'} successfully!`);
        onSave(result.data);
      } else {
        // Use a more specific error message if the server provides one.
        throw new Error(result.error || 'An unknown error occurred on the server.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{breakdown ? 'Edit' : 'Add'} Price Breakdown</DialogTitle><DialogDescription>Manage the detailed price breakdown for a service.</DialogDescription></DialogHeader>
        <form id="breakdown-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Main Details */}
          <div className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="title">Document Title</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label htmlFor="serviceId">Link to Service</Label><Select name="serviceId" value={formData.serviceId} onValueChange={(val) => setFormData(p => ({ ...p, serviceId: val }))} required><SelectTrigger><SelectValue placeholder="Select a service..." /></SelectTrigger><SelectContent>{services.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label htmlFor="summary">Summary</Label><Textarea id="summary" name="summary" value={formData.summary} onChange={handleInputChange} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="priceRange">Price Range</Label><Input id="priceRange" name="priceRange" value={formData.priceRange} onChange={handleInputChange} placeholder="e.g., $500 - $700 TTD" required /></div>
              <div className="space-y-2"><Label htmlFor="timeframe">Timeframe</Label><Input id="timeframe" name="timeframe" value={formData.timeframe} onChange={handleInputChange} placeholder="e.g., 3-5 days" required /></div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Package Tiers / Sections</Label>
            {formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="p-4 border rounded-lg space-y-4 relative">
                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeSection(sectionIndex)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Section Title</Label><Input name="title" value={section.title} onChange={(e) => handleSectionChange(sectionIndex, e)} placeholder="e.g., Base Package – 500 TTD" /></div>
                  <div className="space-y-2"><Label>Total Price</Label><Input name="totalPrice" value={section.totalPrice} onChange={(e) => handleSectionChange(sectionIndex, e)} placeholder="e.g., 500 TTD" /></div>
                </div>
                <div className="space-y-2"><Label>Ideal For</Label><Input name="idealFor" value={section.idealFor || ''} onChange={(e) => handleSectionChange(sectionIndex, e)} placeholder="e.g., Freelancers, Artists" /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea name="description" value={section.description || ''} onChange={(e) => handleSectionChange(sectionIndex, e)} placeholder="e.g., Includes all base features..." rows={2} /></div>
                
                {/* Items */}
                <div className="space-y-3 pt-2">
                  <Label>Features / Items</Label>
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                      <div className="md:col-span-3 space-y-1"><Label className="text-xs">Item Name</Label><Input name="name" value={item.name} onChange={(e) => handleItemChange(sectionIndex, itemIndex, e)} /></div>
                      <div className="md:col-span-2 space-y-1"><Label className="text-xs">Price</Label><Input name="price" value={item.price} onChange={(e) => handleItemChange(sectionIndex, itemIndex, e)} placeholder="e.g., 100 TTD or Included" /></div>
                      <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeItem(sectionIndex, itemIndex)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem(sectionIndex)}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addSection}><PlusCircle className="mr-2 h-4 w-4" />Add Package Tier</Button>
          </div>

          {/* Notes */}
          <div className="p-4 border rounded-lg space-y-2">
            <Label htmlFor="notes">Final Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={3} placeholder="e.g., The database is included in all packages..." />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="breakdown-form" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Breakdown</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
