'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { IPageContentData, IPageContent } from '@/lib/models/PageContent';
import OptionListManagement from './OptionListManagement';

interface PageContentManagerProps {
  initialContent: IPageContentData;
}

export default function PageContentManager({ initialContent }: PageContentManagerProps) {
  const [formData, setFormData] = useState<IPageContentData>(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (listName: keyof IPageContentData, index: number, field: 'value' | 'label', value: string) => {
    const list = [...(formData[listName] as { value: string; label: string }[] || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData(prev => ({ ...prev, [listName]: list }));
  };

  const handleAddOption = (listName: keyof IPageContentData) => {
    setFormData(prev => ({ ...prev, [listName]: [...(prev[listName] as any[] || []), { value: '', label: '' }] }));
  };

  const handleRemoveOption = (listName: keyof IPageContentData, index: number) => {
    setFormData(prev => ({ ...prev, [listName]: (prev[listName] as any[] || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save content.');
      }

      toast.success('Page content updated successfully!');
      setFormData(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-6 bg-background rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Contact Page</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground pt-2 border-t">Hero Section</h3>
          <div><Label htmlFor="contactHeroHeading">Hero Heading</Label><Input id="contactHeroHeading" name="contactHeroHeading" value={formData.contactHeroHeading || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactHeroSubheading">Hero Subheading</Label><Textarea id="contactHeroSubheading" name="contactHeroSubheading" value={formData.contactHeroSubheading || ''} onChange={handleInputChange} /></div>
          
          <h3 className="text-lg font-semibold text-muted-foreground pt-4 border-t mt-6">Contact Info Section</h3>
          <div><Label htmlFor="contactInfoHeading">Info Section Heading</Label><Input id="contactInfoHeading" name="contactInfoHeading" value={formData.contactInfoHeading || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactInfoSubheading">Info Section Subheading</Label><Textarea id="contactInfoSubheading" name="contactInfoSubheading" value={formData.contactInfoSubheading || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactEmail">Email Address</Label><Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactPhone">Phone Number</Label><Input id="contactPhone" name="contactPhone" value={formData.contactPhone || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactAddress">Address / Location</Label><Input id="contactAddress" name="contactAddress" value={formData.contactAddress || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactWorkingHours">Working Hours</Label><Textarea id="contactWorkingHours" name="contactWorkingHours" value={formData.contactWorkingHours || ''} onChange={handleInputChange} placeholder="Mon - Fri: 9am - 5pm..." rows={3} /><p className="text-xs text-muted-foreground">Use line breaks for multiple lines.</p></div>

          <h3 className="text-lg font-semibold text-muted-foreground pt-4 border-t mt-6">Contact Form Steps</h3>
          <div><Label htmlFor="contactFormStep1Heading">Step 1 Heading</Label><Input id="contactFormStep1Heading" name="contactFormStep1Heading" value={formData.contactFormStep1Heading || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactFormStep2Heading">Step 2 Heading</Label><Input id="contactFormStep2Heading" name="contactFormStep2Heading" value={formData.contactFormStep2Heading || ''} onChange={handleInputChange} /></div>
          <div><Label htmlFor="contactFormStep3Heading">Step 3 Heading</Label><Input id="contactFormStep3Heading" name="contactFormStep3Heading" value={formData.contactFormStep3Heading || ''} onChange={handleInputChange} /></div>
        </div>
      </div>

      <OptionListManagement
        title="Project Timelines"
        description="Options for the 'Project Timeline' dropdown in the contact form."
        options={formData.projectTimelines || []}
        onOptionChange={(index, field, value) => handleOptionChange('projectTimelines', index, field, value)}
        onAddOption={() => handleAddOption('projectTimelines')}
        onRemoveOption={(index) => handleRemoveOption('projectTimelines', index)}
      />

      <OptionListManagement
        title="Maintenance Contract Lengths"
        description="Options for the 'Contract Length' dropdown for maintenance plans."
        options={formData.maintenanceContractLengths || []}
        onOptionChange={(index, field, value) => handleOptionChange('maintenanceContractLengths', index, field, value)}
        onAddOption={() => handleAddOption('maintenanceContractLengths')}
        onRemoveOption={(index) => handleRemoveOption('maintenanceContractLengths', index)}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save All Content
        </Button>
      </div>
    </form>
  );
}