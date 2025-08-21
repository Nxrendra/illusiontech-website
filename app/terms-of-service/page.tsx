import type { Metadata } from 'next';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AlertTriangle } from 'lucide-react';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Terms of Service | IllusionTech',
  description: 'The terms and conditions for using the IllusionTech Development website and services.',
  robots: 'noindex, nofollow', // It's good practice to noindex legal pages
};

// Reusable component for consistent section styling
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
    <div className="space-y-4 text-muted-foreground">{children}</div>
  </div>
);

export default function TermsOfServicePage() {
  const lastUpdated = 'October 26, 2023'; // Remember to update this date

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-20 md:py-28">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
        </header>

        <main className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-12">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Legal Notice</AlertTitle>
            <AlertDescription>
              This is a template and not legal advice. You must consult with a qualified legal professional to ensure your Terms of Service are complete, accurate, and compliant with all applicable laws and regulations for your business and jurisdiction.
            </AlertDescription>
          </Alert>

          <Section title="1. Agreement to Terms">
            <p>
              By accessing or using our website located at{' '}
              <Link href="/" className="text-accent hover:underline">
                illusiontech.dev
              </Link>{' '}
              (the "Site") and any services offered by IllusionTech Development ("we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Site or our services.
            </p>
          </Section>

          <Section title="2. Intellectual Property Rights">
            <p>
              Unless otherwise indicated, the Site and all its content, including source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
            </p>
            <p>
              The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
            </p>
          </Section>

          <Section title="3. User Representations">
            <p>By using the Site, you represent and warrant that:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>
          </Section>

          <Section title="4. Prohibited Activities">
            <p>
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
            <p>As a user of the Site, you agree not to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
              <li>Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site.</li>
              <li>Attempt to impersonate another user or person or use the username of another user.</li>
            </ul>
          </Section>

          <Section title="5. Term and Termination">
            <p>
              These Terms of Service shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON.
            </p>
          </Section>

          <Section title="6. Governing Law">
            <p>
              These Terms shall be governed by and defined following the laws of Trinidad and Tobago. IllusionTech Development and yourself irrevocably consent that the courts of Trinidad and Tobago shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
            </p>
          </Section>

          <Section title="7. Disclaimer">
            <p>
              THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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

