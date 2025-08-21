import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { ContactHero } from '@/components/ContactHero';
import { ContactInformation } from '@/components/ContactInformation';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'IllusionTech Development',
  image: 'https://illusiontech.dev/og-image.png',
  '@id': `${siteUrl}/#organization`,
  url: `${siteUrl}/contact`,
  telephone: '+1-868-XXX-XXXX', // <-- Replace with your actual phone number
  email: 'hello@illusiontech.dev',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Port of Spain',
    addressCountry: 'TT',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Trinidad and Tobago',
  },
  sameAs: [
    // TODO: Add your social media profile URLs here
  ],
};

export const metadata: Metadata = {
  title: 'Contact Us | IllusionTech Development',
  description:
    'Get in touch with IllusionTech for a free consultation or a custom quote on your web development project in Trinidad and Tobago.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact Us | IllusionTech Development',
    description: 'Get in touch for a free consultation or a custom quote on your web development project.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | IllusionTech Development',
    description: 'Get in touch for a free consultation or a custom quote on your web development project.',
    images: ['/og-image.png'],
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <ContactHero />
      <section id="contact-content" className="py-16 md:py-24 bg-background">
        <div className="container grid md:grid-cols-2 gap-16 items-start">
          <ContactInformation />
          <ContactForm />
        </div>
      </section>
    </>
  );
}