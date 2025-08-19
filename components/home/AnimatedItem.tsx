'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

interface Props extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const AnimatedItem = ({ children, ...rest }: Props) => {
  return <motion.div variants={itemVariants} {...rest}>{children}</motion.div>;
};
