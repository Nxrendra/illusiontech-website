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
import { HeroSection } from '@/components/home/HeroSection';
import AnimatedStats from '@/components/home/AnimatedStats';
import NewsletterSection from '@/components/home/NewsletterSection';
// RobotAssistant removed - no longer needed
import { services } from '@/lib/data/services';
import TechIcon from '@/components/home/TechIcon';

import DOMPurify from 'isomorphic-dompurify';

const whyChooseUsPoints = [
  {
    icon: <Zap className="w-8 h-8 text-accent" />,
    title: 'Bespoke Solutions',
    description:
      "We don't use templates. Every website is uniquely designed and developed in Trinidad & Tobago to meet your specific business goals and brand identity.",
  },
  {
    icon: <Code className="w-8 h-8 text-accent" />,
    title: 'Cutting-Edge Technology',
    description:
      'Leveraging modern technologies like Next.js and TypeScript, we build fast, secure, and scalable websites for clients worldwide.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-accent" />,
    title: 'Transparent Collaboration',
    description:
      'From initial consultation to final delivery, we maintain clear communication, providing regular updates and transparent pricing with no hidden fees.',
  },
];

const techStack = [
  {
    name: 'HTML5',
    icon: 'Html',
    description: 'The standard for structuring all content on the web.',
  },
  {
    name: 'CSS3',
    icon: 'Css',
    description: 'Used for styling and designing the visual presentation of web pages.',
  },
  {
    name: 'JavaScript',
    icon: 'Javascript',
    description: 'The programming language that brings interactivity to websites.',
  },
  {
    name: 'React',
    icon: 'React',
    description: 'A powerful library for building dynamic and fast user interfaces.',
  },
  {
    name: 'Next.js',
    icon: 'Nextjs',
    description: 'A React framework for building full-stack, production-ready web applications.',
  },
  {
    name: 'Node.js',
    icon: 'Nodejs',
    description: 'Allows us to run JavaScript on the server for fast and scalable backends.',
  },
  {
    name: 'MongoDB',
    icon: 'Mongodb',
    description: 'A flexible database we use to store and manage application data efficiently.',
  },
  {
    name: 'Tailwind CSS',
    icon: 'Tailwindcss',
    description: 'A utility-first CSS framework that helps us build custom designs rapidly.',
  },
  {
    name: 'Framer',
    icon: 'Framer',
    description: 'A powerful tool for creating stunning animations and interactive prototypes, like myself.',
  },
];

const principles = [
  {
      icon: <Star className="w-10 h-10 text-accent" />,
    title: 'Commitment to Quality',
    description:
      'We are obsessed with delivering pixel-perfect, high-performance products. Our commitment to quality is unwavering, ensuring every project we handle is a masterpiece of form and function.',
  },
  {
    icon: <Users className="w-10 h-10 text-accent" />,
    title: 'Client-Centric Approach',
    description:
      'Your success is our success. We believe in building strong, collaborative partnerships, listening to your needs, and aligning our strategy with your business objectives to achieve outstanding results.',
  },
  {
     icon: <Zap className="w-10 h-10 text-accent" />,
    title: 'Innovation at the Core',
    description:
      'We stay at the forefront of technology, constantly exploring new tools and techniques to deliver innovative solutions that give you a competitive edge in the digital landscape.',
  },
];

const digitalKnowledgeBase = [
  {
    icon: <Globe className="w-8 h-8 text-accent" />,
    title: "Website vs. Web Application: What's the Difference?",
    description:
      "A <strong>website</strong> is primarily informational, like a digital brochure. It presents content to visitors (e.g., a company's services, a blog, a portfolio). A <strong>web application</strong> is interactive; it's a software program that runs in your browser. It allows users to perform tasks, manipulate data, and collaborate (e.g., online banking, project management tools, or social media sites). We help you decide which is right for your goals.",
  },
  {
    icon: <Users className="w-8 h-8 text-accent" />,
    title: 'Who Benefits from a Digital Presence?',
    description:
      "Virtually everyone with a goal. For a <strong>businessman</strong>, it's a 24/7 lead generation machine and a mark of credibility. For a <strong>freelancer or artist</strong>, it's a professional portfolio to showcase work and attract clients. For a <strong>non-profit</strong>, it's a platform to raise awareness and gather support. Your digital presence is your most powerful tool for growth.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-accent" />,
    title: 'The Critical Role of Security',
    description:
      "In an age of data breaches, security is non-negotiable. A secure website protects both your business and your customers' sensitive information. This includes implementing <strong>HTTPS</strong> (the padlock in your browser), protecting against common vulnerabilities, and ensuring user data is handled responsibly. A secure site builds trust and protects your reputation.",
  },
  {
    icon: <Zap className="w-8 h-8 text-accent" />,
    title: 'Performance and SEO: Be Seen, Be Fast',
    description:
      "A slow website frustrates users and hurts your ranking on search engines like Google. We build high-performance sites that load in a flash. <strong>Search Engine Optimization (SEO)</strong> is the practice of structuring your site to rank higher in search results, driving organic traffic. From clean code to mobile-first design, we build with performance and visibility at the core.",
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Discover',
    description: 'We listen to your vision and define project goals.',
    icon: <Search className="w-10 h-10 text-accent" />,
  },
  {
    step: '02',
    title: 'Design',
    description: 'We craft intuitive UI/UX and stunning visuals.',
    icon: <Palette className="w-10 h-10 text-accent" />,
  },
  {
    step: '03',
    title: 'Develop',
    description: 'We build a robust, scalable, and secure product.',
    icon: <Code className="w-10 h-10 text-accent" />,
  },
  {
    step: '04',
    title: 'Deliver',
    description: 'We launch your project and provide ongoing support.',
    icon: <Rocket className="w-10 h-10 text-accent" />,
  },
];

const milestones = [
  {
    icon: <Star className="w-10 h-10 text-accent" />,
    value: 100,
    suffix: '%',
    label: 'Client Satisfaction',
  },
  {
    icon: <Zap className="w-10 h-10 text-accent" />,
    value: 3,
    suffix: 'x',
    label: 'Faster Load Times',
  },
  {
    icon: <Code className="w-10 h-10 text-accent" />,
    value: 50,
    suffix: 'k+',
    label: 'Lines of Code Written',
  },
  {
    icon: <Clock className="w-10 h-10 text-accent" />,
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
export default function HomeClientPage() {
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


  return (
    <>
      <HeroSection />

      {/* Why IllusionTech Section */}
      <AnimatedSection
        id="why-us"
        className="min-h-screen flex items-center bg-background py-20"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={containerVariants}
            className="max-w-lg space-y-4"
          >
            <motion.div variants={createItemVariantsLeft(isMobile)}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Why Choose IllusionTech?
              </h2>
            </motion.div>
            <motion.div variants={createItemVariantsLeft(isMobile)}>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                We're more than just developers; we're your dedicated partners
                in building a powerful online presence that drives growth and
                delivers results.
              </p>
            </motion.div>
            <motion.div variants={createItemVariantsLeft(isMobile)} className="pt-4">
              <Button asChild size="large">
                <Link href="/about">
                  Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="space-y-6"
          >
            {whyChooseUsPoints.map((point) => (
              <motion.div
                key={point.title}
                variants={createItemVariantsRight(isMobile)}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                className="group flex items-start gap-4 rounded-lg bg-card text-card-foreground p-4 shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full transition-colors duration-300 group-hover:bg-accent">
                  {React.cloneElement(point.icon, {
                    className:
                      'w-8 h-8 text-accent transition-colors duration-300 group-hover:text-white',
                  })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Parallax Section 1 */}
      <ParallaxSection
        imageUrl="/images/tech-image1.jpeg"
        className="py-32 md:py-48"
      >
        <motion.h2
          variants={createItemVariants(isMobile)}
          className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-6"
        >
          The Future is Digital. Let’s Build It Together.
        </motion.h2>
        <motion.p
          variants={createItemVariants(isMobile)}
          className="text-gray-200 max-w-3xl mx-auto text-lg md:text-xl mb-8"
        >
          We combine innovative design with powerful technology to create web
          experiences that drive results. Let's discuss how we can elevate
          your digital presence.
        </motion.p>
        <motion.div variants={createItemVariants(isMobile)}>
          <Button asChild size="large" variant="secondary">
            <Link href="/contact">Start Your Project</Link>
          </Button>
        </motion.div>
      </ParallaxSection>

      {/* Services Preview Section */}
      <AnimatedSection
        id="services"
        className="min-h-screen flex flex-col items-center justify-center bg-muted py-20"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.div
            variants={createItemVariants(isMobile)}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Core Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We offer a range of services to bring your digital ideas to life,
              from simple landing pages to complex web applications.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.filter(s => s.isCoreService).map((service) => (
              <motion.div
                key={service.name}
                variants={createItemVariants(isMobile)}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`relative bg-gradient-to-br ${service.theme.gradient} p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden`}
              >
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-25 animate-light-shimmer"></div>
                </div>
                <div className="mb-4">
                  {React.cloneElement(service.icon, {
                    className: `w-8 h-8 ${service.theme.accentClass}`,
                  })}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {service.name}
                </h3>
                <p className={`font-semibold mb-4 ${service.theme.accentClass}`}>
                  {service.price}
                </p>
                <ul className="space-y-3 text-gray-300 flex-grow mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2
                        className={`w-5 h-5 ${service.theme.accentClass} flex-shrink-0`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`mt-auto ${service.theme.buttonClass} text-white`}
                >
                  <Link href={service.link}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={createItemVariants(isMobile)} className="text-center mt-16">
            <Button
              asChild
              size="large"
            >
              <Link href="/services">See All Services</Link>
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Animated Stats Section */}
      <ParallaxSection
        imageUrl="/images/tech-image3.png"
        className="py-20 md:py-28"
      >
        <motion.div variants={createItemVariants(isMobile)} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our Milestones
          </h2>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            We are proud of what we do. Our commitment to excellence is reflected in our numbers.
          </p>
        </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white"
          >
            {milestones.map((milestone) => (
              <motion.div
                key={milestone.label}
                variants={createItemVariants(isMobile)}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center text-center p-6 rounded-xl border border-white/20 transition-colors duration-300"
              >
                <div className="mb-4">{milestone.icon}</div>
                <AnimatedNumber value={milestone.value} suffix={milestone.suffix} />
                <p className="mt-2 text-gray-300">{milestone.label}</p>
              </motion.div>
            ))}
          </motion.div>
      </ParallaxSection>

      {/* Our Principles Section */}
      <AnimatedSection
         id="principles"
        className="py-20 md:py-28 bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.div
            variants={createItemVariants(isMobile)}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Guiding Principles
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our work is driven by a core set of values that ensure
              excellence, partnership, and innovation in everything we create.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {principles.map((principle) => (
              <motion.div
                key={principle.title}
                variants={createItemVariants(isMobile)}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-card text-card-foreground p-8 rounded-xl shadow-md text-center transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">{principle.title}</h3>
                <p className="text-muted-foreground">{principle.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Our Process Section */}
      <AnimatedSection
        id="process"
        className="py-20 md:py-28 bg-background"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.div
            variants={createItemVariants(isMobile)}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Streamlined Process
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From concept to launch, we follow a structured path to ensure
              success.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {processSteps.map((item) => (
              <motion.div
                key={item.title}
                variants={createItemVariants(isMobile)}
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-muted p-8 rounded-2xl border border-border text-center transition-shadow hover:shadow-xl"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {item.step}. {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Digital Knowledge Base Section */}
      <AnimatedSection
        id="digital-knowledge"
        className="py-20 md:py-28 bg-muted"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.div
            variants={createItemVariants(isMobile)}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Building Your Digital Foundation
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Knowledge is power. We believe in empowering our clients by
              explaining the 'why' behind the 'what'. Here are some core
              concepts vital to understanding the web and making informed
              decisions for your project.
            </p>
          </motion.div>
           <motion.div
            onMouseLeave={() => setHoveredKnowledgeIndex(null)}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {digitalKnowledgeBase.map((point, index) => (
              <motion.div
                key={point.title}
                variants={createItemVariants(isMobile)}
                whileHover={{ scale: 1.05, zIndex: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onMouseEnter={() => setHoveredKnowledgeIndex(index)}
                className="relative group p-6 rounded-xl border border-border bg-card text-card-foreground overflow-hidden cursor-pointer"
              >
                <AnimatePresence>
                  {hoveredKnowledgeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-accent/5 dark:bg-accent/10 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                      {point.icon}
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground pt-3">
                      {point.title}
                    </h3>
                  </div>
                  <div
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(point.description) }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

            {/* Tech Stack Section */}
      <AnimatedSection
        id="tech-stack"
        className="py-20 md:py-28 bg-background"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container">
          <motion.div
            variants={createItemVariants(isMobile)}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Technology We Use
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We build with modern, robust, and scalable technologies to ensure
              your project's success and longevity.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap justify-center items-center gap-8"
          >
            {techStack.map((tech) => (
              <motion.div
                key={tech.name}
                variants={createItemVariants(isMobile)}
                whileHover={{ y: -5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center gap-2 text-center w-24"
              >
                <div className="h-12 w-12 flex items-center justify-center">
                  <TechIcon name={tech.icon} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Final CTA Section */}
      <ParallaxSection
        imageUrl="/images/tech-image2.jpeg"
        className="py-20 md:py-32"
      >
        <motion.h2
          variants={createItemVariants(isMobile)}
          className="text-3xl md:text-4xl font-bold text-white mb-6"
        >
          Ready to Build Something Incredible?
        </motion.h2>
        <motion.p
          variants={createItemVariants(isMobile)}
          className="text-lg text-gray-200 max-w-2xl mx-auto mb-10"
        >
          Have an idea for a project? We're here to turn your vision into a
          digital reality. Let's collaborate and create something that
          stands out from the crowd.
        </motion.p>
        <motion.div variants={createItemVariants(isMobile)}>
          <Button asChild size="large" variant="secondary">
            <Link href="/contact">Request a Quote</Link>
          </Button>
        </motion.div>
      </ParallaxSection>
    </>
  );
}
