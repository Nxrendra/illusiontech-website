'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PlusCircle, XCircle } from 'lucide-react';

interface FeatureManagementProps {
  features: string[];
  onFeatureChange: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

export default function FeatureManagement({
  features,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
}: FeatureManagementProps) {
  return (
    <div className="space-y-4 rounded-md border p-4 bg-muted/50">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Features</Label>
        <Button type="button" variant="ghost" size="sm" onClick={onAddFeature}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
        </Button>
      </div>
      <div className="space-y-2">
        {(features || []).map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input value={feature} onChange={(e) => onFeatureChange(index, e.target.value)} placeholder={`Feature #${index + 1}`} />
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveFeature(index)}>
              <XCircle className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}