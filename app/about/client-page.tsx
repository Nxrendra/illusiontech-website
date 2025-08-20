'use client';

import { motion } from 'framer-motion';
import type { ISourceOptions } from '@tsparticles/engine';
import dynamicImport from 'next/dynamic';

// Dynamically import a particle background component to ensure it only runs on the client
const ParticleBackground = dynamicImport(
  () => import('@/components/ui/ParticleBackground'), // Assuming this component exists
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-background -z-10" />,
  }
);

// This ensures the page is always rendered dynamically at request time.
export const dynamic = 'force-dynamic';

const particleOptions: ISourceOptions = {
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
      resize: {
        enable: true,
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
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        // @ts-ignore - This property is correct for tsparticles v3, but a config issue is causing a type error.
        area: 800,
      },
      value: 50,
    },
    opacity: {
      value: 0.2,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

export default function ClientAboutPage() {
  return (
    <main className="relative flex-grow flex items-center justify-center overflow-hidden">
      <ParticleBackground options={particleOptions} />
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-foreground"
        >
          About IllusionTech
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          This is a client-rendered page with interactive animations. All dynamic content is handled by the browser, ensuring a smooth and responsive user experience.
        </motion.p>
      </div>
    </main>
  );
}