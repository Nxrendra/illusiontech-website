'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { CheckCircle2, ArrowRight, Users, LucideIcon } from 'lucide-react';
import { IServiceData } from '@/lib/models/Service';
import { cn } from '@/lib/utils';

interface ServiceDetailCardProps {
  service: IServiceData & { _id: string; icon: React.ReactElement };
  isOdd: boolean;
}

const ServiceDetailCard = ({ service, isOdd }: ServiceDetailCardProps) => {
  const { theme, systemTheme } = useTheme();
  const serviceTheme = service.theme || {};
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const isLightMode = effectiveTheme === 'light';

  // In light mode, use a consistent blue for accents. In dark mode, use the service's theme color.
  const accentColorClass = isLightMode ? 'text-primary' : (serviceTheme.accentClass || 'text-primary');

  const isPriceRange = service.price?.includes(' - ');
  const priceLabel = isPriceRange ? 'Estimated Price' : 'Starting From';
  const itemVariants = createItemVariants(false); // Create variants for desktop

  return (
    <AnimatedSection
      id={service.name.toLowerCase().replace(/\s+/g, '-')}
      className={`min-h-screen flex flex-col justify-center py-20 md:py-28 ${isOdd ? 'bg-muted' : 'bg-background'}`}
    >
      <div className="container flex flex-col justify-center h-full">
        {/* Section Header */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-20"
        >
          <h2 className={cn('text-4xl md:text-5xl font-bold', accentColorClass)}>{service.name}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{service.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
          {/* Key Features Column */}
          <motion.div
            variants={itemVariants}
            className={cn('md:text-left', isOdd ? 'md:order-3 md:text-right' : 'md:order-1')}
          >
            <h3 className="text-2xl font-semibold text-foreground mb-4">Key Features</h3>
            <ul className={cn('space-y-3 text-muted-foreground inline-block', isOdd ? 'text-right' : 'text-left')}>
              {(service.features || []).map((feature) => (
                <li key={feature} className={cn('flex items-center gap-3', isOdd ? 'flex-row-reverse' : '')}>
                  <CheckCircle2 className={cn('w-5 h-5 flex-shrink-0', accentColorClass)} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image/Visual Column (Center) */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              rotate: isOdd ? 2 : -2,
              boxShadow:
                effectiveTheme === 'dark'
                  ? !isOdd // Dark theme, dark bg (bg-background)
                    ? '0 0 40px -10px rgba(255, 255, 255, 0.2)'
                    : '0 30px 60px -15px rgba(0, 0, 0, 0.3)' // Dark theme, muted bg
                  : '0 30px 60px -15px rgba(0, 0, 0, 0.2)', // Light theme, any bg
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={cn(
              'md:order-2 flex items-center justify-center p-8 rounded-3xl h-80 md:h-96 shadow-2xl',
              isLightMode ? 'bg-primary' : (serviceTheme.gradient || 'bg-primary')
            )}
          >
            {React.cloneElement(service.icon, {
              className: 'w-32 h-32 md:w-40 md:h-40 text-white/80',
              strokeWidth: 1.5,
            })}
          </motion.div>

          {/* Meta Info Column */}
          <motion.div
            variants={itemVariants}
            className={cn('space-y-8', isOdd ? 'md:order-1' : 'md:order-3')}
          >
            {service.audience && (
              <div className={cn('border-accent', isOdd ? 'border-r-2 pr-4 text-right' : 'border-l-2 pl-4')}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ideal For</h4>
                <p className="text-foreground font-medium">{service.audience}</p>
              </div>
            )}

            <div
              className={cn(
                'rounded-lg p-6 border border-border transition-colors',
                isOdd ? 'bg-card' : 'bg-muted',
              )}
            >
              <p className="text-sm text-muted-foreground">{priceLabel}</p>
              <p className={cn('text-4xl font-bold', accentColorClass)}>{service.price || 'Contact for Quote'}</p>
              <Button
                asChild
                className={cn(
                  'w-full mt-4 text-white font-semibold transition-all',
                  serviceTheme.buttonClass || 'bg-primary hover:bg-primary/90'
                )}>
                <Link href="/contact">
                  Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ServiceDetailCard;
