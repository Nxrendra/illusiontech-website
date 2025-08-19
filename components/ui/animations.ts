import type { Variants } from 'framer-motion';

const getTransition = (isMobile: boolean) => ({
  duration: isMobile ? 0.35 : 0.6,
  ease: 'easeOut',
});

/**
 * Creates variants for a vertical fade-in animation.
 * @param isMobile - Adjusts animation speed for mobile.
 */
export const createItemVariants = (isMobile: boolean): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: getTransition(isMobile),
  },
});

/**
 * Creates variants for a container that staggers its children's animations.
 * @param isMobile - Adjusts stagger speed for mobile.
 */
export const createContainerVariants = (isMobile: boolean): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: isMobile ? 0.08 : 0.15,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
});

/**
 * Creates variants for a horizontal fade-in from the left.
 * @param isMobile - Adjusts animation speed for mobile.
 */
export const createItemVariantsLeft = (isMobile: boolean): Variants => ({
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: getTransition(isMobile),
  },
});

/**
 * Creates variants for a horizontal fade-in from the right.
 * @param isMobile - Adjusts animation speed for mobile.
 */
export const createItemVariantsRight = (isMobile: boolean): Variants => ({
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: getTransition(isMobile),
  },
});
