import type { ISourceOptions } from '@tsparticles/engine';

/**
 * Options for a subtle, professional particle background.
 * Ideal for the main hero section.
 */
export const heroParticlesOptions: ISourceOptions = {
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
      resize: { enable: true },
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
        width: 1000,
        height: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.2,
    },
    shape: {
      type: 'circle', // You can change this to 'square', 'triangle', 'star', etc.
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

/**
 * Options for a more vibrant, colorful particle effect.
 */
export const colorfulParticlesOptions: ISourceOptions = {
  particles: {
    number: {
      value: 60,
    },
    color: {
      // An array of colors for random selection
      value: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
    },
    shape: {
      type: 'star', // Let's use stars for this one!
    },
    opacity: { value: { min: 0.3, max: 0.8 } },
    size: { value: { min: 1, max: 5 } },
    move: { enable: true, speed: 4, direction: 'none', outModes: 'out' },
  },
  interactivity: { events: { onHover: { enable: true, mode: 'repulse' } } },
};