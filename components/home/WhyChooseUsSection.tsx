'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Zap, Code, ShieldCheck, ArrowRight } from 'lucide-react';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariantsLeft, createItemVariantsRight } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { IPageContentData } from '@/lib/models/PageContent';
import { getIcon } from '@/lib/get-icon';

const staticWhyChooseUsPoints = [
  {
    icon: 'Zap',
    title: 'Bespoke Solutions',
    description:
      "We don't use templates. Every website is uniquely designed and developed in Trinidad & Tobago to meet your specific business goals and brand identity.",
  },
  {
    icon: 'Code',
    title: 'Cutting-Edge Technology',
    description:
      'Leveraging modern technologies like Next.js and TypeScript, we build fast, secure, and scalable websites for clients worldwide.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Transparent Collaboration',
    description:
      'From initial consultation to final delivery, we maintain clear communication, providing regular updates and transparent pricing with no hidden fees.',
  },
];

export function WhyChooseUsSection({ content }: { content: IPageContentData }) {
  const isMobile = useIsMobile();
  const whyChooseUsPoints = content.homeWhyChooseUsPoints?.length
    ? content.homeWhyChooseUsPoints
    : staticWhyChooseUsPoints;

  return (
    <AnimatedSection
      id="why-us"
      className="min-h-screen flex items-center bg-background py-20"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="container grid md:grid-cols-2 gap-16 items-center">
        <motion.div variants={containerVariants} className="max-w-lg space-y-4">
          <motion.div variants={createItemVariantsLeft(isMobile)}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{content.homeWhyChooseUsHeading ?? 'Why Choose IllusionTech?'}
            </h2>
          </motion.div>
          <motion.div variants={createItemVariantsLeft(isMobile)}>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {content.homeWhyChooseUsSubheading ??
                "We're more than just developers; we're your dedicated partners in building a powerful online presence that drives growth and delivers results."}            </p>
          </motion.div>
          <motion.div variants={createItemVariantsLeft(isMobile)} className="pt-4">
            <Button asChild size="large">
              <Link href="/about">
            {content.homeWhyChooseUsCtaButtonText ?? 'Learn More About Us'}{' '}
                <ArrowRight className="ml-2 h-5 w-5" />              </Link>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div variants={containerVariants} className="space-y-6">
          {whyChooseUsPoints.map((point) => {
            const icon = getIcon(point.icon);
            return (
              <motion.div key={point.title} variants={createItemVariantsRight(isMobile)} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }} className="group flex items-start gap-4 rounded-lg bg-card text-card-foreground p-4 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full transition-colors duration-300 group-hover:bg-accent">
                  {icon && React.cloneElement(
                    icon,
                    { className: 'w-8 h-8 text-accent transition-colors duration-300 group-hover:text-white' }
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}