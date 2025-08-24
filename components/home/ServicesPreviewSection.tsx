'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { ServiceWithIcon } from '@/app/page';

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {services.map((service) => (
            <Link key={service._id} href={service.link || '#'} className="block h-full">
              <motion.div className="bg-card text-card-foreground p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2 h-full" variants={itemVariants}>
                <div className="flex justify-center items-center mb-4">
                  {React.cloneElement(service.icon, { className: `w-10 h-10 ${service.theme?.accentClass || 'text-accent'}` })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
        <div className="text-center mt-16">
          <Button asChild size="large" variant="secondary"><Link href="/services">View All Services <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </div>
    </section>
  );
}