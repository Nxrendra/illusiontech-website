'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import ParticleBackground from './ParticleBackground';


export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      
      <ParticleBackground />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-0"></div>

      {/* Content */}
      <div className="z-10 p-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 animate-fade-in-down">
          Welcome to IllusionTech
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 animate-fade-in-up">
          We build beautiful, functional, and scalable web solutions that drive
          results.
        </p>
        <Button asChild size="large">
          <Link href="#services-preview">Get Started</Link>
        </Button>
      </div>
    </section>
  );
}
