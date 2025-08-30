'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionHeader } from './SectionHeader';
import { IPageContentData } from '@/lib/models/PageContent';
import { getIcon } from '@/lib/get-icon';

const staticProcessSteps = [
  {
    step: '01',
    title: 'Discover',
    description: 'We listen to your vision and define project goals.',
    icon: 'Search',
  },
  {
    step: '02',
    title: 'Design',
    description: 'We craft intuitive UI/UX and stunning visuals.',
    icon: 'Palette',
  },
  {
    step: '03',
    title: 'Develop',
    description: 'We build a robust, scalable, and secure product.',
    icon: 'Code',
  },
  {
    step: '04',
    title: 'Deliver',
    description: 'We launch your project and provide ongoing support.',
    icon: 'Rocket',
  },
];

export function ProcessSection({ content }: { content: IPageContentData }) {
  const isMobile = useIsMobile();
  const processSteps = content.processSteps?.length ? content.processSteps : staticProcessSteps;

  return (
    <AnimatedSection id="process" className="py-20 md:py-28 bg-background" viewport={{ once: false, amount: 0.2 }}>
      <div className="container">
        <SectionHeader
          title={content.homeProcessHeading ?? 'Our Streamlined Process'}
          description={content.homeProcessSubheading ?? 'From concept to launch, we follow a structured path to ensure success.'}
          isMobile={isMobile}
        />
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((item) => {
            const icon = getIcon(item.icon);
            return (
              <motion.div key={item.title} variants={createItemVariants(isMobile)} whileHover={{ y: -5, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-muted p-8 rounded-2xl border border-border text-center transition-shadow hover:shadow-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full">
                  {icon && React.cloneElement(icon, { className: 'w-10 h-10 text-accent' })}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {item.step}. {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}