'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { services } from '@/lib/data/services';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export function ServicesPreviewSection() {
  const isMobile = useIsMobile();

  return (
    <AnimatedSection
      id="services"
      className="min-h-screen flex flex-col items-center justify-center bg-muted py-20"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="container">
        <SectionHeader
          title="Our Core Services"
          description="We offer a range of services to bring your digital ideas to life, from simple landing pages to complex web applications."
          isMobile={isMobile}
        />
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.filter(s => s.isCoreService).map((service) => (
            <motion.div
              key={service.name}
              variants={createItemVariants(isMobile)}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`relative bg-gradient-to-br ${service.theme.gradient} p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-25 animate-light-shimmer"></div>
              </div>
              <div className="mb-4">
                {React.cloneElement(service.icon, {
                  className: `w-8 h-8 ${service.theme.accentClass}`,
                })}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {service.name}
              </h3>
              <p className={`font-semibold mb-4 ${service.theme.accentClass}`}>
                {service.price}
              </p>
              <ul className="space-y-3 text-gray-300 flex-grow mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 ${service.theme.accentClass} flex-shrink-0`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-auto ${service.theme.buttonClass} text-white`}>
                <Link href={service.link}>
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={createItemVariants(isMobile)} className="text-center mt-16">
          <Button asChild size="large">
            <Link href="/services">See All Services</Link>
          </Button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}