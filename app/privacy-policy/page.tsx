import type { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AlertTriangle } from 'lucide-react';
import { SanitizeHTML } from '@/components/SanitizeHTML';
import { getPageContent } from '@/lib/data/pageContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy | IllusionTech',
  description: 'Our Privacy Policy outlines how we collect, use, and protect your information when you use our website and services.',
  robots: 'noindex, nofollow', // Good practice for legal pages
};

// Reusable component for consistent section styling
const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
  <div className="mb-8" id={id}>
    <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
    <div className="space-y-4 text-muted-foreground">{children}</div>
  </div>
);

export default async function PrivacyPolicyPage() {
  const content = await getPageContent();
  const lastUpdated = content.updatedAt
    ? new Date(content.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-20 md:py-28">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
        </header>

        <main className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-12">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Legal Notice</AlertTitle>
            <AlertDescription>
              This is a template and not legal advice. You must consult with a qualified legal professional to ensure your Privacy Policy is complete, accurate, and compliant with all applicable laws and regulations (like GDPR, CCPA, etc.) for your business and jurisdiction.
            </AlertDescription>
          </Alert>

          <div className="prose prose-slate dark:prose-invert max-w-none prose-h1:font-playfair prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl">
            <SanitizeHTML html={content.privacyPolicyContent || ''} />
          </div>
        </main>
      </div>
    </div>
  );
}
