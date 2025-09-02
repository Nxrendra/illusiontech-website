'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { IPageContentData } from '@/lib/models/PageContent';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function LegalContentEditor({ initialContent }: { initialContent: IPageContentData }) {
  const router = useRouter();
  const [content, setContent] = useState({
    contractContent: initialContent.contractContent || '',
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
      const response = await fetch('/api/admin/page-content', {
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
      <Tabs defaultValue="contract" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contract">Service Contract</TabsTrigger>
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>
        <TabsContent value="contract" className="mt-4">
          <RichTextEditor value={content.contractContent} onChange={(v) => handleContentChange('contractContent', v)} placeholder="Enter the service contract terms here..." />
        </TabsContent>
        <TabsContent value="terms" className="mt-4">
          <RichTextEditor value={content.termsOfServiceContent} onChange={(v) => handleContentChange('termsOfServiceContent', v)} placeholder="Enter the terms of service here..." />
        </TabsContent>
        <TabsContent value="privacy" className="mt-4">
          <RichTextEditor value={content.privacyPolicyContent} onChange={(v) => handleContentChange('privacyPolicyContent', v)} placeholder="Enter the privacy policy here..." />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="large">
          {isSaving ? 'Saving...' : 'Save All Documents'}
        </Button>
      </div>
    </div>
  );
}