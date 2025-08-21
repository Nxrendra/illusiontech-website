'use client';

import { motion } from 'framer-motion';
import { createItemVariants } from '@/components/ui/animations';

export const SectionHeader = ({ title, description, isMobile }: { title: string; description: string; isMobile: boolean }) => (
  <motion.div
    variants={createItemVariants(isMobile)}
    className="text-center mb-16 max-w-3xl mx-auto"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
      {title}
    </h2>
    <p className="mt-4 text-lg text-muted-foreground">
      {description}
    </p>
  </motion.div>
);