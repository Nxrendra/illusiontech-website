'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const sectionVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 50,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export default function ContactTeaser() {
  return (
    <motion.section
      className="py-20 bg-gray-800 text-white"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Let's Work Together
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Have a project in mind? We'd love to hear about it.
        </p>
        <Button asChild variant="secondary" size="large">
          <Link href="/contact">
            Get In Touch
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
