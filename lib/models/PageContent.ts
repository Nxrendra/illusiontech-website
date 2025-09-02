import mongoose, { Schema, Document, models, Model } from 'mongoose';

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

  // Contract Page
  contractContent?: string;
  // Legal Pages
  termsOfServiceContent?: string;
  privacyPolicyContent?: string;
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
  homeServicesPreviewCtaButtonText: { type: String, default: 'See All Services' },
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
  principles: {
    type: [{ icon: String, title: String, description: String }],
    default: [
      { icon: 'Star', title: 'Commitment to Quality', description: 'We are obsessed with delivering pixel-perfect, high-performance products. Our commitment to quality is unwavering, ensuring every project we handle is a masterpiece of form and function.' },
      { icon: 'Users', title: 'Client-Centric Approach', description: 'Your success is our success. We believe in building strong, collaborative partnerships, listening to your needs, and aligning our strategy with your business objectives to achieve outstanding results.' },
      { icon: 'Zap', title: 'Innovation at the Core', description: 'We stay at the forefront of technology, constantly exploring new tools and techniques to deliver innovative solutions that give you a competitive edge in the digital landscape.' }
    ]
  },
  homeNewsletterHeading: { type: String, default: 'Stay Ahead of the Curve' },
  homeNewsletterSubheading: { type: String, default: 'Subscribe to our newsletter for the latest in tech, trends, and exclusive offers.' },
  homeProcessHeading: { type: String, default: 'Our Streamlined Process' },
  homeProcessSubheading: { type: String, default: 'From concept to launch, we follow a structured path to ensure success.' },
  processSteps: {
    type: [{ step: String, title: String, description: String, icon: String }],
    default: [
      { step: '01', title: 'Discover', description: 'We listen to your vision and define project goals.', icon: 'Search' },
      { step: '02', title: 'Design', description: 'We craft intuitive UI/UX and stunning visuals.', icon: 'Palette' },
      { step: '03', title: 'Develop', description: 'We build a robust, scalable, and secure product.', icon: 'Code' },
      { step: '04', title: 'Deliver', description: 'We launch your project and provide ongoing support.', icon: 'Rocket' }
    ]
  },
  homeKnowledgeHeading: { type: String, default: 'Building Your Digital Foundation' },
  homeKnowledgeSubheading: { type: String, default: "Knowledge is power. We believe in empowering our clients by explaining the 'why' behind the 'what'. Here are some core concepts vital to understanding the web and making informed decisions for your project." },
  digitalKnowledgeBase: {
    type: [{ icon: String, title: String, description: String }],
    default: [
      { icon: 'Globe', title: "Website vs. Web Application: What's the Difference?", description: "A <strong>website</strong> is primarily informational, like a digital brochure. It presents content to visitors (e.g., a company's services, a blog, a portfolio). A <strong>web application</strong> is interactive; it's a software program that runs in your browser. It allows users to perform tasks, manipulate data, and collaborate (e.g., online banking, project management tools, or social media sites). We help you decide which is right for your goals." },
      { icon: 'Users', title: 'Who Benefits from a Digital Presence?', description: "Virtually everyone with a goal. For a <strong>businessman</strong>, it's a 24/7 lead generation machine and a mark of credibility. For a <strong>freelancer or artist</strong>, it's a professional portfolio to showcase work and attract clients. For a <strong>non-profit</strong>, it's a platform to raise awareness and gather support. Your digital presence is your most powerful tool for growth." },
      { icon: 'ShieldCheck', title: 'The Critical Role of Security', description: "In an age of data breaches, security is non-negotiable. A secure website protects both your business and your customers' sensitive information. This includes implementing <strong>HTTPS</strong> (the padlock in your browser), protecting against common vulnerabilities, and ensuring user data is handled responsibly. A secure site builds trust and protects your reputation." },
      { icon: 'Zap', title: 'Performance and SEO: Be Seen, Be Fast', description: "A slow website frustrates users and hurts your ranking on search engines like Google. We build high-performance sites that load in a flash. <strong>Search Engine Optimization (SEO)</strong> is the practice of structuring your site to rank higher in search results, driving organic traffic. From clean code to mobile-first design, we build with performance and visibility at the core." }
    ]
  },
  homeTechStackHeading: { type: String, default: 'Technology We Use' },
  homeTechStackSubheading: { type: String, default: "We build with modern, robust, and scalable technologies to ensure your project's success and longevity." },
  homeParallax2Heading: { type: String, default: 'Ready to Build Something Incredible?' },
  homeParallax2Subheading: { type: String, default: "Have an idea for a project? We're here to turn your vision into a digital reality. Let's collaborate and create something that stands out from the crowd." },
  homeParallax2CtaButtonText: { type: String, default: 'Request a Quote' },

  // Contract Page
  contractContent: { type: String, default: '<p>This is a placeholder for the service contract. Please edit this content in the admin panel.</p>' },

  // Legal Pages
  termsOfServiceContent: { type: String, default: '<p>Placeholder for Terms of Service. Edit in admin panel.</p>' },
  privacyPolicyContent: { type: String, default: '<p>Placeholder for Privacy Policy. Edit in admin panel.</p>' },
}, { timestamps: true });

const PageContent: Model<IPageContent> = models.PageContent || mongoose.model<IPageContent>('PageContent', PageContentSchema);

export default PageContent;