'use client';

import { motion } from 'framer-motion';
import { Search, Palette, Code, Rocket } from 'lucide-react';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionHeader } from './SectionHeader';

const processSteps = [
  {
    step: '01',
    title: 'Discover',
    description: 'We listen to your vision and define project goals.',
    icon: <Search className="w-10 h-10 text-accent" />,
  },
  {
    step: '02',
    title: 'Design',
    description: 'We craft intuitive UI/UX and stunning visuals.',
    icon: <Palette className="w-10 h-10 text-accent" />,
  },
  {
    step: '03',
    title: 'Develop',
    description: 'We build a robust, scalable, and secure product.',
    icon: <Code className="w-10 h-10 text-accent" />,
  },
  {
    step: '04',
    title: 'Deliver',
    description: 'We launch your project and provide ongoing support.',
    icon: <Rocket className="w-10 h-10 text-accent" />,
  },
];

export function ProcessSection() {
  const isMobile = useIsMobile();

  return (
    <AnimatedSection id="process" className="py-20 md:py-28 bg-background" viewport={{ once: false, amount: 0.2 }}>
      <div className="container">
        <SectionHeader title="Our Streamlined Process" description="From concept to launch, we follow a structured path to ensure success." isMobile={isMobile} />
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((item) => (
            <motion.div key={item.title} variants={createItemVariants(isMobile)} whileHover={{ y: -5, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-muted p-8 rounded-2xl border border-border text-center transition-shadow hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {item.step}. {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}