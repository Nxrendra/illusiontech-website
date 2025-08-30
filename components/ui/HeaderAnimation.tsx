'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeaderAnimationProps {
  title: React.ReactNode;
  description: React.ReactNode;
  isAtTop?: boolean;
}

const headerTextVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

export function HeaderAnimation({ title, description, isAtTop: isAtTopProp }: HeaderAnimationProps) {
  const [isAtTopInternal, setIsAtTopInternal] = useState(true);
  const isAtTop = isAtTopProp ?? isAtTopInternal;

  useEffect(() => {
    if (isAtTopProp !== undefined) return;

    const handleScroll = () => setIsAtTopInternal(window.scrollY < 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAtTopProp]);

  return (
    <div className="container text-center overflow-hidden">
      <motion.div variants={headerTextVariants} initial="hidden" animate={isAtTop ? 'visible' : 'hidden'}>
        <motion.h1 variants={headerTextVariants} className="text-4xl md:text-5xl font-bold text-white">
          {title}
        </motion.h1>
        <motion.p variants={headerTextVariants} className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
}