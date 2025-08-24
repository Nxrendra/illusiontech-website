'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import { Loader2, PlusCircle, XCircle } from 'lucide-react';
import { IService, IServiceData } from '@/lib/models/Service';

type SerializedService = IServiceData & {
  _id: string;
};

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: SerializedService) => void;
  service: SerializedService | null;
}

const serviceTypes: IService['type'][] = ['web-development', 'design', 'automation', 'support', 'support-main'];

const initialFormData: Omit<IServiceData, 'icon' | 'slug' | 'link'> = {
  name: '',
  description: '',
  longDescription: '',
  price: '',
  timeline: '',
  type: 'web-development',
  featured: false,
  isCoreService: false,
  audience: '',
  features: [],
  keyFeatures: [],
  theme: {
    gradient: '',
    accentClass: '',
    buttonClass: '',
  },
};

export default function ServiceForm({ isOpen, onClose, onSave, service }: ServiceFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (service) {
        setFormData({
          // We don't include 'id' or '_id' in the form's state
          name: service.name || '',
          description: service.description || '',
          longDescription: service.longDescription || '',
          price: service.price || '',
          timeline: service.timeline || '',
          type: service.type || 'web-development',
          featured: service.featured || false,
          isCoreService: service.isCoreService || false,
          audience: service.audience || '',
          features: service.features || [],
          keyFeatures: service.keyFeatures || [],
          theme: service.theme || { gradient: '', accentClass: '', buttonClass: '' },
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [service, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) }));
  };

  const handleKeyFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const newKeyFeatures = [...(formData.keyFeatures || [])];
    newKeyFeatures[index] = { ...newKeyFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, keyFeatures: newKeyFeatures }));
  };

  const addKeyFeature = () => {
    setFormData(prev => ({ ...prev, keyFeatures: [...(prev.keyFeatures || []), { title: '', description: '' }] }));
  };

  const removeKeyFeature = (index: number) => {
    setFormData(prev => ({ ...prev, keyFeatures: (prev.keyFeatures || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const url = service ? `/api/admin/services/${service._id}` : '/api/admin/services';
    const method = service ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save service.');
      }

      toast.success(`Service ${service ? 'updated' : 'added'} successfully!`);
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>{service ? 'Update the details for this service.' : 'Fill in the details for the new service.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="service-form" className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="name">Service Name</Label><Input id="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label htmlFor="type">Service Type</Label><Select value={formData.type} onValueChange={(value: IService['type']) => setFormData({ ...formData, type: value })}><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger><SelectContent>{serviceTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label htmlFor="description">Short Description</Label><Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="A brief summary for service cards." /></div>
          <div className="space-y-2"><Label htmlFor="longDescription">Detailed Description</Label><Textarea id="longDescription" value={formData.longDescription} onChange={handleInputChange} placeholder="A detailed description for the service page." rows={4} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="price">Price (TTD)</Label><Input id="price" value={formData.price} onChange={handleInputChange} placeholder="$500 - $700 TTD or $250/month" /></div>
            <div className="space-y-2"><Label htmlFor="timeline">Timeline</Label><Input id="timeline" value={formData.timeline} onChange={handleInputChange} placeholder="e.g., 1-2 Weeks" /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="audience">Target Audience</Label><Input id="audience" value={formData.audience || ''} onChange={handleInputChange} placeholder="e.g., Small Businesses, Startups" /></div>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center space-x-2"><Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} /><Label htmlFor="featured">Featured Service</Label></div>
            <div className="flex items-center space-x-2"><Switch id="isCoreService" checked={formData.isCoreService} onCheckedChange={(checked) => setFormData({ ...formData, isCoreService: checked })} /><Label htmlFor="isCoreService">Core Service</Label></div>
          </div>

          {/* Features Management */}
          <div className="space-y-4 rounded-md border p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Features</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addFeature}><PlusCircle className="mr-2 h-4 w-4" /> Add Feature</Button>
            </div>
            <div className="space-y-2">
              {(formData.features || []).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} placeholder={`Feature #${index + 1}`} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features Management */}
          <div className="space-y-4 rounded-md border p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Key Features</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addKeyFeature}><PlusCircle className="mr-2 h-4 w-4" /> Add Key Feature</Button>
            </div>
            {(formData.keyFeatures || []).map((kf, index) => (
              <div key={index} className="space-y-2 rounded-md border p-3 relative bg-background">
                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeKeyFeature(index)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                <div className="space-y-1"><Label htmlFor={`kf-title-${index}`}>Title</Label><Input id={`kf-title-${index}`} value={kf.title} onChange={(e) => handleKeyFeatureChange(index, 'title', e.target.value)} /></div>
                <div className="space-y-1"><Label htmlFor={`kf-desc-${index}`}>Description</Label><Textarea id={`kf-desc-${index}`} value={kf.description} onChange={(e) => handleKeyFeatureChange(index, 'description', e.target.value)} rows={2} /></div>
              </div>
            ))}
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="service-form" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {service ? 'Save Changes' : 'Add Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}