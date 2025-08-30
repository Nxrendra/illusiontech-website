'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PlusCircle, XCircle } from 'lucide-react';

interface OptionListManagementProps {
  title: string;
  description: string;
  options: { value: string; label: string }[];
  onOptionChange: (index: number, field: 'value' | 'label', value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export default function OptionListManagement({
  title,
  description,
  options,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: OptionListManagementProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onAddOption}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Option
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="space-y-4">
        {(options || []).map((opt, index) => (
          <div key={index} className="flex items-end gap-4 rounded-md border p-4">
            <div className="grid grid-cols-2 gap-4 flex-grow">
              <div className="space-y-1">
                <Label htmlFor={`opt-label-${index}`}>Label</Label>
                <Input
                  id={`opt-label-${index}`}
                  value={opt.label}
                  onChange={(e) => onOptionChange(index, 'label', e.target.value)}
                  placeholder="e.g., 1-2 Weeks"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`opt-value-${index}`}>Value</Label>
                <Input
                  id={`opt-value-${index}`}
                  value={opt.value}
                  onChange={(e) => onOptionChange(index, 'value', e.target.value)}
                  placeholder="e.g., 1-2w"
                />
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveOption(index)} className="text-destructive hover:bg-destructive/10" aria-label="Remove Option">
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
        {(options || []).length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">No options added yet. Click "Add Option" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}

