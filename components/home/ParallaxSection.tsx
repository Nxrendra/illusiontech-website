'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionProps,
} from 'framer-motion';

interface Props extends MotionProps {
  children: React.ReactNode;
  imageUrl: string;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const ParallaxSection = ({
  children,
  imageUrl,
  className,
  ...rest
}: Props) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const isInView = useInView(sectionRef, { once: false, margin: '-200px' });

  // Make parallax effect more noticeable
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden bg-gray-900 dark:bg-black ${className}`}>
      <motion.div
        className="absolute left-0 right-0 top-[-25%] bottom-[-25%] z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${imageUrl})`, y }}
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-10 container flex flex-col items-center text-center text-white"
        {...rest}
      >
        {children}
      </motion.div>
    </section>
  );
};
