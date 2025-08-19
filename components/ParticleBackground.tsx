'use client';

import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container, ISourceOptions } from '@tsparticles/engine';
import { loadFull } from 'tsparticles'; // Changed from 'loadSlim'
import { cn } from '@/lib/utils';

interface ParticleBackgroundProps {
  id?: string;
  options?: ISourceOptions;
  className?: string;
}

export default function ParticleBackground({ id = "tsparticles", options: propOptions, className }: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the full tsparticles bundle, it's a must to load the engine bundle before using it
      await loadFull(engine); // Changed from loadSlim
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // You can add any logic to run after particles are loaded
  };

  const defaultOptions: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: '#111827', // Matches bg-gray-900 for a seamless look
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
            default: 'bounce',
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
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
    }),
    [],
  );

  const options = propOptions || defaultOptions;

  if (init) {
    return (
      <Particles
        id={id}
        particlesLoaded={particlesLoaded}
        options={options}
        className={cn("absolute inset-0 z-0", className)}
      />
    );
  }

  return null;
};
