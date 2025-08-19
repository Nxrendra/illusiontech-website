'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

type ParticleBackgroundProps = {
  options: ISourceOptions;
  className?: string;
};

const ParticleBackground = ({ options, className }: ParticleBackgroundProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // The loadSlim preset is needed for the 'polygon' shape and 'repulse' mode
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        className={className}
        options={options}
      />
    );
  }

  return null;
};

export default ParticleBackground;