// /Users/macbookair/Documents/IllusionTech-Development/app/services/web-development/client-page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import ContactTeaser from '@/components/ContactTeaser';
import { services } from '@/lib/data/services';
import ServiceDetailCard from '@/components/ServiceDetailCard';

export default function WebDevelopmentClientPage() {
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    return scrollY.on('change', (currentY) => {
      // A small threshold to avoid flickering on some devices
      setIsAtTop(currentY < 10);
    });
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
    const nextSection = document.getElementById('packages');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-900 dark:bg-black py-24 md:py-32 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        <AnimatedSection className="relative z-10">
          <div className="container text-center">
            <motion.h1
              variants={createItemVariants(isMobile)}
              className="text-4xl md:text-6xl font-bold font-playfair text-white"
            >
              Web Development Packages
            </motion.h1>
            <motion.p
              variants={createItemVariants(isMobile)}
              className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            >
              From simple showcases to complex applications, we offer tailored
              solutions to build and scale your digital presence.
            </motion.p>
          </div>
        </AnimatedSection>
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
      </section>

      {/* Packages Section */}
      <div id="packages" className="bg-background">
        {services
          .filter((s) => s.type === 'web-development')
          .map((service, index) => (
            <ServiceDetailCard key={service.id} service={service} isOdd={index % 2 !== 0} />
          ))}
      </div>

      {/* Support Teaser Section */}
      <AnimatedSection className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center">
            <motion.h2
              variants={createItemVariants(isMobile)}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Need Ongoing Support?
            </motion.h2>
            <motion.p
              variants={createItemVariants(isMobile)}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Keep your website secure, fast, and up-to-date with our flexible
              monthly maintenance plans. We handle the technical details so you
              can focus on your business.
            </motion.p>
            <motion.div variants={createItemVariants(isMobile)}>
              <Button asChild size="large" variant="secondary">
                <Link href="/services/support-maintenance">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <ContactTeaser />
    </>
  );
}
