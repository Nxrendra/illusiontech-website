'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { ILegalDocumentData } from '@/lib/models/LegalDocument';
import { createOrUpdateLegalDocument, deleteLegalDocument } from '@/lib/actions/legal.actions';
import { Loader2 } from 'lucide-react';

export default function LegalDocumentEditor({ initialData }: { initialData: (ILegalDocumentData & { _id?: string }) | null }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    isPublished: initialData?.isPublished || false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving document...');
    try {
      const result = await createOrUpdateLegalDocument(initialData?._id, formData);
      if (result.error) throw new Error(result.error);
      toast.success('Document saved successfully!', { id: toastId });
      // Redirect to the new slug if it changed
      if (initialData?.slug !== result.document!.slug) {
        router.push(`/admin/dashboard/legal/${result.document!.slug}`);
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?._id || !confirm('Are you sure you want to delete this document? This cannot be undone.')) return;
    setIsDeleting(true);
    const toastId = toast.loading('Deleting document...');
    try {
      await deleteLegalDocument(initialData._id);
      toast.success('Document deleted.', { id: toastId });
      router.push('/admin/dashboard/legal');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete.', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2"><Label htmlFor="title">Document Title</Label><Input id="title" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Terms of Service" /></div>
      <div className="space-y-2"><Label>Content</Label><RichTextEditor value={formData.content} onChange={(v) => setFormData(p => ({ ...p, content: v }))} /></div>
      <div className="flex items-center space-x-2"><Switch id="isPublished" checked={formData.isPublished} onCheckedChange={(c) => setFormData(p => ({ ...p, isPublished: c }))} /><Label htmlFor="isPublished">Published</Label></div>
      <div className="flex justify-between items-center">
        <div>{initialData && (<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete Document'}</Button>)}</div>
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Document'}</Button>
      </div>
    </div>
  );
}