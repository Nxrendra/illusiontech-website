
'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { motion, type Variants, useScroll } from 'framer-motion';
import ContactTeaser from '@/components/ContactTeaser';
import { ChevronDown } from 'lucide-react';
import { ServiceCarousel } from '@/components/ServiceCarousel';
import ServiceDetailCard from '@/components/ServiceDetailCard';
import ParticleBackground from '@/components/ParticleBackground';
import type { ISourceOptions } from '@tsparticles/engine';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ServiceWithIcon } from './page';



const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

interface ServicesClientPageProps {
  services: ServiceWithIcon[];
}

export default function ServicesClientPage({ services }: ServicesClientPageProps) {
  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    return scrollY.on('change', (currentY) => {
      // A small threshold to avoid flickering on some devices
      setIsAtTop(currentY < 10);
    });
  }, [scrollY]);

  const particleOptions: ISourceOptions = {
    fullScreen: { enable: false },
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: 0, // Emitter will create the particles
        density: {
          enable: true,
        },
      },
      color: {
        value: '#facc15', // A nice yellow color
      },
      shape: {
        type: 'triangle',
      },
      opacity: {
        value: { min: 0.1, max: 0.6 },
      },
      size: {
        value: { min: 1, max: 4 },
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'out',
        },
      },
    },
    emitters: [
      {
        direction: 'bottom',
        position: {
          x: 50,
          y: 0,
        },
        rate: {
          quantity: isMobile ? 2 : 5, // Reduce emission rate on mobile
          delay: 0.15,
        },
        size: {
          width: 100,
          height: 0,
        },
        // The emitter will use the global particle settings for the emitted particles
      },
    ],
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
    detectRetina: true,
  };

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
    const nextSection = document.getElementById('our-offerings');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center text-white bg-gray-900 dark:bg-black"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ParticleBackground id="services-particles" options={particleOptions} className="absolute inset-0" />
        <div className="relative z-10 text-center container">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold font-playfair"
          >
            Our Services
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300"
          >
            From custom web development to stunning UI/UX design, we offer a
            comprehensive suite of digital solutions to bring your vision to
            life.
          </motion.p>
        </div>
        <motion.button
          className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
          onClick={handleScrollDown}
          aria-label="Scroll to next section"
          variants={arrowVariants}
          initial={false}
          animate={isAtTop ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </motion.section>

      {/* Service Carousel Section */}
      <section
        id="our-offerings"
        className="py-16 md:py-24 bg-background">
        <div className="container flex flex-col items-center justify-center text-center">
          <motion.div
            className="max-w-3xl mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Offerings
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide a complete range of digital services designed to
              elevate your brand and drive growth. Explore our packages below.
            </p>
          </motion.div>
          <ServiceCarousel services={services} />
        </div>
      </section>

      {/* Service Details Section */}
      <section>
        {services.map((service, index) => (
          <ServiceDetailCard key={service._id} service={service} isOdd={index % 2 !== 0} />
        ))}
      </section>

      <ContactTeaser />
    </>
  );
}
