'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ISourceOptions } from '@tsparticles/engine';
import { useIsMobile } from '@/hooks/useIsMobile';
import { IPageContentData } from '@/lib/models/PageContent';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false });

export function ContactHero({ content }: { content: IPageContentData }) {
  // Default to false. We'll only show the button on the client after confirming scroll position.
  // This ensures server and initial client render are the same (no button).
  const [showScrollDown, setShowScrollDown] = useState(false);
  const isMobile = useIsMobile();

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
    <section 
      className="relative overflow-hidden bg-gray-900 dark:bg-black min-h-screen flex flex-col items-center justify-center"
    >
      <ParticleBackground options={particleOptions} className="absolute inset-0" />
      <div className="container text-center relative z-10">
        <h1 
          className="text-4xl md:text-5xl font-bold text-white"
        >
          {content.contactHeroHeading ?? "Let's Build Something Great Together"}
        </h1>
        <p 
          className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        >
          {content.contactHeroSubheading ?? "Have a project in mind or just want to say hello? We'd love to hear from you. Fill out the form below or use our contact details to reach out."}
        </p>
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
    </section>
  );
}
