'use client';
 
import { ContactInformation } from '@/components/ContactInformation';
import ContactForm from '@/components/ContactForm';
import { GridBackground } from '@/components/GridBackground';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariantsLeft, createItemVariantsRight } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { motion, useInView, useScroll } from 'framer-motion';
import { IPageContentData } from '@/lib/models/PageContent';
import { ServiceForForm } from './page';
import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import type { ISourceOptions } from '@tsparticles/engine';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false });

// Reusable animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

interface ContactClientPageProps {
  content: IPageContentData;
  services: ServiceForForm[];
}

export default function ContactClientPage({ content, services }: ContactClientPageProps) { 
  const isMobile = useIsMobile();

  // --- Hero Section Logic ---
  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(true);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.2 });

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY]);

  const arrowVariants = {
    visible: {
      opacity: 1,
      y: [0, 10, 0],
      transition: {
        y: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        },
        opacity: { duration: 0.3 },
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('contact-content');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const particleOptions: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: true, mode: 'repulse' } },
      modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: '#ffffff' },
      links: { enable: false },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'out' },
        random: true,
        speed: 0.1,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: isMobile ? 80 : 350,
      },
      opacity: {
        value: { min: 0.3, max: 0.8 },
        animation: { enable: true, speed: 1, sync: false },
      },
      shape: { type: 'star' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (
    <main className="overflow-hidden">
      <motion.section
        ref={heroRef}
        className="relative bg-gray-900 dark:bg-black min-h-screen flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate={isHeroInView ? 'visible' : 'hidden'}
      >
        <ParticleBackground options={particleOptions} className="absolute inset-0" />
        <div className="container text-center relative z-10">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white">
            {content.contactHeroHeading ?? "Let's Build Something Great Together"}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {content.contactHeroSubheading ?? "Have a project in mind or just want to say hello? We'd love to hear from you. Fill out the form below or use our contact details to reach out."}
          </motion.p>
        </div>
        <motion.button
          className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
          onClick={handleScrollDown}
          aria-label="Scroll to next section"
          variants={arrowVariants}
          initial={false}
          animate={isAtTop ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </motion.section>

      <GridBackground>
        <AnimatedSection id="contact-content" className="min-h-screen flex items-center py-20 md:py-28" viewport={{ once: false, amount: 0.2 }}>
          <div className="container grid md:grid-cols-2 gap-16 items-start">
            <motion.div variants={createItemVariantsLeft(isMobile)}>
              <ContactInformation content={content} />
            </motion.div>
            <motion.div variants={createItemVariantsRight(isMobile)}>
              <ContactForm content={content} services={services} />
            </motion.div>
          </div>
        </AnimatedSection>
      </GridBackground>
    </main>
  );
}
