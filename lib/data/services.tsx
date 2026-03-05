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
  price: '$300 - $1,000 / month',
  features: ['Daily Backups', 'Content Updates', 'Priority Support'],
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
    price: '$1,500 - $2,000 TTD',
    audience: 'Individuals & Freelancers',
    description: 'A powerful, single-page website designed to make a lasting first impression and establish your professional online identity.',
    longDescription:
      "Perfect for freelancers, artists, and consultants, the Solo Showcase is your digital business card. We craft a stunning, responsive single-page experience that tells your story, showcases your work, and connects you with opportunities—all built on a secure, high-performance foundation.",
    timeline: '1-2 Weeks',
    features: ['Custom Single-Page Design', 'Contact & Lead Capture Form', 'Mobile & Tablet Responsive'],
    keyFeatures: [
      { title: 'Custom Single-Page Design', description: 'A concise and elegant one-page design that tells your story effectively.' },
      { title: 'Contact & Lead Capture Form', description: 'An integrated contact form to make it easy for visitors to get in touch.' },
      { title: 'Mobile & Tablet Responsive', description: 'A flawless experience on every device, from desktop to smartphone.' },
      { title: 'Optional Add-ons', description: 'Enhance your site with features like a simple blog, newsletter integration, or advanced animations.' },
    ],
    link: '/services/web-development#solo-showcase',
    theme: {
      gradient: 'from-zinc-800 to-zinc-900',
      accentClass: 'text-zinc-400',
      buttonClass: 'bg-zinc-700 text-white hover:bg-zinc-600',
    },
  },
  {
    id: 'starter',
    type: 'web-development',
    name: 'Business Starter',
    icon: <Code size={32} />,
    price: '$2,500 - $3,500 TTD',
    audience: 'Startups & Small Businesses',
    description: 'A complete, multi-page website to build credibility, detail your services, and convert visitors into loyal customers.',
    longDescription:
      "Move beyond a simple landing page. The Business Starter package provides a professional, multi-page foundation (up to 5 pages) for your growing business. We build a site that not only looks incredible but also functions as a powerful tool for growth, complete with a Content Management System (CMS) for easy updates and an optional admin dashboard to track leads.",
    timeline: '2-4 Weeks',
    features: ['Up to 5 Custom Pages', 'CMS Integration', 'Basic Admin Dashboard'],
    keyFeatures: [
      { title: 'Up to 5 Custom-Designed Pages', description: 'Essential pages like Home, About, Services, and Contact, tailored to your brand.' },
      { title: 'Content Management System (CMS)', description: 'Easily update your website content without needing a developer.' },
      { title: 'Basic SEO Setup', description: 'We build your site with SEO best practices to help you get found on Google.' },
      { title: 'Optional Admin Dashboard', description: 'A private area to view and manage contact form submissions and leads.' },
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
    name: 'E-commerce Engine',
    icon: <ShoppingCart size={32} />,
    price: 'Starting at $4,500+ TTD',
    audience: 'Businesses Ready to Sell Online',
    description: 'A robust online store with a custom CRM and integrated blog, designed to drive sales and provide a seamless customer experience.',
    longDescription:
      "Transform your business into a 24/7 sales machine. We deliver a secure and scalable online store, complete with a powerful custom admin dashboard for managing orders and products, seamlessly integrated with a Sanity.io CMS for flexible content control and a blog for content marketing.",
    timeline: '4-6 Weeks',
    features: ['Complete E-commerce Storefront', 'Secure Payment Integration', 'Custom Admin & CRM Dashboard', 'Integrated Blog for Content Marketing'],
    keyFeatures: [
      { title: 'Complete E-commerce Storefront', description: 'A beautifully designed, fully functional online store with product catalogs, detailed product pages, and a streamlined shopping cart.' },
      { title: 'Secure Payment Integration', description: 'Securely accept payments using major credit cards and popular local payment gateways (e.g., Stripe, WiPay).' },
      { title: 'Custom Admin Dashboard & CRM', description: 'A powerful, bespoke dashboard to manage products, track inventory, view orders, and handle customer data, integrated with a Sanity.io CMS.' },
      { title: 'Advanced SEO & Analytics', description: 'In-depth SEO strategies for product visibility, plus analytics integration to track sales, traffic, and customer behavior.' },
      { title: 'Integrated Blog/News Section', description: 'Engage your audience and boost search rankings with a seamlessly integrated blog or news section for content marketing.' },
    ],
    link: '/services/web-development#business',
    theme: {
      gradient: 'from-teal-900 to-slate-900',
      accentClass: 'text-teal-400',
      buttonClass: 'bg-teal-600 text-white hover:bg-teal-500',
    },
    isCoreService: true,
  },
  {
    id: 'pro',
    type: 'web-development',
    name: 'Omega Suite',
    icon: <Brush size={32} />,
    price: 'Starting at $8,000 TTD',
    audience: 'Organizations with Unique Needs',
    description: 'Our flagship offering: a complete, custom-built software platform engineered to power core business operations and deliver unique user experiences.',
    longDescription:
      "The Omega Suite is for visions that transcend a traditional website. We architect and develop high-performance software platforms that become central, revenue-generating assets for your organization. Ideal for educational portals, booking engines, internal business tools, and other ambitious projects requiring custom user roles, complex data interactions, and deep system integrations.",
    timeline: '2+ Months',
    features: ['Custom-Engineered Platform', 'Advanced User Management', 'Bespoke Dashboard & CMS', 'Deep API Integration'],
    keyFeatures: [
      { title: 'Custom-Engineered Platform', description: 'Software built from the ground up to solve your unique business challenges, not constrained by off-the-shelf plugins.' },
      { title: 'Advanced User & Role Management', description: 'Sophisticated systems with different user roles and permissions (e.g., Admin, Manager, Member).' },
      { title: 'Bespoke Dashboard & Sanity CMS', description: 'A completely custom dashboard to manage all platform activity, integrated with a powerful Sanity.io CMS for flexible content control.' },
      { title: 'Deep System & API Integration', description: 'Seamlessly connect your platform with CRMs, internal databases, and other critical business systems.' },
    ],
    link: '/services/web-development#pro',
    theme: {
      gradient: 'from-indigo-900 to-slate-900',
      accentClass: 'text-indigo-400',
      buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-500',
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
      gradient: 'from-cyan-900 to-slate-900',
      accentClass: 'text-cyan-400',
      buttonClass: 'bg-cyan-600 text-white hover:bg-cyan-500',
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
      gradient: 'from-gray-800 to-gray-900',
      accentClass: 'text-gray-400',
      buttonClass: 'bg-gray-700 text-white hover:bg-gray-600',
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
      gradient: 'from-sky-900 to-slate-900',
      accentClass: 'text-sky-400',
      buttonClass: 'bg-sky-600 text-white hover:bg-sky-500',
    },
  },
  // Support
  {
    id: 'support-basic',
    type: 'support',
    name: 'Essential Maintenance',
    icon: <ShieldCheck size={32} />,
    price: '$300/month TTD',
    audience: 'Small sites & blogs',
    description: 'Peace of mind with daily backups, security monitoring, and time for small updates.',
    longDescription: "The perfect insurance plan for your website. We provide daily backups of your database and assets, monitor for uptime and security issues, and include 1 hour of content updates each month.",
    timeline: 'Monthly',
    features: ['Daily Cloud Backups', 'Uptime Monitoring', 'Security Checks', '1 Hour Content Updates'],
    keyFeatures: [],
    link: '/services/support-maintenance#basic-care',
    theme: {
      gradient: 'from-gray-800 to-slate-900',
      accentClass: 'text-gray-400',
      buttonClass: 'bg-gray-700 text-white hover:bg-gray-600',
    },
  },
  {
    id: 'support-growth',
    type: 'support',
    name: 'Standard Support',
    icon: <BarChart2 size={32} />,
    price: '$600/month TTD',
    audience: 'Growing businesses',
    description: 'Proactive support for active websites, with more time for content updates and performance checks.',
    longDescription: 'Ideal for businesses that actively update their site. Includes all Essential features, plus more time for content changes, performance audits, and priority support.',
    timeline: 'Monthly',
    features: ['Daily Cloud Backups', '3 Hours Content Updates', 'Performance Checks', 'Priority Support'],
    keyFeatures: [],
    link: '/services/support-maintenance#growth-plan',
    theme: {
      gradient: 'from-blue-900 to-slate-900',
      accentClass: 'text-blue-400',
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-500',
    },
  },
  {
    id: 'support-premium',
    type: 'support',
    name: 'Premium Partner',
    icon: <Zap size={32} />,
    price: '$1,000/month TTD',
    audience: 'Active websites',
    description: 'Your dedicated web team. Extensive update time, strategic advice, and our highest priority.',
    longDescription: 'For businesses where the website is a mission-critical tool. We act as your on-call web team, providing extensive update time, strategic advice, and our top-tier response.',
    timeline: 'Monthly',
    features: ['Daily Cloud Backups', '5 Hours Content Updates', 'Strategy Consultation', 'Staging Environment'],
    keyFeatures: [],
    link: '/services/support-maintenance#premium-support',
    theme: {
      gradient: 'from-indigo-900 to-slate-900',
      accentClass: 'text-indigo-400',
      buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-500',
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
