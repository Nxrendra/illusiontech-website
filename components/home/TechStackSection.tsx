'use client';

import { motion } from 'framer-motion';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionHeader } from './SectionHeader';
import TechIcon from './TechIcon';
import { IPageContentData } from '@/lib/models/PageContent';

const techStack = [
  {
    name: 'HTML5',
    icon: 'Html',
    description: 'The standard for structuring all content on the web.',
  },
  {
    name: 'CSS3',
    icon: 'Css',
    description: 'Used for styling and designing the visual presentation of web pages.',
  },
  {
    name: 'JavaScript',
    icon: 'Javascript',
    description: 'The programming language that brings interactivity to websites.',
  },
  {
    name: 'React',
    icon: 'React',
    description: 'A powerful library for building dynamic and fast user interfaces.',
  },
  {
    name: 'Next.js',
    icon: 'Nextjs',
    description: 'A React framework for building full-stack, production-ready web applications.',
  },
  {
    name: 'Node.js',
    icon: 'Nodejs',
    description: 'Allows us to run JavaScript on the server for fast and scalable backends.',
  },
  {
    name: 'MongoDB',
    icon: 'Mongodb',
    description: 'A flexible database we use to store and manage application data efficiently.',
  },
  {
    name: 'Tailwind CSS',
    icon: 'Tailwindcss',
    description: 'A utility-first CSS framework that helps us build custom designs rapidly.',
  },
  {
    name: 'Framer',
    icon: 'Framer',
    description: 'A powerful tool for creating stunning animations and interactive prototypes, like myself.',
  },
];

export function TechStackSection({ content }: { content: IPageContentData }) {
  const isMobile = useIsMobile();

  return (
    <AnimatedSection
      id="tech-stack"
      className="py-20 md:py-28 bg-background"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="container">
        <SectionHeader
          title={content.homeTechStackHeading ?? 'Technology We Use'}
          description={
            content.homeTechStackSubheading ??
            "We build with modern, robust, and scalable technologies to ensure your project's success and longevity."
          }
          isMobile={isMobile}
        />
        <motion.div
          variants={containerVariants}
          className="flex flex-wrap justify-center items-center gap-8"
        >
          {techStack.map((tech) => (
            <motion.div
              key={tech.name}
              variants={createItemVariants(isMobile)}
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-2 text-center w-24"
            >
              <div className="h-12 w-12 flex items-center justify-center">
                <TechIcon name={tech.icon} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}