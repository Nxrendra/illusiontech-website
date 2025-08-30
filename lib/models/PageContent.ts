import mongoose, { Schema, Document, models } from 'mongoose';

interface IBelief {
  icon: string;
  title: string;
  description: string;
}

interface IGoal extends IBelief {}

export interface IPageContentData {
  // Contact Page
  contactHeroHeading?: string;
  contactHeroSubheading?: string;
  contactInfoHeading?: string;
  contactInfoSubheading?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactWorkingHours?: string;
  contactFormStep1Heading?: string;
  contactFormStep2Heading?: string;
  contactFormStep3Heading?: string;
  projectTimelines?: { value: string; label: string }[];
  maintenanceContractLengths?: { value: string; label: string }[];

  // About Page
  aboutMetaTitle?: string;
  aboutMetaDescription?: string;
  aboutMetaName?: string;
  aboutHeroHeading?: string;
  aboutHeroSubheading?: string;
  aboutStoryHeading?: string;
  aboutStorySubheading?: string;
  coreBeliefs?: IBelief[];
  aboutWebAppHeading?: string;
  aboutWebAppParagraph1?: string;
  aboutWebAppParagraph2?: string;
  aboutTechActionHeading?: string;
  aboutTechActionParagraph?: string;
  aboutPricingHeading?: string;
  aboutPricingSubheading?: string;
  aboutPremiumHeading?: string;
  aboutPremiumSubheading?: string;
  aboutFutureHeading?: string;
  aboutFutureSubheading?: string;
  futureGoals?: IGoal[];
  aboutCtaHeading?: string;
  aboutCtaSubheading?: string;

  // Homepage
  homeMetaTitle?: string;
  homeMetaDescription?: string;
  homeHeroHeading?: string;
  homeHeroSubheading?: string;
  homeHeroCtaButtonText?: string;
  homeHeroSecondaryButtonText?: string;
  homeWhyChooseUsHeading?: string;
  homeWhyChooseUsSubheading?: string;
  homeWhyChooseUsPoints?: { icon: string; title: string; description: string }[];
  homeWhyChooseUsCtaButtonText?: string;
  homeParallax1Heading?: string;
  homeParallax1Subheading?: string;
  homeParallax1CtaButtonText?: string;
  homeServicesPreviewHeading?: string;
  homeServicesPreviewSubheading?: string;
  homeServicesPreviewCtaButtonText?: string;
  homeMilestonesHeading?: string;
  homeMilestonesSubheading?: string;
  milestones?: { icon: string; value: number; suffix: string; label: string }[];
  homePrinciplesHeading?: string;
  homePrinciplesSubheading?: string;
  principles?: { icon: string; title: string; description: string }[];
  homeNewsletterHeading?: string;
  homeNewsletterSubheading?: string;
  homeProcessHeading?: string;
  homeProcessSubheading?: string;
  processSteps?: { step: string; title: string; description: string; icon: string }[];
  homeKnowledgeHeading?: string;
  homeKnowledgeSubheading?: string;
  digitalKnowledgeBase?: { icon: string; title: string; description: string }[];
  homeTechStackHeading?: string;
  homeTechStackSubheading?: string;
  // Tech stack icons are hardcoded, so no array needed here.
  homeParallax2Heading?: string;
  homeParallax2Subheading?: string;
  homeParallax2CtaButtonText?: string;
}

export interface IPageContent extends IPageContentData, Document {}

const PageContentSchema: Schema = new Schema({
  // Contact Page Content
  contactHeroHeading: { type: String, default: "Let's Build Something Great Together" },
  contactHeroSubheading: { type: String, default: "Have a project in mind or just want to say hello? We'd love to hear from you. Fill out the form below or use our contact details to reach out." },
  contactInfoHeading: { type: String, default: 'Contact Information' },
  contactInfoSubheading: { type: String, default: 'Our team is available to answer your questions and discuss your project needs.' },
  contactEmail: { type: String, default: 'illusiontechdev@gmail.com' },
  contactPhone: { type: String, default: '+1 (868) 467-1453' },
  contactAddress: { type: String, default: 'Remote, Trinidad and Tobago' },
  contactWorkingHours: { type: String, default: 'Mon - Fri: 9:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM' },
  contactFormStep1Heading: { type: String, default: 'What can we help you with?' },
  contactFormStep2Heading: { type: String, default: 'Tell us more' },
  contactFormStep3Heading: { type: String, default: 'Your Contact Information' },
  projectTimelines: {
    type: [{ value: String, label: String }],
    default: [
      { value: '1w', label: '1 Week' },
      { value: '2-3w', label: '2-3 Weeks' },
      { value: '1m', label: '1 Month' },
      { value: '2m', label: '2 Months' },
      { value: '3m', label: '3 Months' },
      { value: 'flexible', label: 'Flexible' }
    ]
  },
  maintenanceContractLengths: {
    type: [{ value: String, label: String }],
    default: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly (3 months)' },
      { value: 'annually', label: 'Annually (1 year)' },
      { value: 'flexible', label: 'Flexible' },
    ]
  },

  // About Page Content
  aboutMetaTitle: { type: String, default: 'About Us | IllusionTech Development' },
  aboutMetaDescription: { type: String, default: 'Learn about IllusionTech Development, our mission to empower businesses with high-quality digital solutions, and our passion for creating exceptional web experiences.' },
  aboutMetaName: { type: String, default: 'About IllusionTech Development' },
  aboutHeroHeading: { type: String, default: 'Driven by Passion, Defined by Code.' },
  aboutHeroSubheading: { type: String, default: 'We are IllusionTech—a small, dedicated team of developers and designers transforming complex problems into elegant digital solutions.' },
  aboutStoryHeading: { type: String, default: 'Our Story & Our "Why"' },
  aboutStorySubheading: { type: String, default: 'We started IllusionTech with a simple belief: technology should be a tool for empowerment, not a barrier. Here’s what drives us every day.' },
  coreBeliefs: {
    type: [{ icon: String, title: String, description: String }],
    default: [
      { icon: 'Heart', title: 'Passion for Creation', description: 'We are driven by a deep-seated passion for building beautiful, functional, and impactful digital products. Technology is our craft, and we pour our hearts into every project.' },
      { icon: 'Users', title: 'Empowering Businesses', description: 'Our core mission is to level the playing field. We believe every business, regardless of size, deserves a high-quality digital presence that can drive growth and open new opportunities.' },
      { icon: 'Zap', title: 'The Pursuit of Excellence', description: 'We are relentless in our pursuit of quality. From clean code to intuitive design, we hold ourselves to the highest standards to deliver solutions that are not just good, but exceptional.' },
    ]
  },
  aboutWebAppHeading: { type: String, default: 'Beyond a Website: The Power of a Web Application' },
  aboutWebAppParagraph1: { type: String, default: "In today's digital landscape, a simple, static website is no longer enough. Businesses need dynamic, interactive experiences to engage customers and streamline operations. This is where web applications shine." },
  aboutWebAppParagraph2: { type: String, default: 'Unlike a traditional website which primarily displays information, a <strong>web application</strong> is a powerful tool that allows users to perform tasks. Think of customer portals, booking systems, interactive dashboards, or online stores. They offer superior engagement, data-driven insights, and scalability for your business.' },
  aboutTechActionHeading: { type: String, default: 'Our Technology in Action' },
  aboutTechActionParagraph: { type: String, default: "The very website you are browsing is a high-performance web application built with the same cutting-edge technology we use for our clients. It demonstrates our commitment to speed, security, and a seamless user experience. It's not just a portfolio; it's a testament to our capabilities." },
  aboutPricingHeading: { type: String, default: 'Our Pricing Philosophy' },
  aboutPricingSubheading: { type: String, default: "We believe world-class web development shouldn't come with an inaccessible price tag. Our competitive pricing is a direct result of our lean, efficient workflow and low overhead. We focus on what truly matters: writing clean code, designing beautiful interfaces, and delivering exceptional value to our clients." },
  aboutPremiumHeading: { type: String, default: 'Premium Quality, Accessible Price' },
  aboutPremiumSubheading: { type: String, default: 'By leveraging modern tools and a streamlined process, we minimize unnecessary costs and pass those savings directly on to you. This allows us to provide top-tier, custom solutions that are typically associated with much larger agency fees.' },
  aboutFutureHeading: { type: String, default: 'Our Vision for the Future' },
  aboutFutureSubheading: { type: String, default: 'We are constantly evolving and expanding our services to better serve our clients and the broader digital community. Here’s a glimpse of what’s next.' },
  futureGoals: {
    type: [{ icon: String, title: String, description: String }],
    default: [
      { icon: 'LayoutTemplate', title: "Customizable Web Templates", description: "We are developing a line of professionally designed, fully editable web templates. This will provide an affordable, high-quality starting point for businesses wanting to get online quickly without sacrificing design integrity." },
      { icon: 'Smartphone', title: "Mobile App Development", description: "Expanding beyond the browser, we are gearing up to offer native mobile app development for iOS and Android, helping businesses engage with their customers on the most personal devices." }
    ]
  },
  aboutCtaHeading: { type: String, default: 'Have a Project in Mind?' },
  aboutCtaSubheading: { type: String, default: "Let's turn your idea into an unforgettable digital experience. We're excited to hear what you're dreaming up." },

  // Homepage Content
  homeMetaTitle: { type: String, default: 'Custom Web Development & Design in Trinidad | IllusionTech' },
  homeMetaDescription: { type: String, default: 'IllusionTech builds bespoke, high-performance websites and web applications in Trinidad and Tobago. Specializing in Next.js, React, and modern tech stacks to elevate your digital presence.' },
  homeHeroHeading: { type: String, default: 'Crafting Digital Illusions' },
  homeHeroSubheading: { type: String, default: "We transform complex ideas into elegant web solutions that captivate and convert." },
  homeHeroCtaButtonText: { type: String, default: 'Explore Services' },
  homeHeroSecondaryButtonText: { type: String, default: 'Learn More' },
  homeWhyChooseUsHeading: { type: String, default: 'Why Choose IllusionTech?' },
  homeWhyChooseUsSubheading: { type: String, default: "We're more than just developers; we're your dedicated partners in building a powerful online presence that drives growth and delivers results." },
  homeWhyChooseUsPoints: {
    type: [{ icon: String, title: String, description: String }],
    default: [
      { icon: 'Zap', title: 'Bespoke Solutions', description: "We don't use templates. Every website is uniquely designed and developed in Trinidad & Tobago to meet your specific business goals and brand identity." },
      { icon: 'Code', title: 'Cutting-Edge Technology', description: 'Leveraging modern technologies like Next.js and TypeScript, we build fast, secure, and scalable websites for clients worldwide.' },
      { icon: 'ShieldCheck', title: 'Transparent Collaboration', description: 'From initial consultation to final delivery, we maintain clear communication, providing regular updates and transparent pricing with no hidden fees.' },
    ]
  },
  homeWhyChooseUsCtaButtonText: { type: String, default: 'Learn More About Us' },
  homeParallax1Heading: { type: String, default: 'The Future is Digital. Let’s Build It Together.' },
  homeParallax1Subheading: { type: String, default: "We combine innovative design with powerful technology to create web experiences that drive results. Let's discuss how we can elevate your digital presence." },
  homeParallax1CtaButtonText: { type: String, default: 'Start Your Project' },
  homeServicesPreviewHeading: { type: String, default: 'Our Core Services' },
  homeServicesPreviewSubheading: { type: String, default: 'We offer a range of services to bring your digital ideas to life, from simple landing pages to complex web applications.' },
  homeMilestonesHeading: { type: String, default: 'Our Milestones' },
  homeMilestonesSubheading: { type: String, default: 'We are proud of what we do. Our commitment to excellence is reflected in our numbers.' },
  milestones: {
    type: [{ icon: String, value: Number, suffix: String, label: String }],
    default: [
      { icon: 'Star', value: 100, suffix: '%', label: 'Client Satisfaction' },
      { icon: 'Zap', value: 3, suffix: 'x', label: 'Faster Load Times' },
      { icon: 'Code', value: 50, suffix: 'k+', label: 'Lines of Code Written' },
      { icon: 'Clock', value: 24, suffix: '/7', label: 'Support Availability' },
    ]
  },
  homePrinciplesHeading: { type: String, default: 'Our Guiding Principles' },
  homePrinciplesSubheading: { type: String, default: "Our work is driven by a core set of values that ensure excellence, partnership, and innovation in everything we create." },
  homeNewsletterHeading: { type: String, default: 'Stay Ahead of the Curve' },
  homeNewsletterSubheading: { type: String, default: 'Subscribe to our newsletter for the latest in tech, trends, and exclusive offers.' },
  homeParallax2Heading: { type: String, default: 'Ready to Build Something Incredible?' },
  homeParallax2Subheading: { type: String, default: "Have an idea for a project? We're here to turn your vision into a digital reality. Let's collaborate and create something that stands out from the crowd." },
  homeParallax2CtaButtonText: { type: String, default: 'Request a Quote' },
}, { timestamps: true });

const PageContent = models.PageContent || mongoose.model<IPageContent>('PageContent', PageContentSchema);

export default PageContent;