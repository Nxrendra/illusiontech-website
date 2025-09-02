import type { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AlertTriangle } from 'lucide-react';
import { SanitizeHTML } from '@/components/SanitizeHTML';
import { getPageContent } from '@/lib/data/pageContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Terms of Service | IllusionTech',
  description: 'Read the Terms of Service for using the IllusionTech Development website and services.',
  robots: 'noindex, nofollow',
};

export default async function TermsOfServicePage() {
  const content = await getPageContent();
  const lastUpdated = content.updatedAt
    ? new Date(content.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-20 md:py-28">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="prose prose-slate dark:prose-invert max-w-none prose-h1:font-playfair prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl">
            <SanitizeHTML html={content.termsOfServiceContent || ''} />
          </div>
        </main>
      </div>
    </div>
  );
}