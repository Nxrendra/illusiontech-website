'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { PlusCircle, XCircle } from 'lucide-react';

interface KeyFeatureManagementProps {
  keyFeatures: { title: string; description: string; section?: string }[];
  onKeyFeatureChange: (index: number, field: 'title' | 'description' | 'section', value: string) => void;
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
    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Key Features (for Service Pages)</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onAddKeyFeature}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Key Feature
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Manage the detailed feature sections for dedicated service pages. Use the 'Section' field to group features. The order of features within the same section will be preserved on the page.
        <br />
        Example section names: <code>services</code>, <code>process</code>, <code>philosophy</code>, <code>why-us</code>, <code>focus</code>.
      </p>
      <div className="space-y-4">
        {keyFeatures.map((kf, index) => (
          <div key={index} className="flex items-start gap-4 rounded-md border p-4">
            <div className="flex-grow space-y-2">
              <div className="space-y-1">
                <Label htmlFor={`kf-section-${index}`}>Section Name</Label>
                <Input
                  id={`kf-section-${index}`}
                  value={kf.section || ''}
                  onChange={(e) => onKeyFeatureChange(index, 'section', e.target.value)}
                  placeholder="e.g., services, process, why-us"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`kf-title-${index}`}>Title</Label>
                <Input
                  id={`kf-title-${index}`}
                  value={kf.title}
                  onChange={(e) => onKeyFeatureChange(index, 'title', e.target.value)}
                  placeholder="Feature Title"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`kf-desc-${index}`}>Description</Label>
                <Textarea
                  id={`kf-desc-${index}`}
                  value={kf.description}
                  onChange={(e) => onKeyFeatureChange(index, 'description', e.target.value)}
                  placeholder="Feature Description"
                  rows={3}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveKeyFeature(index)}
              className="mt-6 text-destructive hover:bg-destructive/10"
              aria-label="Remove Key Feature"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
        {keyFeatures.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">No key features added yet. Click "Add Key Feature" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}