'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useAssistantStore } from '@/lib/assistant-store';

import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import ServicesSubNav from '@/components/ServicesSubNav';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

// Renamed the main component to avoid conflict with the default export
const EnhancedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const setInteraction = useAssistantStore((state) => state.setInteraction);
  const scrollPosition = useScrollPosition();
  const { theme, systemTheme } = useTheme();
  const [showThemePrompt, setShowThemePrompt] = useState(false);

  const isScrolled = scrollPosition > 10;
  const transparentPages = ['/', '/contact', '/about'];
  const isServicesPage = pathname?.startsWith('/services'); // For header transparency
  const showServicesSubNav = isServicesPage && pathname !== '/services'; // For sub-nav visibility
  // Check for pages that should have a transparent navbar at the top
  const isTransparentPage = transparentPages.includes(pathname ?? '') || isServicesPage;

  // This single variable now controls the navbar's appearance.
  // It's true if we need dark text and a light background.
  const useSolidAppearance = !isTransparentPage || isScrolled || isOpen;

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Effect to show the "stay in dark mode" prompt
  useEffect(() => {
    // systemTheme can be undefined on initial render, so we wait.
    if (!systemTheme) return;

    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    const promptShown = sessionStorage.getItem('themePromptShown');

    if (effectiveTheme === 'dark' && !promptShown) {
      const timer = setTimeout(() => {
        setShowThemePrompt(true);
        sessionStorage.setItem('themePromptShown', 'true');
      }, 1500); // Show after a 1.5s delay

      const hideTimer = setTimeout(() => setShowThemePrompt(false), 7000); // Hide after 5.5s

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [theme, systemTheme]);

  // A unified sub-component for navigation links to reduce duplication
  const NavigationLink = ({
    href,
    name,
    isMobile = false,
  }: {
    href: string;
    name: string;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === href;

    const handleClick = () => {
      // For mobile, also close the menu on navigation
      if (isMobile) {
        setIsOpen(false);
      }
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      let message = '';
      switch (name) {
        case 'Home':
          message = "Let's head back to the homepage.";
          break;
        case 'About':
          message = 'Want to learn more about us? This is the spot.';
          break;
        case 'Services':
          message = "Here's a look at what we can do for you.";
          break;
        case 'Contact':
          message = "Ready to start a project? Let's talk.";
          break;
        default:
          message = `Go to the ${name} page`;
      }
      setInteraction(message, e.currentTarget);
    };

    const handleMouseLeave = () => {
      setInteraction(null, null);
    };

    const desktopClasses = `relative font-sans text-sm font-semibold tracking-wide transition-colors duration-300 group ${
      useSolidAppearance
        ? isActive
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground'
        : isActive
        ? 'text-white'
        : 'text-gray-300 hover:text-white'
    }`;
    const mobileClasses = `font-sans text-3xl font-semibold transition-colors duration-300 ${
      isActive ? 'text-accent' : 'text-foreground hover:text-accent'
    }`;

    return (
      <Link
        href={href}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={isMobile ? mobileClasses : desktopClasses}
      >
        {name}
        {!isMobile && (
          <span
            className={`absolute bottom-[-4px] left-0 h-0.5 bg-accent rounded-full transition-all duration-300 ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          useSolidAppearance
            ? 'bg-background/80 backdrop-blur-sm shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container flex h-20 items-center justify-between">
          <Link
            onMouseEnter={(e) => setInteraction("Let's head back to the homepage.", e.currentTarget)}
            onMouseLeave={() => setInteraction(null, null)}
            href="/"
            className={`font-sans flex items-center text-2xl font-bold transition-colors duration-300 ${
              useSolidAppearance ? 'text-foreground' : 'text-white'
            }`}
          >
            <span>
              Illusion<span className="text-accent">Tech</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavigationLink key={link.href} {...link} />
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant={useSolidAppearance ? 'secondary' : 'outline-light'}
            >
              <Link
                href="/contact"
                onMouseEnter={(e) => setInteraction('Click here to get a personalized quote for your project.', e.currentTarget)}
                onMouseLeave={() => setInteraction(null, null)}
              >
                Get a Quote
              </Link>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-300 focus:outline-none ${
                useSolidAppearance ? 'text-foreground' : 'text-white'
              }`}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Services Sub-Navigation */}
        <AnimatePresence>
          {showServicesSubNav && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <ServicesSubNav />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            id="mobile-menu"
            className="fixed top-0 right-0 w-full h-screen bg-background z-40 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full pt-20">
              <nav className="flex flex-col items-center gap-8">
                {navLinks.map((link) => (
                  <NavigationLink key={link.href} {...link} isMobile />
                ))}
              </nav>
              <Button
                asChild
                variant="secondary"
                size="large"
                className="mt-12"
              >
                 <Link
                  href="/contact"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  // Note: Hover interactions are not standard on mobile, but this is for the assistant
                  onMouseEnter={(e) => setInteraction('Click here to get a personalized quote for your project.', e.currentTarget)}
                  onMouseLeave={() => setInteraction(null, null)}
                >
                  Get a Quote
                </Link>
              </Button>
              <div className="mt-8">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Prompt Toast */}
      <AnimatePresence>
        {showThemePrompt && (
          <motion.div
            className="fixed bottom-4 right-4 z-[100] w-max max-w-[calc(100vw-2rem)] pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3, ease: 'easeIn' } }}
            aria-hidden="true"
          >
            <div className="flex items-center gap-3 text-sm text-popover-foreground bg-popover p-3 rounded-lg shadow-2xl border border-border">
              <Star className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="font-medium">
                For the best experience, stay in dark mode.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// The original file had a default export that was a function returning the component.
// We'll maintain that structure to avoid breaking the import in layout.tsx.
export default function Navbar() {
  return <EnhancedNavbar />;
}
