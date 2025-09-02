'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { IPageContentData } from '@/lib/models/PageContent';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Loader2 } from 'lucide-react';

export default function LegalContentEditor({ initialContent }: { initialContent: IPageContentData }) {
  const router = useRouter();
  const [content, setContent] = useState({
    termsOfServiceContent: initialContent.termsOfServiceContent || '',
    privacyPolicyContent: initialContent.privacyPolicyContent || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleContentChange = (field: keyof typeof content, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving legal documents...');

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Failed to save documents.');
      }

      toast.success('Documents saved successfully!', { id: toastId });
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Save error:', error);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>
        <TabsContent value="terms" className="mt-4">
          <RichTextEditor value={content.termsOfServiceContent} onChange={(v) => handleContentChange('termsOfServiceContent', v)} placeholder="Enter the terms of service here..." />
        </TabsContent>
        <TabsContent value="privacy" className="mt-4">
          <RichTextEditor value={content.privacyPolicyContent} onChange={(v) => handleContentChange('privacyPolicyContent', v)} placeholder="Enter the privacy policy here..." />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="large">
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Documents'}
        </Button>
      </div>
    </div>
  );
}