'use client';

import { useState, FormEvent, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, Send } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState({
    status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    message: '',
  });

  const ref = useRef(null);
  // Set once to false to re-animate on scroll
  const isInView = useInView(ref, { once: false, margin: '-100px' });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ status: 'loading', message: '' });

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormState({ status: 'success', message: data.message });
        setEmail('');
        // Reset the form state after 3 seconds
        setTimeout(() => setFormState({ status: 'idle', message: '' }), 3000);
      } else {
        setFormState({
          status: 'error',
          message: data.message || 'An error occurred.',
        });
      }
    } catch (error) {
      setFormState({
        status: 'error',
        message: 'Could not connect to the server.',
      });
    }
  };

  return (
    <section ref={ref} className="py-20 md:py-24 bg-muted/50 dark:bg-muted/20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="container max-w-4xl mx-auto text-center"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Stay Ahead of the Curve
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8">
          Subscribe to our newsletter for the latest in tech, trends, and
          exclusive offers.
        </motion.p>
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
        >
          <label htmlFor="home-newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="home-newsletter-email"
            type="email"
            placeholder="Enter your email"
            aria-label="Email for newsletter"
            className="min-w-0 flex-grow w-full px-4 py-3 text-card-foreground bg-card border-border rounded-md focus:border-accent focus:ring-accent focus:outline-none focus:ring focus:ring-opacity-40 disabled:bg-muted"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={formState.status === 'loading'}
          />
          <Button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2"
            disabled={formState.status === 'loading'}
          >
            {formState.status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                Subscribe <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.form>
        <div className="mt-4 text-sm text-center h-5">
          {formState.status === 'success' && (
            <p className="text-green-500">{formState.message}</p>
          )}
          {formState.status === 'error' && (
            <p className="text-red-500">{formState.message}</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
