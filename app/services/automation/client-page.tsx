// /Users/macbookair/Documents/IllusionTech-Development/app/services/automation/client-page.tsx
"use client";

import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  Zap,
  Bot,
  Link2,
  SlidersHorizontal,
  BarChart3,
  ShieldCheck,
  Scaling,
  Rocket,
  Search,
  LayoutTemplate,
  Code,
  TestTube2,
  Wrench,
  LucideProps,
  ChevronDown,
} from 'lucide-react';
import { motion, useScroll } from 'framer-motion';

// Type definition for Lucide icons
type IconComponent = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

// Type definitions for our data structures
type AutomationService = {
  icon: IconComponent;
  name: string;
  description: string;
};

type WhyChooseUsPoint = {
  icon: IconComponent;
  title: string;
  description: string;
};

type AutomationProcessStep = {
  icon: IconComponent;
  step: string;
  name: string;
  description: string;
};

// Updated service details
const automationServices: AutomationService[] = [
  {
    icon: Link2,
    name: 'Custom API Integrations',
    description:
      'Connect disparate systems and software for a unified, seamless data flow across your entire business.',
  },
  {
    icon: Zap,
    name: 'Business Process Automation',
    description:
      'Automate repetitive, manual tasks to save valuable time, reduce human error, and boost overall productivity.',
  },
  {
    icon: Bot,
    name: 'AI & Chatbot Development',
    description:
      'Deploy intelligent bots to handle customer service queries, automate data entry, or manage internal workflows.',
  },
  {
    icon: SlidersHorizontal,
    name: 'Workflow Optimization',
    description:
      'We analyze your existing processes and design streamlined, efficient workflows to maximize your operational output.',
  },
];

// New "Why Choose Us" data
const whyChooseUsPoints: WhyChooseUsPoint[] = [
  {
    icon: BarChart3,
    title: 'Increased Efficiency',
    description:
      'Eliminate bottlenecks and free up your team to focus on high-value work.',
  },
  {
    icon: ShieldCheck,
    title: 'Enhanced Accuracy',
    description:
      'Reduce human error in data entry and processing for more reliable outcomes.',
  },
  {
    icon: Scaling,
    title: 'Scalable Solutions',
    description:
      'Our automations grow with your business, adapting to new challenges and increased demand.',
  },
  {
    icon: Rocket,
    title: 'Competitive Advantage',
    description:
      'Operate faster and smarter than your competition by leveraging cutting-edge automation.',
  },
];

// New "Our Process" data
const automationProcess: AutomationProcessStep[] = [
  {
    icon: Search,
    step: '01',
    name: 'Discovery & Analysis',
    description:
      'We start by deeply understanding your current workflows, identifying pain points and opportunities for automation.',
  },
  {
    icon: LayoutTemplate,
    step: '02',
    name: 'Strategy & Design',
    description:
      'We design a custom automation strategy and blueprint, outlining the tools, integrations, and expected ROI.',
  },
  {
    icon: Code,
    step: '03',
    name: 'Development & Integration',
    description:
      'Our experts build and integrate the custom solution, writing clean, efficient code and connecting APIs.',
  },
  {
    icon: TestTube2,
    step: '04',
    name: 'Testing & Deployment',
    description:
      'We rigorously test the automation in a controlled environment before deploying it seamlessly into your live operations.',
  },
  {
    icon: Wrench,
    step: '05',
    name: 'Support & Optimization',
    description:
      'We provide ongoing support and continuously look for ways to optimize your automated workflows for peak performance.',
  },
];

// Animation Variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export default function AutomationClientPage() {
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

  // Variants for the scroll-down arrow button
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
    const nextSection = document.getElementById('automation-services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic variants for the process section based on scroll direction
  const processStaggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
        staggerDirection: scrollDirection === 'down' ? 1 : -1,
      },
    },
  };

  return (
    <div className="bg-background text-foreground">
      {/* Header Section */}
      <motion.section
        className="relative bg-gray-900 dark:bg-black min-h-screen flex flex-col items-center justify-center"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-grid-gray-700/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
        <div className="container text-center relative">
          <motion.div
            className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-sm font-semibold mb-4"
            variants={fadeIn}
          >
            Efficiency Unleashed
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white leading-tight"
            variants={fadeIn}
          >
            Automate Workflows, Integrate Systems
          </motion.h1>
          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            variants={fadeIn}
          >
            Unlock new levels of productivity. We build custom automation and
            integration solutions that allow your business to work smarter, not
            harder.
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
      </motion.section>

      {/* Service Details Section */}
      <motion.section
        id="automation-services"
        className="py-16 md:py-24 bg-gray-50 dark:bg-background min-h-screen flex flex-col justify-center"
        initial="initial"
        whileInView="animate"
        viewport={{ amount: 0.2, once: false }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground">
              Our Automation & Integration Services
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              From simple task automation to complex multi-platform
              integrations, we have you covered.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {automationServices.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  className="bg-white dark:bg-card p-8 rounded-xl shadow-lg flex flex-col text-center items-center transition-shadow duration-300 hover:shadow-2xl border border-gray-200 dark:border-border/50 hover:border-accent"
                  variants={fadeIn}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="mb-5"
                    whileHover={iconHover}
                    transition={iconTransition}
                  >
                    <Icon className="w-10 h-10 text-accent" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-card-foreground mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground flex-grow">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Our Process Section */}
      <motion.section
        className="py-16 md:py-24 overflow-hidden bg-white dark:bg-muted"
        initial="initial"
        whileInView="animate"
        viewport={{ amount: 0.1, once: false }}
        variants={processStaggerContainer}
      >
        <div className="container">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground">
              Our 5-Step Automation Process
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              A structured approach to ensure successful and impactful
              automation implementation.
            </p>
          </motion.div>
          <div className="relative">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-border hidden md:block"
              aria-hidden="true"
            ></div>
            {automationProcess.map((item, index) => {
              const Icon = item.icon;
              const itemVariant = index % 2 === 0 ? slideInLeft : slideInRight;
              return (
                <motion.div
                  key={item.name}
                  className="relative md:grid md:grid-cols-2 md:gap-8 items-center mb-12"
                  variants={itemVariant}
                >
                  <div
                    className={`md:text-right ${
                      index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                    }`}
                  >
                    <motion.div
                      className="p-6 bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-border transition-shadow hover:shadow-xl"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <div className="flex items-center justify-center md:justify-end mb-4">
                        <span className="text-3xl font-bold text-primary mr-4">
                          {item.step}
                        </span>
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-card-foreground mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-muted-foreground">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                  <div
                    className={`hidden md:block ${
                      index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                    }`}
                  ></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        className="py-16 md:py-24 bg-gray-50 dark:bg-background"
        initial="initial"
        whileInView="animate"
        viewport={{ amount: 0.2, once: false }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground">
              The IllusionTech Advantage
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              We don't just build automations; we build strategic assets for
              your business.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUsPoints.map((point) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  className="flex items-start space-x-4 p-4 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-muted"
                  variants={fadeIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="flex-shrink-0 bg-accent/10 p-3 rounded-full">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-foreground">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 md:py-28 bg-white dark:bg-muted"
        initial="initial"
        whileInView="animate"
        viewport={{ amount: 0.5, once: false }}
        variants={fadeIn}
      >
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's discuss how our automation and integration expertise can
            elevate your operations and drive growth.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="large">
              <Link href="/contact">Consult With an Expert</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
