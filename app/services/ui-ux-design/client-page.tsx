// /Users/macbookair/Documents/IllusionTech-Development/app/services/ui-ux-design/client-page.tsx
'use client';

import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  Palette,
  Layers,
  Users,
  DraftingCompass,
  Search,
  Lightbulb,
  Heart,
  TrendingUp,
  Users2,
  LucideProps,
  ChevronDown,
} from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { IServiceData } from '@/lib/models/Service';
import ContactTeaser from '@/components/ContactTeaser';
import { useIsMobile } from '@/hooks/useIsMobile';

// Define IconComponent type
type IconComponent = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

// Define data structure types
type DesignService = {
  icon: IconComponent;
  name: string;
  description: string;
};

type DesignProcessStep = {
  icon: IconComponent;
  name: string;
  description: string;
};

type DesignPhilosophyPoint = {
  icon: IconComponent;
  title: string;
  description: string;
};

// Refactor data arrays
const staticDesignServices: DesignService[] = [
  {
    icon: Palette,
    name: 'Visual & UI Design',
    description:
      'We create stunning, pixel-perfect interfaces that are not only beautiful but also intuitive and easy to navigate, ensuring a delightful user experience.',
  },
  {
    icon: Users,
    name: 'User Experience (UX) Strategy',
    description:
      'Through user research, personas, and journey mapping, we build a strategic foundation to create products that truly meet user needs and business goals.',
  },
  {
    icon: DraftingCompass,
    name: 'Wireframing & Prototyping',
    description:
      'We build interactive wireframes and high-fidelity prototypes that allow you to visualize and test the user flow before a single line of code is written.',
  },
  {
    icon: Layers,
    name: 'Brand Identity & Logo Design',
    description:
      'From a memorable logo to a complete brand style guide, we craft a cohesive visual identity that tells your brand’s story and resonates with your audience.',
  },
];

const designProcess: DesignProcessStep[] = [
  {
    icon: Search,
    name: '1. Discover & Research',
    description:
      'We start by understanding your business goals, target audience, and market landscape through workshops and in-depth research.',
  },
  {
    icon: DraftingCompass,
    name: '2. Wireframe & Prototype',
    description:
      'Next, we create low-fidelity wireframes and interactive prototypes to map out user flows and define the core structure.',
  },
  {
    icon: Palette,
    name: '3. Visual Design',
    description:
      'Our designers craft a stunning, high-fidelity user interface that aligns with your brand identity and engages your users.',
  },
  {
    icon: Lightbulb,
    name: '4. Test & Iterate',
    description:
      'We conduct user testing to gather feedback and refine the design, ensuring the final product is both beautiful and intuitive.',
  },
];

const designPhilosophy: DesignPhilosophyPoint[] = [
  {
    icon: Heart,
    title: 'User-Centric Approach',
    description:
      'We place your users at the heart of our design process, creating intuitive and enjoyable experiences that foster loyalty and engagement.',
  },
  {
    icon: TrendingUp,
    title: 'Business-Driven Results',
    description:
      'Our designs are not just visually appealing; they are strategic assets crafted to meet your business objectives and drive measurable growth.',
  },
  {
    icon: Users2,
    title: 'Collaborative Partnership',
    description:
      'We believe the best results come from working together. We partner with you at every step, ensuring your vision is brought to life.',
  },
];

interface UIUXDesignClientPageProps {
  service: (IServiceData & { _id: string }) | null;
}

export default function UIUXDesignClientPage({ service }: UIUXDesignClientPageProps) {
  const designServices =
    service?.keyFeatures?.map((kf, i) => ({
      // Use the icon from the static data as a fallback
      icon: staticDesignServices[i]?.icon || Palette,
      name: kf.title,
      description: kf.description,
    })) || staticDesignServices;  const isMobile = useIsMobile();
  const iconHover = { scale: 1.15, rotate: -5 };
  const iconTransition = { type: 'spring', stiffness: 300, damping: 15 };

  // Logic to detect scroll direction and position
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    return scrollY.on('change', (currentY) => {
      if (currentY > lastY.current) {
        setScrollDirection('down');
      } else if (currentY < lastY.current) {
        setScrollDirection('up');
      }
      lastY.current = currentY;
      // A small threshold to avoid flickering on some devices
      setIsAtTop(currentY < 10);
    });
  }, [scrollY]);

  // Dynamic variants for the services section based on scroll direction
  const servicesStaggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: scrollDirection === 'down' ? 1 : -1,
      },
    },
  };

  const arrowVariants = {
    visible: {
      opacity: 1,
      y: [0, 10, 0],
      transition: {
        y: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        },
        opacity: { duration: 0.3 },
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('core-services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header Section */}
      <AnimatedSection
        className="bg-gray-900 dark:bg-black py-20 md:py-28 min-h-screen flex flex-col items-center justify-center relative"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container text-center">
          <motion.h1
            variants={createItemVariants(isMobile)}
            className="text-4xl md:text-5xl font-bold text-white"
                    >{service?.name || 'Designing Experiences that Delight'}

          </motion.h1>
          <motion.p
            variants={createItemVariants(isMobile)}
            className="mt-4 text-lg md:text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto"
                    >{service?.description || 'We craft intuitive, beautiful, and user-centric digital experiences that solve real problems and drive business growth.'}

          </motion.p>
        </div>
        <motion.button
          className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
          onClick={handleScrollDown}
          aria-label="Scroll to next section"
          variants={arrowVariants}
          initial={false}
          animate={isAtTop ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </AnimatedSection>

      {/* Service Details Section */}
      <AnimatedSection
        id="core-services"
        className="py-16 md:py-24 bg-white dark:bg-background min-h-screen flex flex-col justify-center"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
          >
            Our Core Design Services
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={servicesStaggerContainer}
          >
            {designServices.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  variants={createItemVariants(isMobile)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="bg-card border border-border/20 dark:border-border/50 p-8 rounded-lg text-center items-center shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-accent/10 cursor-default"
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={iconHover}
                    transition={iconTransition}
                  >
                    <Icon className="w-10 h-10 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Design Process Section */}
      <AnimatedSection
        className="py-16 md:py-24 bg-gray-50 dark:bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground"
          >
            Our Design Process
          </motion.h2>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-y-16 md:gap-8">
            <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-200 dark:bg-border hidden md:block" />
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 dark:bg-border md:hidden" />
            {designProcess.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.name}
                  variants={createItemVariants(isMobile)}
                  whileHover={{ y: -4 }}
                  className="relative flex flex-col items-center text-center p-4 rounded-lg transition-colors hover:bg-background/50 dark:hover:bg-background"
                >
                  <motion.div
                    className="flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-card shadow-md border border-gray-200 dark:border-border z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={iconTransition}
                  >
                    <Icon className="w-8 h-8 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mt-6 mb-2">
                    {step.name}
                  </h3>
                  <p className="text-muted-foreground px-4">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Design Philosophy Section */}
      <AnimatedSection
        className="py-16 md:py-24 bg-white dark:bg-background"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
          >
            Our Design Philosophy
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {designPhilosophy.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={createItemVariants(isMobile)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="bg-card border border-border/20 dark:border-border/50 p-8 rounded-lg shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-accent/10 cursor-default"
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={iconHover}
                    transition={iconTransition}
                  >
                    <Icon className="h-10 w-10 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection
        className="py-20 md:py-28 bg-gray-50 dark:bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container text-center">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4"
          >
            Ready to Build Something Beautiful?
          </motion.h2>
          <motion.p
            variants={createItemVariants(isMobile)}
            className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Let's collaborate to create a design that not only looks great but
            also delivers an exceptional user experience.
          </motion.p>
          <motion.div variants={createItemVariants(isMobile)}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="large">
                <Link href="/contact">Start Your Design Project</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
