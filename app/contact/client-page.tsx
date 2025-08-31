'use client';
 
import { ContactHero } from '@/components/ContactHero';
import { ContactInformation } from '@/components/ContactInformation';
import ContactForm from '@/components/ContactForm';
import { GridBackground } from '@/components/GridBackground';
import ProcessTimeline from '@/components/ProcessTimeline';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariantsLeft, createItemVariantsRight } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { motion } from 'framer-motion';
import { IPageContentData } from '@/lib/models/PageContent';
import { ServiceForForm } from './page';

interface ContactClientPageProps {
  content: IPageContentData;
  services: ServiceForForm[];
}

export default function ContactClientPage({ content, services }: ContactClientPageProps) { 
  const isMobile = useIsMobile();
  return (
    <main>
      <ContactHero content={content} />
      <GridBackground>
        <AnimatedSection id="contact-content" className="min-h-screen flex items-center py-20 md:py-28" viewport={{ once: false, amount: 0.2 }}>
          <div className="container grid md:grid-cols-2 gap-16 items-start">
            {/* <motion.div variants={createItemVariantsLeft(isMobile)}>
              <ContactInformation content={content} />
            </motion.div> */}
            <motion.div variants={createItemVariantsRight(isMobile)}>
              <ContactForm content={content} services={services} />
            </motion.div>
          </div>
        </AnimatedSection>
      </GridBackground>
      <ProcessTimeline /> 
    </main >
  );
}
