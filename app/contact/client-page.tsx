'use client';
 
import { ContactHero } from '@/components/ContactHero';
import { ContactInformation } from '@/components/ContactInformation';
import ContactForm from '@/components/ContactForm';
import { GridBackground } from '@/components/GridBackground';
import ProcessTimeline from '@/components/ProcessTimeline';
import { IPageContentData } from '@/lib/models/PageContent';

interface ContactClientPageProps {
  content: IPageContentData;
}

export default function ContactClientPage({ content }: ContactClientPageProps) { 
  return (
    <main>
      <ContactHero content={content} />
      <GridBackground>
        <section id="contact-content" className="min-h-screen flex items-center py-20 md:py-28">
          <div className="container grid md:grid-cols-2 gap-16 items-start">
            <div>
              <ContactInformation content={content} />
            </div>
            <div>
              <ContactForm content={content} />
            </div>
          </div>
        </section>
      </GridBackground>
      <ProcessTimeline /> 
    </main >
  );
}
