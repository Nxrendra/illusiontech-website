'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2 } from 'lucide-react';
import { ISettings } from '@/lib/models/Settings';
import { updateSettings } from '@/lib/actions/settings.actions';

interface GeneralSettingsFormProps {
  settings: Partial<ISettings>;
}

export function GeneralSettingsForm({ settings }: GeneralSettingsFormProps) {
  const [formData, setFormData] = useState({
    siteName: settings.siteName || '',
    siteDescription: settings.siteDescription || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      toast.success('General settings updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Update your site's public name and description for SEO.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="siteName">Site Name</Label><Input id="siteName" name="siteName" value={formData.siteName} onChange={handleInputChange} /></div>
          <div className="space-y-2"><Label htmlFor="siteDescription">Site Description</Label><Input id="siteDescription" name="siteDescription" value={formData.siteDescription} onChange={handleInputChange} /></div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></CardFooter>
      </form>
    </Card>
  );
}

