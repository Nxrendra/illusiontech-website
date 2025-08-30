'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { SecuritySettingsForm } from './SecuritySettingsForm';
import { ISettings } from '@/lib/models/Settings';

interface SettingsManagerProps {
  settings: Partial<ISettings>;
}

export default function SettingsManager({ settings }: SettingsManagerProps) {
  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="appearance" disabled>Appearance</TabsTrigger>
        <TabsTrigger value="advanced" disabled>Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="general"><GeneralSettingsForm settings={settings} /></TabsContent>
      <TabsContent value="security"><SecuritySettingsForm /></TabsContent>
    </Tabs>
  );
}

