'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  viewport?: {
    once?: boolean;
    amount?: number;
  };
}

export const AnimatedSection = ({ children, className, id, viewport }: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport || { once: true, amount: 'some' });

  return (
    <motion.section 
      id={id} 
      ref={ref} 
      className={className} 
      variants={containerVariants} 
      initial={false}  // Changed from "hidden" to prevent flash on page load
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  );
};
