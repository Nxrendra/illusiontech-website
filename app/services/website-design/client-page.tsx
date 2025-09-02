// /Users/macbookair/Documents/IllusionTech-Development/app/services/website-design/client-page.tsx
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
  LayoutDashboard,
  Palette,
  FileCode,
  MessageSquare,
  Sparkles,
  Rocket,
  Wrench,
  Users,
  TrendingUp,
  ShieldCheck,
  Target,
  Feather,
  BarChart,
  ChevronDown,
  LucideProps,
} from 'lucide-react';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { IServiceData } from '@/lib/models/Service';
import ContactTeaser from '@/components/ContactTeaser';
import { useIsMobile } from '@/hooks/useIsMobile';

type IconComponent = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

type DesignFocusPoint = {
  icon: IconComponent;
  name: string;
  description: string;
};

const staticDesignFocusPoints: DesignFocusPoint[] = [
  {
    icon: LayoutDashboard,
    name: 'Custom Layouts',
    description:
      'We create unique, clean, and responsive layouts tailored specifically for your brand and business goals.',
  },
  {
    icon: Palette,
    name: 'Visual Branding',
    description:
      'We integrate your brand colors, typography, and imagery to create a cohesive and professional look.',
  },
  {
    icon: FileCode,
    name: 'Theme and Template Design',
    description:
      'Designing custom themes or templates for Content Management Systems (CMS) or static site generators.',
  },
  {
    icon: MessageSquare,
    name: 'Design Consultation',
    description:
      'Get expert advice on design choices, user flow, and visual strategies to maximize your website’s impact.',
  },
];

type FeaturePoint = {
  icon: IconComponent;
  name: string;
  description: string;
};

const staticWhyChooseUsPoints: FeaturePoint[] = [
  {
    icon: Users,
    name: 'Collaborative Process',
    description:
      'We work closely with you at every step to ensure the final design perfectly aligns with your vision and goals.',
  },
  {
    icon: TrendingUp,
    name: 'Data-Driven Design',
    description:
      'Our designs aren’t just beautiful; they are informed by user data and analytics to optimize for conversions and user engagement.',
  },
  {
    icon: ShieldCheck,
    name: 'Future-Proof & Scalable',
    description:
      'We create flexible and scalable design systems that grow with your business, ensuring long-term consistency and value.',
  },
];

const staticDesignPhilosophyPoints = [
  {
    icon: Target,
    name: 'User-Centric at Heart',
    description:
      'We believe the best designs are born from a deep understanding of your users. Every choice we make is guided by their needs and behaviors to create a truly intuitive experience.',
  },
  {
    icon: Feather,
    name: 'Clarity and Simplicity',
    description:
      'In a world of complexity, we strive for simplicity. We create clean, uncluttered interfaces that communicate your message clearly and guide users effortlessly.',
  },
  {
    icon: BarChart,
    name: 'Business-Driven Results',
    description:
      'Aesthetics are important, but results are paramount. Our designs are strategically crafted to not only look beautiful but to drive conversions and achieve your business goals.',
  },
];

const staticDesignProcess: FeaturePoint[] = [
  {
    icon: Sparkles,
    name: '1. Consultation & Strategy',
    description:
      'We begin by understanding your vision, audience, and goals to create a tailored design strategy that sets the foundation for success.',
  },
  {
    icon: Palette,
    name: '2. Design & Mockups',
    description:
      'Our team crafts high-fidelity mockups and interactive prototypes, allowing you to see and feel your website before development begins.',
  },
  {
    icon: Wrench,
    name: '3. Development Hand-off',
    description:
      'We provide developers with a comprehensive package of assets, style guides, and clear specifications for a seamless transition to code.',
  },
  {
    icon: Rocket,
    name: '4. Launch & Review',
    description:
      'After development, we perform a final design review to ensure pixel-perfect implementation and a flawless launch.',
  },
];

interface WebsiteDesignClientPageProps {
  service: (IServiceData & { _id: string }) | null;
}

export default function WebsiteDesignClientPage({ service }: WebsiteDesignClientPageProps) {
  const allKeyFeatures = service?.keyFeatures || [];

  // Filter features for each section. Use lowercase, simple names.
  const focusFeatures = allKeyFeatures.filter(f => f.section === 'focus');
  const whyUsFeatures = allKeyFeatures.filter(f => f.section === 'why-us');
  const philosophyFeatures = allKeyFeatures.filter(f => f.section === 'philosophy');
  const processFeatures = allKeyFeatures.filter(f => f.section === 'process');

  // Use CMS data if available, otherwise fall back to static data for the entire section.
  const designFocusPoints = focusFeatures.length > 0
    ? focusFeatures.map((feature, i) => ({
        icon: staticDesignFocusPoints[i]?.icon || LayoutDashboard,
        name: feature.title,
        description: feature.description,
      }))
    : staticDesignFocusPoints;

  const whyChooseUsPoints = whyUsFeatures.length > 0
    ? whyUsFeatures.map((feature, i) => ({
        icon: staticWhyChooseUsPoints[i]?.icon || Users,
        name: feature.title,
        description: feature.description,
      }))
    : staticWhyChooseUsPoints;

  const designPhilosophyPoints = philosophyFeatures.length > 0
    ? philosophyFeatures.map((feature, i) => ({
        icon: staticDesignPhilosophyPoints[i]?.icon || Target,
        name: feature.title,
        description: feature.description,
      }))
    : staticDesignPhilosophyPoints;

  const designProcess = processFeatures.length > 0
    ? processFeatures.map((feature, i) => ({
        icon: staticDesignProcess[i]?.icon || Sparkles,
        name: feature.title,
        description: feature.description,
      }))
    : staticDesignProcess;

  const isMobile = useIsMobile();
  const iconHover = { scale: 1.1, rotate: -5 };
  const iconTransition = { type: 'spring', stiffness: 400, damping: 15 };

  // Logic to detect scroll direction
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

  // Dynamic variants for the focus section based on scroll direction
  const focusStaggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
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
    const nextSection = document.getElementById('focus-on');
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
            className="text-4xl md:text-5xl font-bold text-white font-playfair"
          >{service?.name ?? "Designs That Speak Your Brand's Language"}</motion.h1>
          <motion.p
            variants={createItemVariants(isMobile)}
            className="mt-4 text-lg md:text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto"
          >{service?.longDescription ||
              'First impressions matter. We specialize in creating visually stunning and intuitive website designs that engage users and reflect the unique identity of your brand.'}
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
        id="focus-on"
        className="py-16 md:py-24 bg-background"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-16 md:mb-20"
          >
            What We Focus On
          </motion.h2>
          <motion.div
            className="space-y-20 md:space-y-28"
            variants={focusStaggerContainer}
          >
            {designFocusPoints.map((feature, index) => (
              <motion.div
                key={feature.name}
                variants={createItemVariants(isMobile)}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center p-8 rounded-lg cursor-default"
              >
                <div
                  className={`flex justify-center ${
                    index % 2 !== 0 ? 'md:order-last' : ''
                  }`}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: index % 2 === 0 ? -5 : 5,
                    }}
                    transition={iconTransition}>
                    <feature.icon className="w-20 h-20 text-muted-foreground transition-colors group-hover:text-accent" />
                  </motion.div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 transition-colors group-hover:text-accent">
                    {feature.name}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Why Choose Us Section */}
      <AnimatedSection
        className="py-16 md:py-24 bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={createItemVariants(isMobile)} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose IllusionTech?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're more than just designers; we're your strategic partners.
                We invest time in understanding your business to deliver designs
                that are not only beautiful but also drive tangible results.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseUsPoints.map((point) => {
                const Icon = point.icon;
                return (
                <motion.div
                  key={point.name}
                  variants={createItemVariants(isMobile)}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="bg-card p-8 rounded-lg shadow-md border border-border/50 text-center transition-shadow hover:shadow-xl cursor-default overflow-hidden"
                >
                  <div className="flex justify-center mb-4">
                    <motion.div
                      className="flex items-center justify-center h-16 w-16 rounded-full bg-accent"
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {point.name}
                  </h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </motion.div>
              )})}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Our Design Philosophy Section */}
      <AnimatedSection
        className="py-16 md:py-24 bg-background"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container max-w-4xl mx-auto">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Our Design Philosophy
          </motion.h2>
          <motion.div
            className="space-y-12"
            variants={containerVariants}
          >
            {designPhilosophyPoints.map((point) => {
              const Icon = point.icon;
              return (
              <motion.div
                key={point.name}
                variants={createItemVariants(isMobile)}
                initial={{ background: 'transparent' }}
                whileHover={{
                  background: 'hsl(var(--muted))',
                  borderColor: 'hsl(var(--accent))',
                }}
                className="flex flex-col md:flex-row items-center text-center md:text-left p-6 rounded-lg border border-transparent transition-colors"
              >
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
                  <motion.div whileHover={iconHover} transition={iconTransition}>
                    <Icon className="w-12 h-12 text-accent" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {point.name}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            )})}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Design Process Section */}
      <AnimatedSection
        className="py-16 md:py-24 bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Our Design Process
          </motion.h2>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-y-16 md:gap-8">
            <div className="absolute top-8 left-0 w-full h-0.5 bg-border hidden md:block" />
            <div className="absolute left-8 top-0 h-full w-0.5 bg-border md:hidden" />
            {designProcess.map((step) => {
              const Icon = step.icon;
              return (
              <motion.div
                key={step.name}
                variants={createItemVariants(isMobile)}
                whileHover={{ y: -4 }}
                className="relative flex flex-col items-center text-center p-4 rounded-lg transition-colors hover:bg-background/50"
              >
                <motion.div
                  className="flex items-center justify-center h-16 w-16 rounded-full bg-background shadow-md border border-border z-10"
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
            )})}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection
        className="py-20 md:py-28 bg-gray-900"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container text-center">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Bring Your Vision to Life
          </motion.h2>
          <motion.p
            variants={createItemVariants(isMobile)}
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Let’s create a website design that captures your brand and excites
            your visitors.
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

      <ContactTeaser />
    </>
  );
}
