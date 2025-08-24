'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import ContactTeaser from '@/components/ContactTeaser';
import { useIsMobile } from '@/hooks/useIsMobile';
import { services } from '@/lib/data/services';
import ServiceDetailCard from '@/components/ServiceDetailCard';
import { getIcon } from '@/lib/get-icon';

export default function WebDevelopmentClientPage() {
  const isMobile = useIsMobile();

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
      </AnimatedSection>

      <section className="py-16 md:py-24 bg-background">
        <div className="container space-y-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Our Web Development Packages
          </h2>
          {services
            .filter((s) => s.type === 'web-development')
            .map((service, index) => (
              <ServiceDetailCard
                key={service.id}
                service={{
                  ...service,
                  _id: service.id,
                  // The static service data's `icon` is already a ReactElement,
                  // so we pass it directly instead of calling getIcon().
                  icon: service.icon,
                }}
                isOdd={index % 2 !== 0}
              />
            ))}
        </div>
      </section>

      <ContactTeaser />
    </main>
  );
}