// /Users/macbookair/Documents/IllusionTech-Development/components/services/PackageDetailSection.tsx
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Award, Check, Clock, Users } from 'lucide-react';

export type Package = {
  id: string;
  icon: React.ReactElement;
  name: string;
  price: string;
  audience: string;
  description: string;
  longDescription: string;
  theme: {
    gradient: string;
    accentClass: string;
    buttonClass: string;
  };
  featured: boolean;
  timeline: string;
  keyFeatures: {
    title: string;
    description: string;
  }[];
};

type PackageDetailSectionProps = {
  pkg: Package;
  isOdd: boolean;
};

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const PackageDetailSection = ({
  pkg,
  isOdd,
}: PackageDetailSectionProps) => {
  const sectionClasses = `relative py-20 md:py-28 overflow-hidden ${
    isOdd ? 'bg-muted' : 'bg-background'
  }`;

  // The background pattern was removed as it was not dark-mode compatible.
  // It can be re-added with theme-aware colors if desired.
  const backgroundPattern = {};

  return (
    <motion.section
      id={pkg.id}
      className={sectionClasses}
      style={backgroundPattern}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container">
        <div
          className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${
            isOdd ? 'md:grid-flow-col-dense' : ''
          }`}
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: isOdd ? 2 : -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`flex items-center justify-center p-8 rounded-3xl h-80 md:h-96 bg-gradient-to-br ${
              pkg.theme.gradient
            } ${isOdd ? 'md:col-start-2' : ''}`}
          >
            {React.cloneElement(pkg.icon, {
              className: 'w-32 h-32 md:w-40 md:h-40 text-white/80',
              strokeWidth: 1.2,
            })}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`${isOdd ? 'md:col-start-1' : ''} relative`}
          >
            {pkg.featured && (
              <motion.div
                variants={itemVariants}
                className="absolute -top-4 -left-4 z-10 flex transform items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-yellow-900 shadow-lg -rotate-12"
              >
                <Award className="h-5 w-5" />
                Most Popular
              </motion.div>
            )}
            <h2
              className={`text-3xl font-bold md:text-4xl ${
                pkg.theme.accentClass
              } ${pkg.featured ? 'mt-6' : ''}`}
            >
              {pkg.name}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {pkg.description}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {pkg.longDescription}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3">
                <Clock className={`h-6 w-6 ${pkg.theme.accentClass}`} />
                <div>
                  <p className="font-semibold text-foreground">
                    Estimated Timeline
                  </p>
                  <p className="text-muted-foreground">{pkg.timeline}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3">
                <Users className={`h-6 w-6 ${pkg.theme.accentClass}`} />
                <div>
                  <p className="font-semibold text-foreground">Ideal For</p>
                  <p className="text-muted-foreground">{pkg.audience}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Features Section */}
        <motion.div className="mt-16" variants={itemVariants}>
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">
            What's Included
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pkg.keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <Check
                      className={`h-5 w-5 ${pkg.theme.accentClass}`}
                    />
                    <h4 className="text-lg font-bold text-card-foreground">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 rounded-xl border border-border bg-card p-8 text-center shadow-lg"
          variants={itemVariants}
        >
          <p className="text-sm text-muted-foreground">Starting From</p>
          <p className={`text-5xl font-bold ${pkg.theme.accentClass}`}>
            {pkg.price}
          </p>
          <p className="mb-6 mt-1 text-xs text-muted-foreground">
            Final price depends on features & project scope.
          </p>
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              asChild
              className={`mx-auto w-full max-w-xs text-white ${pkg.theme.buttonClass.replace(
                'hover:scale-105',
                ''
              )}`}
              size="large"
            >
              <Link href="/contact">
                Get a Custom Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
