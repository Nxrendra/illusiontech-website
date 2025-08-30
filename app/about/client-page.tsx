// /Users/macbookair/Documents/IllusionTech-Development/app/about/client-page.tsx
'use client';
import ParticleBackground from '@/components/ParticleBackground';
import { HeaderAnimation } from '@/components/ui/HeaderAnimation';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Heart,
  Users,
  Zap,
  DollarSign,
  Code,
  Smartphone,
  LayoutTemplate,
  ChevronDown,
} from 'lucide-react';
import { IPageContentData } from '@/lib/models/PageContent';
import type { ISourceOptions } from '@tsparticles/engine';
import { getIcon } from '@/lib/get-icon';


// Reusable animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// AnimatedSection wrapper
const AnimatedSection = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  );
};

// Default content for sections
const defaultCoreBeliefs = [
  {
    icon: <Heart className="w-8 h-8 text-accent" />,
    title: 'Passion for Creation',
    description: 'We are driven by a deep-seated passion for building beautiful, functional, and impactful digital products. Technology is our craft, and we pour our hearts into every project.',
  },
  {
    icon: <Users className="w-8 h-8 text-accent" />,
    title: 'Empowering Businesses',
    description: 'Our core mission is to level the playing field. We believe every business, regardless of size, deserves a high-quality digital presence that can drive growth and open new opportunities.',
  },
  {
    icon: <Zap className="w-8 h-8 text-accent" />,
    title: 'The Pursuit of Excellence',
    description: 'We are relentless in our pursuit of quality. From clean code to intuitive design, we hold ourselves to the highest standards to deliver solutions that are not just good, but exceptional.',
  },
];

const defaultFutureGoals = [
    {
        icon: <LayoutTemplate className="w-10 h-10 text-accent" />,
        title: "Customizable Web Templates",
        description: "We are developing a line of professionally designed, fully editable web templates. This will provide an affordable, high-quality starting point for businesses wanting to get online quickly without sacrificing design integrity."
    },
    {
        icon: <Smartphone className="w-10 h-10 text-accent" />,
        title: "Mobile App Development",
        description: "Expanding beyond the browser, we are gearing up to offer native mobile app development for iOS and Android, helping businesses engage with their customers on the most personal devices."
    }
];

interface AboutClientPageProps {
  content: IPageContentData;
}

export default function AboutClientPage({ content }: AboutClientPageProps) {
  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(true);

  // Use CMS content if available, otherwise use defaults
  const coreBeliefs = content.coreBeliefs?.length
    ? content.coreBeliefs.map(b => {
        const icon = getIcon(b.icon as string);
        return { ...b, icon: icon && React.cloneElement(icon, { className: "w-8 h-8 text-accent" }) };
      })
    : defaultCoreBeliefs;

  const futureGoals = content.futureGoals?.length
    ? content.futureGoals.map(g => {
        const icon = getIcon(g.icon as string);
        return { ...g, icon: icon && React.cloneElement(icon, { className: "w-10 h-10 text-accent" }) };
      })
    : defaultFutureGoals;

  const particleOptions: ISourceOptions = {
    fullScreen: { enable: false },
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
        },
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.3, max: 0.8 },
      },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        enable: true,
        speed: 4,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'out',
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    detectRetina: true,
  };

  useEffect(() => {
    return scrollY.on('change', (currentY) => {
      // A small threshold to avoid flickering on some devices
      setIsAtTop(currentY < 10);
    });
  }, [scrollY]);

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
    const nextSection = document.getElementById('our-story');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center text-white bg-gray-900 dark:bg-black"
      >
        <ParticleBackground options={particleOptions} className="absolute inset-0" />
        <HeaderAnimation
          isAtTop={isAtTop}
          title={content.aboutHeroHeading ?? 'Driven by Passion, Defined by Code.'}
          description={content.aboutHeroSubheading ?? 'We are IllusionTech—a small, dedicated team of developers and designers transforming complex problems into elegant digital solutions.'}
        />
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

      {/* Who We Are & Why We Do It */}
      <AnimatedSection id="our-story" className="py-20 md:py-28 bg-background min-h-screen flex flex-col justify-center">
        <div className="container">
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{content.aboutStoryHeading ?? 'Our Story & Our "Why"'}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.aboutStorySubheading ?? 'We started IllusionTech with a simple belief: technology should be a tool for empowerment, not a barrier. Here’s what drives us every day.'}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreBeliefs.map((belief) => (
              <motion.div
                key={belief.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-card p-8 rounded-xl border border-border text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full">
                  {belief.icon}
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">{belief.title}</h3>
                <p className="text-muted-foreground">{belief.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* The Power of the Modern Web */}
      <AnimatedSection className="py-20 md:py-28 bg-muted">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {content.aboutWebAppHeading ?? 'Beyond a Website: The Power of a Web Application'}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {content.aboutWebAppParagraph1 ?? "In today's digital landscape, a simple, static website is no longer enough. Businesses need dynamic, interactive experiences to engage customers and streamline operations. This is where web applications shine."}
            </p>
            <p
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: content.aboutWebAppParagraph2 ?? 'Unlike a traditional website which primarily displays information, a <strong>web application</strong> is a powerful tool that allows users to perform tasks. Think of customer portals, booking systems, interactive dashboards, or online stores. They offer superior engagement, data-driven insights, and scalability for your business.'
              }}
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="p-8 bg-card rounded-lg shadow-lg border border-border"
          >
            <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-card-foreground"><Code className="w-6 h-6 text-accent" />{content.aboutTechActionHeading ?? 'Our Technology in Action'}</h3>
            <p className="text-muted-foreground">
              {content.aboutTechActionParagraph ?? "The very website you are browsing is a high-performance web application built with the same cutting-edge technology we use for our clients. It demonstrates our commitment to speed, security, and a seamless user experience. It's not just a portfolio; it's a testament to our capabilities."}
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Our Pricing Philosophy */}
      <AnimatedSection className="py-20 md:py-28 bg-background">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-8 bg-primary text-primary-foreground rounded-lg shadow-2xl"
            >
                <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-accent" />
                    <h3 className="font-bold text-2xl">{content.aboutPricingHeading ?? 'Our Pricing Philosophy'}</h3>
                </div>
                <p className="text-primary-foreground/90 leading-relaxed">
                    {content.aboutPricingSubheading ?? "We believe world-class web development shouldn't come with an inaccessible price tag. Our competitive pricing is a direct result of our lean, efficient workflow and low overhead. We focus on what truly matters: writing clean code, designing beautiful interfaces, and delivering exceptional value to our clients."}
                </p>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {content.aboutPremiumHeading ?? 'Premium Quality, Accessible Price'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                {content.aboutPremiumSubheading ?? 'By leveraging modern tools and a streamlined process, we minimize unnecessary costs and pass those savings directly on to you. This allows us to provide top-tier, custom solutions that are typically associated with much larger agency fees.'}
                </p>
            </motion.div>
        </div>
      </AnimatedSection>

      {/* Future Goals */}
      <AnimatedSection className="py-20 md:py-28 bg-muted">
        <div className="container">
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{content.aboutFutureHeading ?? 'Our Vision for the Future'}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.aboutFutureSubheading ?? 'We are constantly evolving and expanding our services to better serve our clients and the broader digital community. Here’s a glimpse of what’s next.'}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {futureGoals.map((goal) => (
              <motion.div
                key={goal.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-card p-8 rounded-xl shadow-md flex items-start gap-6 border border-border"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mt-1">
                  {goal.icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{goal.title}</h3>
                    <p className="text-muted-foreground">{goal.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Final CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="container py-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4">
            {content.aboutCtaHeading ?? 'Have a Project in Mind?'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            {content.aboutCtaSubheading ?? "Let's turn your idea into an unforgettable digital experience. We're excited to hear what you're dreaming up."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="large" variant="secondary">
              <Link href="/contact">
                Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
