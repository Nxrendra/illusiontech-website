'use client';

import { motion } from 'framer-motion';
import { Zap, Users, Star } from 'lucide-react';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionHeader } from './SectionHeader';

const principles = [
  {
    icon: <Star className="w-10 h-10 text-accent" />,
    title: 'Commitment to Quality',
    description:
      'We are obsessed with delivering pixel-perfect, high-performance products. Our commitment to quality is unwavering, ensuring every project we handle is a masterpiece of form and function.',
  },
  {
    icon: <Users className="w-10 h-10 text-accent" />,
    title: 'Client-Centric Approach',
    description:
      'Your success is our success. We believe in building strong, collaborative partnerships, listening to your needs, and aligning our strategy with your business objectives to achieve outstanding results.',
  },
  {
    icon: <Zap className="w-10 h-10 text-accent" />,
    title: 'Innovation at the Core',
    description:
      'We stay at the forefront of technology, constantly exploring new tools and techniques to deliver innovative solutions that give you a competitive edge in the digital landscape.',
  },
];

export function PrinciplesSection() {
  const isMobile = useIsMobile();

  return (
    <AnimatedSection
      id="principles"
      className="py-20 md:py-28 bg-muted"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="container">
        <SectionHeader
          title="Our Guiding Principles"
          description="Our work is driven by a core set of values that ensure excellence, partnership, and innovation in everything we create."
          isMobile={isMobile}
        />
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {principles.map((principle) => (
            <motion.div key={principle.title} variants={createItemVariants(isMobile)} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-card text-card-foreground p-8 rounded-xl shadow-md text-center transition-shadow hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full">
                {principle.icon}
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">{principle.title}</h3>
              <p className="text-muted-foreground">{principle.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}