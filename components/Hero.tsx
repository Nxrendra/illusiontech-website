'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        {/* Make sure to place your video in the /public folder */}
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0"></div>

      {/* Content */}
      <div className="z-10 p-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-down">
          Welcome to IllusionTech
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up">
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
