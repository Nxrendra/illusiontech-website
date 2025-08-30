'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, containerVariants } from '@/components/ui/AnimatedSection';
import { createItemVariants } from '@/components/ui/animations';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionHeader } from './SectionHeader';
import DOMPurify from 'isomorphic-dompurify';
import { IPageContentData } from '@/lib/models/PageContent';
import { getIcon } from '@/lib/get-icon';

const staticDigitalKnowledgeBase = [
  {
    icon: 'Globe',
    title: "Website vs. Web Application: What's the Difference?",
    description:
      "A <strong>website</strong> is primarily informational, like a digital brochure. It presents content to visitors (e.g., a company's services, a blog, a portfolio). A <strong>web application</strong> is interactive; it's a software program that runs in your browser. It allows users to perform tasks, manipulate data, and collaborate (e.g., online banking, project management tools, or social media sites). We help you decide which is right for your goals.",
  },
  {
    icon: 'Users',
    title: 'Who Benefits from a Digital Presence?',
    description:
      "Virtually everyone with a goal. For a <strong>businessman</strong>, it's a 24/7 lead generation machine and a mark of credibility. For a <strong>freelancer or artist</strong>, it's a professional portfolio to showcase work and attract clients. For a <strong>non-profit</strong>, it's a platform to raise awareness and gather support. Your digital presence is your most powerful tool for growth.",
  },
  {
    icon: 'ShieldCheck',
    title: 'The Critical Role of Security',
    description:
      "In an age of data breaches, security is non-negotiable. A secure website protects both your business and your customers' sensitive information. This includes implementing <strong>HTTPS</strong> (the padlock in your browser), protecting against common vulnerabilities, and ensuring user data is handled responsibly. A secure site builds trust and protects your reputation.",
  },
  {
    icon: 'Zap',
    title: 'Performance and SEO: Be Seen, Be Fast',
    description:
      "A slow website frustrates users and hurts your ranking on search engines like Google. We build high-performance sites that load in a flash. <strong>Search Engine Optimization (SEO)</strong> is the practice of structuring your site to rank higher in search results, driving organic traffic. From clean code to mobile-first design, we build with performance and visibility at the core.",
  },
];

export function DigitalKnowledgeSection({ content }: { content: IPageContentData }) {
  const isMobile = useIsMobile();
  const [hoveredKnowledgeIndex, setHoveredKnowledgeIndex] = useState<number | null>(null);
  const digitalKnowledgeBase = content.digitalKnowledgeBase?.length
    ? content.digitalKnowledgeBase
    : staticDigitalKnowledgeBase;

  return (
    <AnimatedSection id="digital-knowledge" className="py-20 md:py-28 bg-muted" viewport={{ once: false, amount: 0.2 }}>
      <div className="container">
        <SectionHeader
          title={content.homeKnowledgeHeading ?? 'Building Your Digital Foundation'}
          description={
            content.homeKnowledgeSubheading ??
            "Knowledge is power. We believe in empowering our clients by explaining the 'why' behind the 'what'. Here are some core concepts vital to understanding the web and making informed decisions for your project."
          }
          isMobile={isMobile}
        />
        <motion.div onMouseLeave={() => setHoveredKnowledgeIndex(null)} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {digitalKnowledgeBase.map((point, index) => {
            const icon = getIcon(point.icon);
            return (
              <motion.div key={point.title} variants={createItemVariants(isMobile)} whileHover={{ scale: 1.05, zIndex: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} onMouseEnter={() => setHoveredKnowledgeIndex(index)} className="relative group p-6 rounded-xl border border-border bg-card text-card-foreground overflow-hidden cursor-pointer">
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
                      {icon && React.cloneElement(icon, { className: 'w-8 h-8 text-accent' })}
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground pt-3">{point.title}</h3>
                  </div>
                  <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(point.description) }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}