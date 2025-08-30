'use client';
import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { motion, useInView, animate, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Rocket,
  Building,
  Star,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Search,
  Palette,
  Code,
  Users,
  Globe,
  Layers,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants, createItemVariantsLeft, createItemVariantsRight } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { HeroSection } from '@/components/home/HeroSection'; // Keep this
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection'; // Add this
import { SectionHeader } from '@/components/home/SectionHeader';
import { ServicesPreviewSection } from '@/components/home/ServicesPreviewSection';
import { PrinciplesSection } from '@/components/home/PrinciplesSection';
import { TechStackSection } from '@/components/home/TechStackSection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { DigitalKnowledgeSection } from '@/components/home/DigitalKnowledgeSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { ServiceWithIcon } from './page';
import { IPageContentData } from '@/lib/models/PageContent';
import { getIcon } from '@/lib/get-icon';

import TechIcon from '@/components/home/TechIcon';

import DOMPurify from 'isomorphic-dompurify';

const milestones = [
  {
    icon: 'Star',
    value: 100,
    suffix: '%',
    label: 'Client Satisfaction',
  },
  {
    icon: 'Zap',
    value: 3,
    suffix: 'x',
    label: 'Faster Load Times',
  },
  {
    icon: 'Code',
    value: 50,
    suffix: 'k+',
    label: 'Lines of Code Written',
  },
  {
    icon: 'Clock',
    value: 24,
    suffix: '/7',
    label: 'Support Availability',
  },
];

// A simple parallax section component
interface ParallaxSectionProps {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
}

const ParallaxSection = ({ imageUrl, children, className }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-gray-900 dark:bg-black ${className}`}
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          y,
        }}
      >
        <Image
          src={imageUrl}
          alt="" // Alt text is empty as the image is purely decorative
          fill
          style={{ objectFit: 'cover' }}
          quality={75}
          sizes="100vw"
        />
      </motion.div>
      <motion.div
        className="relative container text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    </div>
  );
};

function AnimatedNumber({ value, suffix = '' }: { value: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {displayValue}{suffix}
    </span>
  );
}

interface HomeClientPageProps {
  services: ServiceWithIcon[];
  content: IPageContentData;
}

export default function HomeClientPage({ services, content }: HomeClientPageProps) {
  const isMobile = useIsMobile();
  const [hoveredKnowledgeIndex, setHoveredKnowledgeIndex] = useState<number | null>(null);
  // RobotAssistant removed - no longer needed

  // Effect to prevent the browser from auto-scrolling on refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const dynamicMilestones = content.milestones?.length ? content.milestones : milestones;

  return (
    <>
      <HeroSection content={content} />

      <WhyChooseUsSection content={content} />

      {/* Parallax Section 1 */}
      <ParallaxSection
        imageUrl="/images/tech-image1.jpeg"
        className="py-32 md:py-48"
      >
        <motion.h2
          variants={createItemVariants(isMobile)}
          className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-6"
        >
          {content.homeParallax1Heading ?? 'The Future is Digital. Let’s Build It Together.'}
        </motion.h2>
        <motion.p
          variants={createItemVariants(isMobile)}
          className="text-gray-200 max-w-3xl mx-auto text-lg md:text-xl mb-8"
        >
          {content.homeParallax1Subheading ?? "We combine innovative design with powerful technology to create web experiences that drive results. Let's discuss how we can elevate your digital presence."}
        </motion.p>
        <motion.div variants={createItemVariants(isMobile)}>
          <Button asChild size="large" variant="secondary">
            <Link href="/contact">{content.homeParallax1CtaButtonText ?? 'Start Your Project'}</Link>
          </Button>
        </motion.div>
      </ParallaxSection>

      <ServicesPreviewSection services={services} content={content} />

      {/* Animated Stats Section */}
      <ParallaxSection
        imageUrl="/images/tech-image3.png"
        className="py-20 md:py-28"
      >
        <motion.div variants={createItemVariants(isMobile)} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {content.homeMilestonesHeading ?? 'Our Milestones'}
          </h2>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            {content.homeMilestonesSubheading ?? 'We are proud of what we do. Our commitment to excellence is reflected in our numbers.'}
          </p>
        </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white"
          >
            {dynamicMilestones.map((milestone) => {
              const icon = getIcon(milestone.icon);
              return (
                <motion.div
                  key={milestone.label}
                  variants={createItemVariants(isMobile)}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex flex-col items-center text-center p-6 rounded-xl border border-white/20 transition-colors duration-300"
                >
                  <div className="mb-4">{icon && React.cloneElement(icon, { className: "w-10 h-10 text-accent" })}</div>
                  <AnimatedNumber value={milestone.value} suffix={milestone.suffix} />
                  <p className="mt-2 text-gray-300">{milestone.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
      </ParallaxSection>

      <PrinciplesSection content={content} />

      {/* Newsletter Section */}
      <NewsletterSection content={content} />

      <ProcessSection content={content} />

      <DigitalKnowledgeSection content={content} />

      <TechStackSection content={content} />

      {/* Final CTA Section */}
      <ParallaxSection
        imageUrl="/images/tech-image2.jpeg"
        className="py-20 md:py-32"
      >
        <motion.h2
          variants={createItemVariants(isMobile)}
          className="text-3xl md:text-4xl font-bold text-white mb-6"
        >
          {content.homeParallax2Heading ?? 'Ready to Build Something Incredible?'}
        </motion.h2>
        <motion.p
          variants={createItemVariants(isMobile)}
          className="text-lg text-gray-200 max-w-2xl mx-auto mb-10"
        >
          {content.homeParallax2Subheading ?? "Have an idea for a project? We're here to turn your vision into a digital reality. Let's collaborate and create something that stands out from the crowd."}
        </motion.p>
        <motion.div variants={createItemVariants(isMobile)}>
          <Button asChild size="large" variant="secondary">
            <Link href="/contact">{content.homeParallax2CtaButtonText ?? 'Request a Quote'}</Link>
          </Button>
        </motion.div>
      </ParallaxSection>
    </>
  );
}
