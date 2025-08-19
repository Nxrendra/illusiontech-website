'use client';

import { motion, useInView, useAnimate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Users, Heart, Clock } from 'lucide-react';

const stats = [
  {
    name: 'Websites Deployed',
    value: 20,
    icon: <Users className="w-8 h-8 text-accent" />,
  },
  {
    name: 'Client Satisfaction',
    value: 99,
    suffix: '%',
    icon: <Heart className="w-8 h-8 text-accent" />,
  },
  {
    name: 'Faster Delivery',
    value: 3,
    suffix: 'x',
    icon: <Clock className="w-8 h-8 text-accent" />,
  },
];

// This sub-component is well-implemented for animating the number itself.
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [scope, animate] = useAnimate();
  // Set once to false to re-animate on scroll
  const isInView = useInView(scope, { once: false, margin: '-50px' });

  useEffect(() => {
    if (isInView && scope.current) {
      animate(
        0,
        to,
        {
          duration: 2,
          ease: 'easeOut',
          onUpdate: (v) => {
            if (scope.current) {
              scope.current.textContent = Math.round(v).toString() + suffix;
            }
          },
        }
      );
    }
  }, [isInView, to, animate, scope, suffix]);

  return <span ref={scope}>0</span>;
}

// The main component is now enhanced to stagger-animate the stat cards.
export default function AnimatedStats() {
  const ref = useRef(null);
  // Set once to false to re-animate on scroll
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.name}
          variants={itemVariants}
          className="bg-gray-50 p-8 rounded-lg shadow-inner"
        >
          <div className="flex justify-center mb-4">{stat.icon}</div>
          <p className="text-4xl md:text-5xl font-bold text-accent">
            <AnimatedCounter to={stat.value} suffix={stat.suffix} />
          </p>
          <p className="text-lg text-gray-600 mt-2">{stat.name}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
