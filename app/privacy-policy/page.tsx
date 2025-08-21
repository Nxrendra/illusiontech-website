import type { Metadata } from 'next';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AlertTriangle } from 'lucide-react';

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

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 26, 2023'; // Remember to update this date

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

          <Section title="1. Introduction">
            <p>
              IllusionTech Development ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{' '}
              <Link href="/" className="text-accent hover:underline">
                illusiontech.dev
              </Link>{' '}
              (the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <h3 className="text-lg font-semibold text-foreground !mt-6">Personal Data</h3>
            <p>
              Personally identifiable information, such as your name, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you fill out our contact form or otherwise interact with the Site.
            </p>
            <h3 className="text-lg font-semibold text-foreground !mt-6">Usage Data</h3>
            <p>
              Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Respond to your inquiries and provide customer support.</li>
              <li>Email you regarding your project or our services.</li>
              <li>Improve the efficiency and operation of the Site.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            </ul>
          </Section>

          <Section title="4. Sharing Your Information">
            <p>
              We do not share, sell, rent, or trade your information with third parties for their commercial purposes. We may share information we have collected about you in certain situations, such as with third-party service providers that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.
            </p>
          </Section>
          
          <Section title="5. Data Security">
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </Section>

          <Section title="6. Use of Cookies" id="cookies">
            <p>
              We use cookies to help customize the Site and improve your experience. A "cookie" is a string of information which assigns you a unique identifier that we store on your computer. Your browser then provides that unique identifier to use each time you submit a query to the Site. We use essential cookies on the Site to, among other things, keep you logged in, and track the pages you visit.
            </p>
            <p>
              Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
            </p>
          </Section>

          <Section title="7. Your Data Protection Rights">
            <p>
              Depending on your location, you may have certain rights under data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided below.
            </p>
          </Section>

          <Section title="8. Changes to This Privacy Policy">
            <p>
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold">IllusionTech Development</p>
              <p>
                Email:{' '}
                <a href="mailto:illusiontechdev@gmail.com" className="text-accent hover:underline">
                  illusiontechdev@gmail.com
                </a>
              </p>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}

