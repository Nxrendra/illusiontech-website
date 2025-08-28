'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import ContactTeaser from '@/components/ContactTeaser';
import { useIsMobile } from '@/hooks/useIsMobile';
import ServiceDetailCard from '@/components/ServiceDetailCard';
import { ServiceWithIcon } from './page';
import { ChevronDown } from 'lucide-react';

interface WebDevelopmentClientPageProps {
  services: ServiceWithIcon[];
}

export default function WebDevelopmentClientPage({ services }: WebDevelopmentClientPageProps) {
  const isMobile = useIsMobile();

  // --- Scroll button logic ---
  const lastY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY.current) {
        setScrollDirection('down');
      } else if (currentY < lastY.current) {
        setScrollDirection('up');
      }
      lastY.current = currentY;
      setIsAtTop(currentY < 10); // Adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const nextSection = document.getElementById('web-dev-packages');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // --- End scroll button logic ---

  return (
    <main>
      <AnimatedSection
        className="bg-gray-900 dark:bg-black py-20 md:py-28 min-h-screen flex flex-col items-center justify-center relative"
      >
        <div className="container text-center">
          <motion.h1
            variants={createItemVariants(isMobile)}
            className="text-4xl md:text-5xl font-bold text-white font-playfair"
          >
            Custom Web Development
          </motion.h1>
          <motion.p
            variants={createItemVariants(isMobile)}
            className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            We build robust, scalable, and high-performance web applications tailored to your unique business needs.
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
      </AnimatedSection>

      <section id="web-dev-packages" className="py-16 md:py-24 bg-background">
        <div className="container space-y-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Our Web Development Packages
          </h2>
          {services.map((service, index) => (
            <ServiceDetailCard key={service._id} service={service} isOdd={index % 2 !== 0} />
          ))}
        </div>
      </section>

      <ContactTeaser />
    </main>
  );
}