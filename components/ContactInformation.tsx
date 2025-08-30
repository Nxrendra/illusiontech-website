'use client';

import { IPageContentData } from '@/lib/models/PageContent';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export function ContactInformation({ content }: { content: IPageContentData }) {
  const heading = content.contactInfoHeading ?? 'Contact Information';
  const subheading = content.contactInfoSubheading ?? 'Our team is available to answer your questions and discuss your project needs.';
  const email = content.contactEmail ?? 'illusiontechdev@gmail.com';
  const phone = content.contactPhone ?? '+1 (868) 467-1453';
  const address = content.contactAddress ?? 'Remote, Trinidad and Tobago';
  const workingHours = content.contactWorkingHours ?? 'Mon - Fri: 9:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM';

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div>
        <motion.h2 className="text-3xl font-bold text-foreground" variants={itemVariants}>
          {heading}
        </motion.h2>
        <motion.p className="mt-2 text-muted-foreground" variants={itemVariants}>
          {subheading}
        </motion.p>
      </div>
      <div className="space-y-4">
        <motion.a
          href={`mailto:${email}`}
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', // shadow-2xl
          }}
          transition={{ duration: 0.3 }}
          className="block p-6 rounded-lg transition-colors duration-300 group hover:bg-card cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">Email Us</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Send your project details or inquiries to our team.</p>
              <span className="text-accent font-medium group-hover:underline">{email}</span>
            </div>
          </div>
        </motion.a>
        <motion.a
          href={`tel:${phone.replace(/\s/g, '')}`}
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', // shadow-2xl
          }}
          transition={{ duration: 0.3 }}
          className="block p-6 rounded-lg transition-colors duration-300 group hover:bg-card cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">Call or Whatsapp Us</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Speak with us directly for a quicker response.</p>
              <span className="text-accent font-medium group-hover:underline">{phone}</span>
            </div>
          </div>
        </motion.a>
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', // shadow-2xl
          }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-lg transition-colors duration-300 group hover:bg-card cursor-default"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">Working Hours</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Our general availability for meetings and support.</p>
              <div className="mt-2 text-accent font-medium">
                {workingHours.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <p className="text-xs text-muted-foreground mt-1">Timezone: AST (Atlantic Standard Time)</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', // shadow-2xl
          }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-lg transition-colors duration-300 group hover:bg-card cursor-default"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">Our Location</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{address}</p>
              <p className="text-muted-foreground/80 text-sm">(Meetings by appointment only)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
