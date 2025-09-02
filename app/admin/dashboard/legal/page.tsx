import { AdminHeader } from '@/components/admin/AdminHeader';
import LegalDocumentList from './LegalDocumentList';
import { getLegalDocuments } from '@/lib/actions/legal.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import LegalContentEditor from './LegalContentEditor';
import { getPageContent } from '@/lib/data/pageContent';

export const dynamic = 'force-dynamic';

export default async function AdminLegalPage() {
  const [documents, pageContent] = await Promise.all([
    getLegalDocuments(),
    getPageContent(),
  ]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title="Legal Documents" />
      <Tabs defaultValue="dynamic-docs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dynamic-docs">Dynamic Documents</TabsTrigger>
          <TabsTrigger value="legacy-content">Legacy Content (TOS & Privacy)</TabsTrigger>
        </TabsList>
        <TabsContent value="dynamic-docs" className="mt-4">
          <LegalDocumentList initialDocuments={documents} />
        </TabsContent>
        <TabsContent value="legacy-content" className="mt-4">
          <LegalContentEditor initialContent={pageContent} />
        </TabsContent>
      </Tabs>
    </main>
  );
}