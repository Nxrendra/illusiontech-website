'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Send,
  Loader2,
  Rocket,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useAssistantStore } from '@/lib/assistant-store';

const QuickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { name: 'Starter Website', href: '/services/web-development#starter' },
  { name: 'Business Website', href: '/services/web-development#business' },
  { name: 'Pro Website', href: '/services/web-development#pro' },
];

const SocialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61579589552907', // Replace with your Facebook page URL
    icon: <Facebook className="w-6 h-6" />,
  },
  {
    name: 'Twitter',
    href: 'https://x.com/IllusionTechDev', // Replace with your Twitter profile URL
    icon: <Twitter className="w-6 h-6" />,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/illusiontechdevelopment-illusiontech-development-40482837b/', // Replace with your LinkedIn profile URL
    icon: <Linkedin className="w-6 h-6" />,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/illusiontech_development/', // Replace with your Instagram profile URL
    icon: <Instagram className="w-6 h-6" />,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/IllusionTechDevelopment', // Replace with your GitHub profile URL
    icon: <Github className="w-6 h-6" />,
  },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export default function Footer() {
  const setInteraction = useAssistantStore((state) => state.setInteraction);
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState({
    status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    message: '',
  });

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ status: 'loading', message: '' });

    try {
      // This is a placeholder for your API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Subscribing with:', email);
      setFormState({
        status: 'success',
        message: 'Thanks for subscribing!',
      });
      setEmail('');
      setTimeout(() => setFormState({ status: 'idle', message: '' }), 3000);
    } catch (error) {
      setFormState({
        status: 'error',
        message: 'Could not connect to the server.',
      });
    }
  };

  return (
    <motion.footer
      className="bg-muted text-muted-foreground"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="container px-6 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Branding & Socials */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
              onMouseEnter={(e) => setInteraction('Back to the top!', e.currentTarget)}
              onMouseLeave={() => setInteraction(null, null)}
            >
              <Rocket className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-foreground">IllusionTech</span>
            </Link>
            <p className="text-sm text-muted-foreground/80 max-w-xs">
              Crafting bespoke digital experiences that captivate and convert.
            </p>
            <div className="flex pt-2 space-x-4">
              {SocialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="pt-4">
              <h4 className="font-semibold text-foreground text-sm mb-3">Security & Trust</h4>
              <div className="flex items-center gap-x-6 gap-y-2 text-muted-foreground flex-wrap">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  title="SSL Secured Connection"
                  onMouseEnter={(e) =>
                    setInteraction(
                      'Your connection is secured with SSL encryption, keeping your data safe.',
                      e.currentTarget
                    )
                  }
                  onMouseLeave={() => setInteraction(null, null)}
                >
                  <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs">SSL Secured</span>
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  title="Encrypted Data Handling"
                  onMouseEnter={(e) =>
                    setInteraction(
                      'We encrypt all sensitive data to ensure your privacy and security.',
                      e.currentTarget
                    )
                  }
                  onMouseLeave={() => setInteraction(null, null)}
                >
                  <Lock className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs">Data Encryption</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <nav className="mt-4">
              <ul className="space-y-2">
                {QuickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 transition-colors hover:text-accent hover:underline"
                      onMouseEnter={(e) => setInteraction(`Navigate to the ${link.name} page.`, e.currentTarget)}
                      onMouseLeave={() => setInteraction(null, null)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Our Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-foreground">Our Services</h3>
            <nav className="mt-4">
              <ul className="space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 transition-colors hover:text-accent hover:underline"
                      onMouseEnter={(e) => setInteraction(`Learn more about the ${link.name} package.`, e.currentTarget)}
                      onMouseLeave={() => setInteraction(null, null)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-foreground">Stay Ahead of the Curve</h3>
            <p className="mt-4 text-sm text-muted-foreground/80">
              Join our newsletter for the latest tech insights and offers.
            </p>
            <form
              className="mt-4 flex items-center gap-2"
              onSubmit={handleSubscribe}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                aria-label="Email for newsletter"
                className="min-w-0 flex-grow px-4 py-2 text-foreground bg-background border-border rounded-md focus:border-accent focus:ring-accent focus:outline-none focus:ring focus:ring-opacity-40 disabled:bg-muted"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={formState.status === 'loading'}
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Subscribe"
                disabled={formState.status === 'loading'}
              >
                {formState.status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <div className="mt-2 text-sm text-center h-5">
              {formState.status === 'success' && (
                <p className="text-green-500">{formState.message}</p>
              )}
              {formState.status === 'error' && (
                <p className="text-red-500">{formState.message}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground/60 text-center leading-relaxed">
              We are committed to protecting your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        <hr className="my-8 border-border" />

        <div className="text-center text-sm text-muted-foreground/80 mb-6">
          <p>
            We use cookies to enhance your experience. By continuing to visit this
            site you agree to our use of cookies. Learn more in our{' '}
            <Link href="/privacy-policy#cookies" className="underline hover:text-accent">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-muted-foreground/80">
            &copy; {new Date().getFullYear()} IllusionTech. All Rights Reserved.
          </p>
          <div className="flex mt-4 sm:mt-0 space-x-4">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                onMouseEnter={(e) =>
                  setInteraction(
                    link.name === 'Privacy Policy'
                      ? 'Read our Privacy Policy to understand how we handle your data.'
                      : 'Review our Terms of Service to understand the rules of using our site.',
                    e.currentTarget
                  )
                }
                onMouseLeave={() => setInteraction(null, null)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
