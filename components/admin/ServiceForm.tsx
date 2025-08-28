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
import { iconNames } from '@/lib/get-icon';
import { themeOptions, themeMap } from '@/lib/theme-options';
import FeatureManagement from './FeatureManagement';
import KeyFeatureManagement from './KeyFeatureManagement';

type SerializedService = IServiceData & {
  _id: string;
};

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: SerializedService) => void;
  service: SerializedService | null;
}

const serviceTypes: IService['type'][] = ['web-development', 'design', 'website-design', 'automation', 'support', 'support-main'];

const serviceTypeLabels: Record<IService['type'], string> = {
  'web-development': 'Web Development Package',
  'design': 'UI/UX Design Page',
  'website-design': 'Website Design Page',
  'automation': 'Automation Service Page',
  'support': 'Support Plan Item',
  'support-main': 'Support Page (Main)',
};

const defaultTheme = themeOptions[0];

const initialFormData: Omit<IServiceData, 'slug' | 'link'> = {
  name: '',
  icon: 'Code',
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
  position: 99,
  homepagePosition: 99,
  themeName: defaultTheme.name,
  theme: {
    gradient: defaultTheme.gradient,
    accentClass: defaultTheme.accentClass,
    buttonClass: defaultTheme.buttonClass,
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
          icon: service.icon || 'Code',
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
          position: service.position ?? 99,
          homepagePosition: service.homepagePosition ?? 99,
          themeName: service.themeName || 'Default',
          theme: service.theme || { gradient: '', accentClass: '', buttonClass: '' },
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [service, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  const handleThemeChange = (themeName: string) => {
    const selectedTheme = themeMap.get(themeName);
    if (selectedTheme) {
      setFormData(prev => ({
        ...prev,
        themeName: selectedTheme.name,
        theme: {
          gradient: selectedTheme.gradient,
          accentClass: selectedTheme.accentClass,
          buttonClass: selectedTheme.buttonClass,
        },
      }));
    }
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
        credentials: 'include', // Explicitly include cookies with the request
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
          <div className="space-y-2"><Label htmlFor="name">Service Name</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} required /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="position">General Position</Label><Input id="position" name="position" type="number" value={formData.position} onChange={handleInputChange} /><p className="text-xs text-muted-foreground">Order on /services page.</p></div>
            <div className="space-y-2"><Label htmlFor="homepagePosition">Homepage Position</Label><Input id="homepagePosition" name="homepagePosition" type="number" value={formData.homepagePosition} onChange={handleInputChange} /><p className="text-xs text-muted-foreground">Order on homepage carousel.</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label htmlFor="icon">Icon</Label><Select name="icon" value={formData.icon} onValueChange={(value: string) => setFormData({ ...formData, icon: value })}><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="themeName">Card Theme</Label><Select name="themeName" value={formData.themeName} onValueChange={handleThemeChange}><SelectTrigger><SelectValue placeholder="Select a theme" /></SelectTrigger><SelectContent>{themeOptions.map(theme => <SelectItem key={theme.name} value={theme.name}>{theme.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="type">Service Type</Label><Select name="type" value={formData.type} onValueChange={(value: IService['type']) => setFormData({ ...formData, type: value })}><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger><SelectContent>{serviceTypes.map(type => <SelectItem key={type} value={type}>{serviceTypeLabels[type]}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="price">Price (TTD)</Label><Input id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder="$500 - $700 TTD or $250/month" /></div>
            <div className="space-y-2"><Label htmlFor="timeline">Timeline</Label><Input id="timeline" name="timeline" value={formData.timeline} onChange={handleInputChange} placeholder="e.g., 1-2 Weeks" /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="description">Short Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="A brief summary for service cards." /></div>
          <div className="space-y-2"><Label htmlFor="longDescription">Detailed Description</Label><Textarea id="longDescription" name="longDescription" value={formData.longDescription} onChange={handleInputChange} placeholder="A detailed description for the service page." rows={4} /></div>
          <div className="space-y-2"><Label htmlFor="audience">Target Audience</Label><Input id="audience" name="audience" value={formData.audience || ''} onChange={handleInputChange} placeholder="e.g., Small Businesses, Startups" /></div>
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center space-x-2"><Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} /><Label htmlFor="featured">Featured Service</Label></div>
            <div className="flex items-center space-x-2"><Switch id="isCoreService" checked={formData.isCoreService} onCheckedChange={(checked) => setFormData({ ...formData, isCoreService: checked })} /><Label htmlFor="isCoreService">Core Service</Label></div>
          </div>

          <FeatureManagement features={formData.features || []} onFeatureChange={handleFeatureChange} onAddFeature={addFeature} onRemoveFeature={removeFeature} />

          <KeyFeatureManagement keyFeatures={formData.keyFeatures || []} onKeyFeatureChange={handleKeyFeatureChange} onAddKeyFeature={addKeyFeature} onRemoveKeyFeature={removeKeyFeature} />
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