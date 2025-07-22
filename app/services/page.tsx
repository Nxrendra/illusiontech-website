import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Code,
  Brush,
  Bot,
  PenTool,
  LayoutTemplate,
  Server,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Explore our full range of web development, design, automation, and support services tailored for every business size.',
};

const services = [
  {
    icon: <Server size={32} className="text-accent" />,
    name: 'Solo Showcase',
    description:
      'A professional one-page site for individuals to showcase themselves or a portfolio.',
    price: '$500 – $800',
    link: '/services/solo-showcase',
  },
  {
    icon: <Code size={32} className="text-accent" />,
    name: 'Starter Website',
    description:
      'A simple, responsive website with all the basic features for startups and small businesses.',
    price: '$750 – $1,000',
    link: '/services/web-development#starter',
  },
  {
    icon: <ShoppingCart size={32} className="text-accent" />,
    name: 'Business Website',
    description:
      'Custom sites with backend integration and e-commerce capabilities for growing SMBs.',
    price: '$1,200 – $1,800',
    link: '/services/web-development#business',
  },
  {
    icon: <Brush size={32} className="text-accent" />,
    name: 'Pro Website',
    description:
      'Complex, large-scale websites and web applications with advanced, custom features.',
    price: '$3,000+',
    link: '/services/web-development#pro',
  },
  {
    icon: <PenTool size={32} className="text-accent" />,
    name: 'UI/UX Design',
    description:
      'Includes logo design, brand identity systems, and user experience strategy.',
    price: 'Logo: $500, Full: $2,000',
    link: '/services/ui-ux-design',
  },
  {
    icon: <LayoutTemplate size={32} className="text-accent" />,
    name: 'Website Design',
    description:
      'Visual design and aesthetics — creating beautiful, engaging layouts and themes tailored to your brand.',
    price: 'Custom pricing (typically $1,000 – $2,500 TTD)',
    link: '/services/website-design',
  },
  {
    icon: <Bot size={32} className="text-accent" />,
    name: 'Automation & Integration',
    description:
      'Streamline your business workflows with API integrations and custom bots.',
    price: 'Custom pricing',
    link: '/services/automation',
  },
  {
    icon: <ShieldCheck size={32} className="text-accent" />,
    name: 'Support & Maintenance',
    description:
      'Monthly plans for updates, backups, SEO monitoring, and priority support.',
    price: '$250 – $800/month',
    link: '/services/support-maintenance',
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Services — Building Your Digital Future
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our full range of web development, design, automation, and
            support services tailored for every business size.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto">
            At IllusionTech, our mission is to bring your digital vision to life
            with expert execution and a personal touch. We combine innovative
            design with robust development to deliver web solutions that are not
            only beautiful but also drive results for your business.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-white p-8 rounded-lg shadow-md flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-700 flex-grow mb-4">
                  {service.description}
                </p>
                <p className="font-semibold text-gray-800 mb-4">
                  {service.price}
                </p>
                <Button asChild>
                  <Link href={service.link}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Let's discuss your ideas and how we can help you achieve your goals.
            Contact us today for a free, no-obligation consultation.
          </p>
          <Button asChild size="large">
            <Link href="/contact">Get Your Custom Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
