'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { PlusCircle, XCircle } from 'lucide-react';

interface KeyFeature {
  title: string;
  description: string;
}

interface KeyFeatureManagementProps {
  keyFeatures: KeyFeature[];
  onKeyFeatureChange: (index: number, field: 'title' | 'description', value: string) => void;
  onAddKeyFeature: () => void;
  onRemoveKeyFeature: (index: number) => void;
}

export default function KeyFeatureManagement({
  keyFeatures,
  onKeyFeatureChange,
  onAddKeyFeature,
  onRemoveKeyFeature,
}: KeyFeatureManagementProps) {
  return (
    <div className="space-y-4 rounded-md border p-4 bg-muted/50">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Key Features</Label>
        <Button type="button" variant="ghost" size="sm" onClick={onAddKeyFeature}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Key Feature
        </Button>
      </div>
      {(keyFeatures || []).map((kf, index) => (
        <div key={index} className="space-y-2 rounded-md border p-3 relative bg-background">
          <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => onRemoveKeyFeature(index)}>
            <XCircle className="h-4 w-4 text-destructive" />
          </Button>
          <div className="space-y-1">
            <Label htmlFor={`kf-title-${index}`}>Title</Label>
            <Input id={`kf-title-${index}`} value={kf.title} onChange={(e) => onKeyFeatureChange(index, 'title', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`kf-desc-${index}`}>Description</Label>
            <Textarea id={`kf-desc-${index}`} value={kf.description} onChange={(e) => onKeyFeatureChange(index, 'description', e.target.value)} rows={2} />
          </div>
        </div>
      ))}
    </div>
  );
}