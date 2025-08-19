'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { subNavServices } from '@/lib/data/services';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ServicesSubNav() {
  const pathname = usePathname();

  return (
    // This component is now designed to be rendered inside another container (like the main header).
    // The background and positioning are handled by the parent.
    <div className="container border-t border-border/20">
      <motion.nav
        className="flex items-center justify-start md:justify-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ul className="flex items-center space-x-2 sm:space-x-4 py-3">
          {subNavServices.map((service) => {
            // The sub-nav should highlight the link if the current path starts with the service link.
            const isActive = pathname?.startsWith(service.link);

            return (
              <motion.li key={service.name} variants={itemVariants}>
                <Link
                  href={service.link}
                  className={clsx(
                    'block whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 border-b-2',
                    {
                      'text-accent border-accent': isActive,
                      'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted': !isActive,
                    }
                  )}
                >
                  {service.name}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}
