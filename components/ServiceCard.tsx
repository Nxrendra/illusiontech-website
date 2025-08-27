'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, Users } from 'lucide-react';
import { IServiceData } from '@/lib/models/Service';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface ServiceCardProps {
  service: Omit<IServiceData, 'icon'> & { _id: string; icon: React.ReactElement };
  /** When true, the card will strictly fill its parent (carousel controls size). */
  isCarouselCard?: boolean;
  /** When true, the card is fully visible and interactive. Controlled by carousel. */
  isActive?: boolean;
  /** When true, indicates the carousel is in a mobile layout. */
  isMobile?: boolean;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isCarouselCard = false,
  isActive = true, // Default to true for standalone usage
  isMobile = false,
  className = '',
}) => {
  // Provide default theme values to prevent errors if `service.theme` is undefined.
  const theme = service.theme || {};
  const gradient = theme.gradient || 'from-gray-700 to-gray-900'; // A sensible default gradient
  const accentClass = theme.accentClass || 'text-primary'; // Default to primary accent color

  return (
    <motion.div
      whileHover={isCarouselCard ? {} : { y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className={cn(
        'relative rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-colors duration-300', // Base classes for the card
        isActive
          ? cn('shadow-black/20 bg-gradient-to-br border-transparent', gradient)
          : 'bg-card border-border', // Inactive state
        // Let the parent (carousel) control width/height
        isCarouselCard ? 'w-full h-full' : 'w-full sm:max-w-md', // Standalone card size
        className,
      )}
    >
      {/* Shimmer effect for active cards */}
      {isActive && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[-150%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-light-shimmer"></div>
        </div>
      )}
      {/* Content */}
      <motion.div
        className="relative flex flex-col h-full p-4 flex-grow"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, delay: isActive ? 0.2 : 0 }}
      >
        <div className="flex-grow">
          {/* Header */}
          <div className="flex flex-col items-center gap-1.5 mb-4 text-center">
            <div className={cn('p-1 rounded-md transition-colors', isActive ? 'bg-white/10' : 'bg-accent/10')}>
              {React.cloneElement(service.icon, {
                className: cn('w-5 h-5 flex-shrink-0 transition-colors', isActive ? 'text-white' : accentClass),
              })}
            </div>
            <h3 className={cn("text-base font-bold leading-tight transition-colors", isActive ? 'text-white' : 'text-card-foreground')}>
              {service.name}
            </h3>
            <p className={cn('text-[11px] font-semibold', accentClass)}>
              {service.price}
            </p>
          </div>

          {/* Description */}
          <p className={cn("text-[11px] leading-snug mb-4 transition-colors", isMobile ? 'line-clamp-3' : 'line-clamp-4', isActive ? 'text-gray-300' : 'text-muted-foreground')}>
            {service.description}
          </p>

          {/* Features */}
          <h4 className={cn("font-semibold text-[11px] mb-2 text-center transition-colors", isActive ? 'text-white' : 'text-card-foreground')}>What's Included:</h4>
          <ul className={cn("w-max mx-auto space-y-1.5 mb-4 transition-colors", isActive ? 'text-gray-200' : 'text-muted-foreground')}>
            {(isCarouselCard ? (service.features || []).slice(0, 3) : (service.features || [])).map(
              (feature) => (
                <li key={feature} className="flex items-center gap-1.5">
                  <CheckCircle2 className={cn('w-3 h-3 flex-shrink-0', accentClass)} />
                  <span className="text-[10px] leading-snug">{feature}</span>
                </li>
              ),
            )}
          </ul>

          {/* Ideal For Section Wrapper - reserves space to prevent layout shifts */}
          <div className="min-h-[66px]">
            {service.audience && (
              <div className={cn(
                "flex flex-col items-center gap-1 p-1.5 rounded-md text-center transition-colors",
                isActive ? 'bg-black/20' : 'bg-muted'
              )}>
                <Users className={cn('w-3.5 h-3.5 flex-shrink-0', accentClass)} />
                <div className="leading-tight">
                  <h4 className={cn("font-semibold text-[11px] mb-0.5 transition-colors", isActive ? 'text-white' : 'text-card-foreground')}>Ideal For</h4>
                  <p className={cn("text-[10px] leading-snug transition-colors", isActive ? 'text-gray-300' : 'text-muted-foreground')}>{service.audience}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <Button
          asChild
          size="sm"
          className={cn(
            'mt-auto w-full font-semibold',
            isActive ? 'text-white bg-white/10 hover:bg-white/20 focus-visible:ring-white/40' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
          // Make button non-interactive when card is inactive
          tabIndex={isActive ? 0 : -1}
        >
          <Link
            href={service.link || '#'}
            className="group"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate">View Details</span>
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
