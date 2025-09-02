import type { Metadata } from 'next';
import { getLegalDocumentBySlug } from '@/lib/actions/legal.actions';
import { SanitizeHTML } from '@/components/SanitizeHTML';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const document = await getLegalDocumentBySlug(params.slug);
  if (!document || !document.isPublished) {
    return { title: 'Document Not Found' };
  }
  return {
    title: `${document.title} | IllusionTech`,
    description: `Read the ${document.title} for IllusionTech Development.`,
    robots: 'noindex, nofollow',
  };
}

export default async function LegalDocumentPage({ params }: { params: { slug: string } }) {
  const document = await getLegalDocumentBySlug(params.slug);

  if (!document || !document.isPublished) {
    notFound();
  }

  const lastUpdated = new Date(document.updatedAt!).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-20 md:py-28">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-2">{document.title}</h1>
          <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
        </header>
        <main className="max-w-4xl mx-auto">
          <div className="prose prose-slate dark:prose-invert max-w-none prose-h1:font-playfair prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl">
            <SanitizeHTML html={document.content || ''} />
          </div>
        </main>
      </div>
    </div>
  );
}