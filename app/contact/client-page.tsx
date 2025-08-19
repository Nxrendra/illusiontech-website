'use client';
 
import { ContactHero } from '@/components/ContactHero';
import { ContactInformation } from '@/components/ContactInformation';
import ContactForm from '@/components/ContactForm';
import { GridBackground } from '@/components/GridBackground';
import ProcessTimeline from '@/components/ProcessTimeline';

export default function ContactClientPage() { 
  return (
    <main>
      <ContactHero />
      <GridBackground>
        <section id="contact-content" className="min-h-screen flex items-center py-20 md:py-28">
          <div className="container grid md:grid-cols-2 gap-16 items-start">
            <div>
              <ContactInformation />
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </section>
      </GridBackground>
      <ProcessTimeline /> 
    </main >
  );
}
