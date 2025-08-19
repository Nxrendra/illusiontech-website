'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useScroll } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

// Dynamically import the ParticlesComponent with SSR turned off.
const ParticlesComponent = dynamic(() => import('./Particles'), {
  ssr: false,
});

export const HeroSection = () => {
  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    return scrollY.on('change', (currentY) => {
      setIsAtTop(currentY < 10);
    });
  }, [scrollY]);

  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden text-white bg-gray-900 dark:bg-black">
      <ParticlesComponent />
      <div className="relative z-10 p-4 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Crafting Digital <span className="text-accent">Illusions</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          We transform complex ideas into elegant web solutions that captivate
          and convert.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mt-8 flex gap-4"
        >
          <Button asChild size="large" variant="secondary">
            <Link href="/services">
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
      
      <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
        animate={isAtTop ? 'visible' : 'hidden'}
        variants={{
          visible: {
            opacity: 1,
            y: [0, 8, 0],
            transition: {
              y: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              },
              opacity: { duration: 0.3 },
            },
          },
          hidden: {
            opacity: 0,
            y: 20,
            transition: {
              duration: 0.3,
            },
          },
        }}
        initial={false}
      >
        <Link
          href="/#why-us"
          aria-label="Scroll to next section"
          className="w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center border border-foreground/20 cursor-pointer hover:bg-foreground/20 transition-colors"
        >
          <ChevronDown className="h-6 w-6 text-foreground" />
        </Link>
      </motion.div>
    </section>
  );
};
