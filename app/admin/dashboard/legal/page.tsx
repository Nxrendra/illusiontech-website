import { AdminHeader } from '@/components/admin/AdminHeader';
import LegalContentEditor from './LegalContentEditor';
import { getPageContent } from '@/lib/data/pageContent';

export const dynamic = 'force-dynamic';

export default async function AdminLegalPage() {
  const content = await getPageContent();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex flex-col gap-4">
        <AdminHeader title="Legal Documents Content" />
        <LegalContentEditor initialContent={content} />
      </div>
    </main>
  );
}