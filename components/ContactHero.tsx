'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ISourceOptions } from '@tsparticles/engine';
import { useIsMobile } from '@/hooks/useIsMobile';
import { IPageContentData } from '@/lib/models/PageContent';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false });


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function ContactHero({ content }: { content: IPageContentData }) {
  // Default to false. We'll only show the button on the client after confirming scroll position.
  // This ensures server and initial client render are the same (no button).
  const [showScrollDown, setShowScrollDown] = useState(false);
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.2 });

  useEffect(() => {
    const handleScroll = () => {
      // A small threshold to avoid flickering on some devices
      setShowScrollDown(window.scrollY < 10);
    };

    handleScroll(); // Check scroll position on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const arrowVariants = {
    visible: {
      opacity: 1,
      y: [0, 10, 0],
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
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('contact-content');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const particleOptions: ISourceOptions = { // Starfield Style
    fullScreen: { enable: false },
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#ffffff',
      },
      links: {
        enable: false,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'out',
        },
        random: true,
        speed: 0.1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: isMobile ? 80 : 350, // Optimize particle count for mobile
      },
      opacity: {
        value: { min: 0.3, max: 0.8 }, // Increased opacity for brighter stars
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      shape: {
        type: 'star', // Changed shape from circle to star
      },
      size: {
        value: { min: 1, max: 3 }, // Slightly increased max size for visibility
      },
    },
    detectRetina: true,
  };

  return (
    <motion.section 
      ref={heroRef}
      className="relative bg-gray-900 dark:bg-black min-h-screen flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate={isHeroInView ? 'visible' : 'hidden'}
    >
      <div className="absolute inset-0 overflow-hidden">
        <ParticleBackground options={particleOptions} />
      </div>
      <div className="container text-center relative z-10">
      <motion.h1 
          variants={itemVariants}          className="text-4xl md:text-5xl font-bold text-white"
        >
          {content.contactHeroHeading ?? "Let's Build Something Great Together"}
         </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        >
          {content.contactHeroSubheading ?? "Have a project in mind or just want to say hello? We'd love to hear from you. Fill out the form below or use our contact details to reach out."}
        </motion.p>
      </div>
      <motion.button
        className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
        onClick={handleScrollDown}
        aria-label="Scroll to next section"
        variants={arrowVariants}
        initial={false}
        animate={showScrollDown ? 'visible' : 'hidden'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </motion.section>
  );
}
