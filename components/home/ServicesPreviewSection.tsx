'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ServiceWithIcon } from '@/app/page';
import { ServiceCard } from '@/components/ServiceCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

interface ServicesPreviewSectionProps {
  services: ServiceWithIcon[];
}

export function ServicesPreviewSection({ services }: ServicesPreviewSectionProps) {
  return (
    <section id="services-preview" className="py-20 bg-muted/50 dark:bg-muted/20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          We offer a range of services to bring your digital vision to life.
        </p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {services.map((service) => (
            <motion.div key={service._id} variants={itemVariants}><ServiceCard service={service} /></motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-16">
          <Button asChild size="large" variant="secondary"><Link href="/services">View All Services <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </div>
    </section>
  );
}