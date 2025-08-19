'use client';

import { useRef } from 'react';
import { motion, useInView, type HTMLMotionProps } from 'framer-motion';

/**
 * We use Omit to remove the animation props that this component
 * controls internally, so they can't be overwritten by consumers.
 */
interface Props
  extends Omit<
    HTMLMotionProps<'section'>,
    'variants' | 'initial' | 'animate' | 'transition'
  > {
  children: React.ReactNode;
}

export const AnimatedSection = ({ children, ...rest }: Props) => {
  const ref = useRef(null);
  // Set once to false to re-animate on scroll
  const isInView = useInView(ref, { margin: '-100px 0px', once: false });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger children animations
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      {...rest}
    >
      {children}
    </motion.section>
  );
};
