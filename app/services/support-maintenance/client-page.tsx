// /Users/macbookair/Documents/IllusionTech-Development/app/services/support-maintenance/client-page.tsx
'use client';

import {
  useState,
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
} from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Zap,
  BarChart2,
  LucideProps,
} from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { ServiceWithIcon } from './page';
import { IServiceData } from '@/lib/models/Service';
import { useIsMobile } from '@/hooks/useIsMobile';
import ServiceDetailCard from '@/components/ServiceDetailCard';


const faqs = [
  {
    question: 'Why do I need a maintenance plan?',
    answer:
      'A maintenance plan ensures your website remains secure from threats, runs at optimal speed, and stays up-to-date with the latest technologies. This protects your investment and provides a better experience for your users.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      "Yes, you can change your plan at any time to better suit your business needs. Just contact our support team, and we'll handle the transition for you.",
  },
  {
    question: 'What happens if my website goes down?',
    answer:
      "With our Growth and Premium plans, we offer uptime monitoring. We'll often know about an issue before you do and will immediately start working to resolve it to minimize any downtime.",
  },
  {
    question: "Do you work with websites you didn't build?",
    answer:
      "Absolutely. We can perform a comprehensive site audit to familiarize ourselves with your website's architecture and identify any potential issues. After the audit, we can recommend the best plan for your needs.",
  },
  {
    question: 'What is not included in these plans?',
    answer:
      'Our maintenance plans cover the ongoing health and security of your site. They do not include new feature development, major design changes, or content creation. These services can be quoted separately as part of a new project.',
  },
];

type IconComponent = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

type WhyChooseUsFeature = {
  icon: IconComponent;
  title: string;
  description: string;
};

const whyChooseUsFeatures: WhyChooseUsFeature[] = [
  {
    icon: ShieldCheck,
    title: 'Proactive Security',
    description:
      "We don't just fix problems; we prevent them. Our constant monitoring and security scans keep your site safe from threats.",
  },
  {
    icon: Zap,
    title: 'Peak Performance',
    description:
      'A slow website costs you customers. We continuously optimize your site for speed, ensuring a fast experience for every visitor.',
  },
  {
    icon: BarChart2,
    title: 'Transparent Reporting',
    description:
      "You'll receive clear, concise monthly reports detailing all the work done on your site, so you always know the value you're getting.",
  },
];

interface SupportMaintenanceClientPageProps {
  mainService: (IServiceData & { _id: string }) | null;
  plans: ServiceWithIcon[];
}

export default function SupportMaintenanceClientPage({ mainService, plans }: SupportMaintenanceClientPageProps) {
  const isMobile = useIsMobile();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const lastY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY.current) {
        setScrollDirection('down');
      } else if (currentY < lastY.current) {
        setScrollDirection('up');
      }
      lastY.current = currentY;
      setIsAtTop(currentY < 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Dynamic variants for the plans section based on scroll direction
  const plansStaggerContainer = {
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
    const nextSection = document.getElementById('maintenance-plans');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header Section */}
      <section
        className="bg-gray-900 dark:bg-black py-20 md:py-28 min-h-screen flex flex-col items-center justify-center relative"
      >
        <div className="container text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-white"
                    >{mainService?.name || 'Website Support & Maintenance'}

          </h1>
          <p
            className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
                   >{mainService?.description || 'Protect your investment and ensure your website runs smoothly with our reliable maintenance plans.'}

          </p>
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
      </section>

      {/* Maintenance Plans Section */}
      <AnimatedSection
        id="maintenance-plans"
        className="py-16 md:py-24 bg-gray-50 dark:bg-background"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground"
          >
            Our Maintenance Plans
          </motion.h2>
          <motion.div
            variants={plansStaggerContainer}
            className="space-y-12"
          >
            {plans.map((plan, index) => (
              <ServiceDetailCard key={plan._id} service={plan} isOdd={index % 2 !== 0} />
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Why Choose Us Section */}
      <AnimatedSection
        className="py-16 md:py-24 bg-white dark:bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
          >
            Why Partner with IllusionTech?
          </motion.h2>
          <motion.div
            variants={createItemVariants(isMobile)}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            {whyChooseUsFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="bg-white dark:bg-card border border-gray-100 dark:border-border p-8 rounded-lg shadow-md cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="flex justify-center mb-4"
                  >
                    <Icon className="h-10 w-10 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection
        className="py-16 md:py-24 bg-gray-50 dark:bg-background"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container max-w-4xl mx-auto">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            variants={createItemVariants(isMobile)}
            className="bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-border"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-border last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center text-left p-6 hover:bg-gray-50 dark:hover:bg-muted/50 focus:outline-none"
                >
                  <span className="text-lg font-semibold text-gray-800 dark:text-card-foreground">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        y: 0,
                        transition: {
                          height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.3, delay: 0.1 },
                          y: { duration: 0.3 },
                        },
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        y: -10,
                        transition: {
                          height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.2 },
                          y: { duration: 0.2 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-600 dark:text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection
        className="py-20 md:py-28 bg-white dark:bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container text-center">
          <motion.h2
            variants={createItemVariants(isMobile)}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4"
          >
            Have More Questions?
          </motion.h2>
          <motion.p
            variants={createItemVariants(isMobile)}
            className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Our team is here to help. Contact us for a personalized
            consultation to discuss your specific maintenance needs.
          </motion.p>
          <motion.div variants={createItemVariants(isMobile)}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="large">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
