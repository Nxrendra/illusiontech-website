import { AdminHeader } from '@/components/admin/AdminHeader';
import { getLegalDocumentBySlug } from '@/lib/actions/legal.actions';
import LegalDocumentEditor from './LegalDocumentEditor';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditLegalDocumentPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const isNew = slug === 'new';
  const document = isNew ? null : await getLegalDocumentBySlug(slug);

  if (!isNew && !document) {
    notFound();
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title={isNew ? 'Create New Legal Document' : `Edit: ${document?.title}`} />
      <LegalDocumentEditor initialData={document} />
    </main>
  );
}