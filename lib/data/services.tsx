import { ReactElement } from 'react';
import {
  Code,
  Brush,
  Bot,
  LayoutTemplate,
  Server,
  ShieldCheck,
  ShoppingCart,
  Heart,
  Zap,
  BarChart2,
} from 'lucide-react';
import { PenTool } from 'lucide-react';

export interface ServiceFeature {
  title: string;
  description: string;
}

export type ServiceType = 'web-development' | 'design' | 'automation' | 'support' | 'support-main';

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  icon: ReactElement;
  price: string;
  audience: string;
  description: string; // Short description for cards
  longDescription: string; // Detailed description for pages and prompts
  timeline: string;
  features: string[]; // Simple list for cards
  keyFeatures: ServiceFeature[]; // Detailed list for detail pages
  link: string;
  theme: {
    gradient: string;
    accentClass: string;
    buttonClass: string;
  };
  featured?: boolean; // For highlighting on pages
  isCoreService?: boolean; // To filter for homepage preview
}

const supportAndMaintenanceSummary: Service = {
  id: 'support-maintenance',
  name: 'Support & Maintenance',
  type: 'support-main', // Custom type to avoid being filtered out
  description: 'Ongoing support to keep your site secure, updated, and performing at its best.',
  longDescription: 'Ongoing support to keep your site secure, updated, and performing at its best. We offer multiple tiers to fit your needs, from basic care to premium, 24/7 monitoring.',
  timeline: 'Monthly',
  price: '$250 - $800 / month',
  features: ['Security Monitoring', 'Regular Backups', 'Performance Optimization'],
  keyFeatures: [], // Not used in the carousel card, but required by the type.
  audience: 'For businesses that need peace of mind.',
  link: '/services/support-maintenance',
  icon: <ShieldCheck />,
  theme: {
    gradient: 'from-slate-500 to-slate-700',
    accentClass: 'text-slate-400',
    buttonClass: 'bg-slate-600 hover:bg-slate-500',
  },
};

export const services: Service[] = [
  // Web Development
  {
    id: 'solo-showcase',
    type: 'web-development',
    name: 'Solo Showcase',
    icon: <Server size={32} />,
    price: '$500 - $700 TTD',
    audience: 'Individuals & Freelancers',
    description: 'A professional one-page site to showcase yourself or a portfolio.',
    longDescription:
      'Perfect for artists, photographers, consultants, and freelancers who need a sleek, modern online presence. This single-page website is designed to make a strong first impression and provide essential information to potential clients or employers.',
    timeline: '1-2 Weeks',
    features: ['Single Page Layout', 'Custom UI/UX Design', 'Contact Form'],
    keyFeatures: [
      { title: 'Single Page Layout', description: 'A concise and elegant one-page design that tells your story effectively.' },
      { title: 'Custom UI/UX Design', description: 'A unique design tailored to your personal brand and style.' },
      { title: 'Contact Form', description: 'An integrated contact form to make it easy for visitors to get in touch.' },
    ],
    link: '/services/web-development#solo-showcase',
    theme: {
      gradient: 'from-slate-800 to-slate-900',
      accentClass: 'text-slate-400',
      buttonClass: 'bg-slate-700 text-white hover:bg-slate-600',
    },
  },
  {
    id: 'starter',
    type: 'web-development',
    name: 'Starter Website',
    icon: <Code size={32} />,
    price: '$800 - $1,300 TTD',
    audience: 'Startups & Small Businesses',
    description: 'A simple, responsive website with all the basic features for new businesses.',
    longDescription:
      'Establish your online presence with a professional, multi-page website. This package is ideal for small businesses looking to provide information about their services, build credibility, and generate leads through a clean, easy-to-navigate site.',
    timeline: '2-4 Weeks',
    features: ['Up to 5 Pages', 'CMS Integration', 'Basic SEO'],
    keyFeatures: [
      { title: 'Up to 5 Pages', description: 'Includes essential pages like Home, About, Services, and Contact.' },
      { title: 'CMS Integration', description: 'Manage your own content easily with an integrated Content Management System.' },
      { title: 'Basic SEO Setup', description: 'We build your site with SEO best practices to help you get found on Google.' },
    ],
    link: '/services/web-development#starter',
    theme: {
      gradient: 'from-blue-900 to-slate-900',
      accentClass: 'text-blue-400',
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-500',
    },
    featured: true,
    isCoreService: true,
  },
  {
    id: 'business',
    type: 'web-development',
    name: 'Business Website',
    icon: <ShoppingCart size={32} />,
    price: '$1,400 - $3,000 TTD',
    audience: 'Growing SMBs',
    description: 'Advanced sites with CMS and e-commerce capabilities for growing businesses.',
    longDescription:
      'Take your business to the next level with a powerful website that includes a content management system (CMS) for easy updates and full e-commerce functionality to sell your products online. Ideal for businesses ready to scale their operations.',
    timeline: '4-6 Weeks',
    features: ['Up to 10 Pages', 'E-commerce', 'Advanced SEO'],
    keyFeatures: [
      { title: 'E-commerce Functionality', description: 'A fully functional online store with secure payments and inventory management.' },
      { title: 'Blog Integration', description: 'Engage your audience and boost your SEO with an integrated blog.' },
      { title: 'Advanced SEO', description: 'In-depth SEO strategies to improve your ranking and drive organic traffic.' },
    ],
    link: '/services/web-development#business',
    theme: {
      gradient: 'from-emerald-900 to-slate-900',
      accentClass: 'text-emerald-400',
      buttonClass: 'bg-emerald-600 text-white hover:bg-emerald-500',
    },
    isCoreService: true,
  },
  {
    id: 'pro',
    type: 'web-development',
    name: 'Pro Website / Custom App',
    icon: <Brush size={32} />,
    price: '$3,500+ TTD',
    audience: 'Enterprises & Large-Scale Projects',
    description: 'Complex, large-scale web applications with advanced, custom features.',
    longDescription:
      'For businesses with unique requirements, we build custom web applications from the ground up. This package includes API integrations, user accounts, custom dashboards, and other advanced features tailored to your specific business logic.',
    timeline: 'Varies',
    features: ['Custom Web Application', 'API Integrations', 'User Accounts'],
    keyFeatures: [
      { title: 'Custom Web Application', description: 'Bespoke features and functionality built to solve your unique business challenges.' },
      { title: 'API Integrations', description: 'Seamlessly connect your website with third-party services and data sources.' },
      { title: 'User Accounts & Dashboards', description: 'Provide a personalized experience for your users with custom accounts and dashboards.' },
    ],
    link: '/services/web-development#pro',
    theme: {
      gradient: 'from-purple-900 to-slate-900',
      accentClass: 'text-purple-400',
      buttonClass: 'bg-purple-600 text-white hover:bg-purple-500',
    },
    isCoreService: true,
  },
  // Design
  {
    id: 'ui-ux-design',
    type: 'design',
    name: 'UI/UX Design',
    icon: <PenTool size={32} />,
    price: 'Custom Pricing',
    audience: 'Businesses seeking user-centric products',
    description: 'Includes logo design, brand identity systems, and user experience strategy.',
    longDescription: 'We craft intuitive, beautiful, and user-centric digital experiences that solve real problems and drive business growth through a deep understanding of your users.',
    timeline: 'Varies',
    features: ['User Research', 'Wireframing & Prototyping', 'Brand Identity', 'Design Systems'],
    keyFeatures: [
      { title: 'User Research & Personas', description: 'We start by understanding your users to build products they love.' },
      { title: 'Wireframing & Prototyping', description: 'We create interactive blueprints to visualize the user flow and structure.' },
      { title: 'Full Brand Identity Kit', description: 'From logos to style guides, we build a cohesive brand identity.' },
    ],
    link: '/services/ui-ux-design',
    theme: {
      gradient: 'from-pink-900 to-slate-900',
      accentClass: 'text-pink-400',
      buttonClass: 'bg-pink-600 text-white hover:bg-pink-500',
    },
  },
  {
    id: 'website-design',
    type: 'design',
    name: 'Website Design',
    icon: <LayoutTemplate size={32} />,
    price: 'Custom Pricing',
    audience: 'Clients needing a visual-first approach',
    description: 'Visual design and aesthetics — creating beautiful, engaging layouts and themes.',
    longDescription: 'We focus on creating visually compelling and brand-aligned designs before development, or for those looking to redesign an existing site.',
    timeline: 'Varies',
    features: ['High-Fidelity Mockups', 'Responsive Design', 'Interactive Prototypes', 'Style Guides'],
    keyFeatures: [
      { title: 'High-Fidelity Mockups', description: 'Pixel-perfect mockups that show exactly how your site will look.' },
      { title: 'Responsive Design', description: 'A design that looks and works perfectly on all devices, from phones to desktops.' },
      { title: 'Interactive Prototypes', description: 'Clickable prototypes that allow you to experience the design firsthand.' },
    ],
    link: '/services/website-design',
    theme: {
      gradient: 'from-indigo-900 to-slate-900',
      accentClass: 'text-indigo-400',
      buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-500',
    },
  },
  // Automation
  {
    id: 'automation',
    type: 'automation',
    name: 'Automation & Integration',
    icon: <Bot size={32} />,
    price: 'Custom Pricing',
    audience: 'Businesses looking to improve efficiency',
    description: 'Streamline your business workflows with API integrations and custom bots.',
    longDescription: 'We help you connect disparate systems, automate repetitive tasks, and improve operational efficiency through custom integrations and bot development.',
    timeline: 'Varies',
    features: ['API Integration', 'Custom Bot Development', 'Workflow Automation', 'Data Sync'],
    keyFeatures: [
      { title: 'Third-Party API Integration', description: 'Connect your tools and services to create a seamless workflow.' },
      { title: 'Custom Bot Development', description: 'Automate tasks in platforms like Discord, Slack, and more.' },
      { title: 'Workflow Automation', description: 'Eliminate manual work and let your systems run themselves.' },
    ],
    link: '/services/automation',
    theme: {
      gradient: 'from-teal-900 to-slate-900',
      accentClass: 'text-teal-400',
      buttonClass: 'bg-teal-600 text-white hover:bg-teal-500',
    },
  },
  // Support
  {
    id: 'support-basic',
    type: 'support',
    name: 'Basic Care',
    icon: <ShieldCheck size={32} />,
    price: '$250/month TTD',
    audience: 'Small sites & blogs',
    description: 'Essential maintenance to keep your site secure and running smoothly.',
    longDescription: "Essential maintenance to keep your site secure and running smoothly. Ideal for small websites and blogs that don't require frequent content updates.",
    timeline: 'Monthly',
    features: ['Weekly Backups', 'Core Software Updates', 'Security Monitoring', 'Email Support'],
    keyFeatures: [],
    link: '/services/support-maintenance#basic-care',
    theme: {
      gradient: 'from-amber-800 to-slate-900',
      accentClass: 'text-amber-400',
      buttonClass: 'bg-amber-600 text-white hover:bg-amber-500',
    },
  },
  {
    id: 'support-growth',
    type: 'support',
    name: 'Growth Plan',
    icon: <BarChart2 size={32} />,
    price: '$500/month TTD',
    audience: 'Growing businesses',
    description: 'Comprehensive support with performance optimization and SEO monitoring.',
    longDescription: 'Comprehensive support for growing businesses. Includes performance optimization and SEO monitoring to help you expand your reach.',
    timeline: 'Monthly',
    features: ['All Basic Care Features', 'Daily Cloud Backups', 'Performance Optimization', 'Monthly SEO Report', 'Priority Email Support'],
    keyFeatures: [],
    link: '/services/support-maintenance#growth-plan',
    theme: {
      gradient: 'from-amber-800 to-slate-900',
      accentClass: 'text-amber-400',
      buttonClass: 'bg-amber-600 text-white hover:bg-amber-500',
    },
  },
  {
    id: 'support-premium',
    type: 'support',
    name: 'Premium Support',
    icon: <Zap size={32} />,
    price: '$800/month TTD',
    audience: 'Mission-critical sites',
    description: 'All-inclusive plan with 24/7 monitoring and our fastest response times.',
    longDescription: 'Our all-inclusive plan for mission-critical websites. Get peace of mind with 24/7 monitoring and our fastest support response times.',
    timeline: 'Monthly',
    features: ['All Growth Features', 'Hourly backups',
      'Enhanced security monitoring', '24/7 Uptime Monitoring', 'Guaranteed faster response times (within 2-4 hours)',
],
    keyFeatures: [],
    link: '/services/support-maintenance#premium-support',
    theme: {
      gradient: 'from-amber-800 to-slate-900',
      accentClass: 'text-amber-400',
      buttonClass: 'bg-amber-600 text-white hover:bg-amber-500',
    },
  },
];

/**
 * A separate list of services specifically for use in carousels or previews,
 * where individual support plans are consolidated into a single summary card.
 */
export const carouselServices: Service[] = [
  ...services.filter((service) => service.type !== 'support'),
  supportAndMaintenanceSummary,
];

/**
 * A consolidated list of main service pages for use in sub-navigation.
 * This prevents showing every single package in the nav.
 */
export const subNavServices = [
  {
    name: 'Web Development',
    link: '/services/web-development',
    type: 'web-development',
  },
  {
    name: 'UI/UX Design',
    link: '/services/ui-ux-design',
    type: 'design',
  },
  {
    name: 'Website Design',
    link: '/services/website-design',
    type: 'design',
  },
  {
    name: 'Automation',
    link: '/services/automation',
    type: 'automation',
  },
  {
    name: 'Support & Maintenance',
    link: '/services/support-maintenance',
    type: 'support',
  },
];
