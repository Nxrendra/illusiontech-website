'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { Button } from '@/components/ui/Button';
import { IServiceData } from '@/lib/models/Service';

const DESKTOP_CARD_WIDTH = 280;
const DESKTOP_CARD_HEIGHT = 410;
const MOBILE_ASPECT_RATIO = 380 / 280; // Use a less tall aspect ratio for mobile to improve viewing on smaller screens.
const MOBILE_BREAKPOINT = 768;

interface ServiceCarouselProps {
  services: (Omit<IServiceData, 'icon'> & { _id: string; icon: React.ReactElement; slug?: string })[];
}

export const ServiceCarousel: React.FC<ServiceCarouselProps> = ({ services: initialServices }) => {
  const router = useRouter();

  // This is a safeguard. The "Starter Website" package should always link to its
  // specific section on the web development page. This handles the case where the
  // link might be missing from the database for this specific service.
  const services = useMemo(() => initialServices.map(s => {
    if (s.slug === 'starter' && !s.link) {
      return { ...s, link: '/services/web-development#starter' };
    }
    return s;
  }), [initialServices]);

  const [rotation, setRotation] = useState(0); // This represents the number of steps rotated
  // Default to a non-mobile value on the server. The actual value will be set on the client.
  const [winW, setWinW] = useState<number>(1024);
  const [showTapPrompt, setShowTapPrompt] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (services.length === 0) {
    return null; // Don't render anything if there are no services
  }

  const isMobile = winW < MOBILE_BREAKPOINT;

  const numServices = services.length;
  const activeIndex = (rotation % numServices + numServices) % numServices;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // This effect runs only on the client to set the initial window width
    // and add a resize listener.
    const onResize = () => setWinW(window.innerWidth);
    onResize(); // Set initial width on client mount
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // Show the tap-to-navigate prompt on mobile for a few seconds
    if (isMobile && mounted) {
      const timer = setTimeout(() => {
        setShowTapPrompt(true);
      }, 500); // Show after a brief delay to let the card animate in
      const hideTimer = setTimeout(() => setShowTapPrompt(false), 10500); // Hide after 10s

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isMobile, mounted]); // Dependency on mounted ensures this runs only on the client

  // Card size is controlled by the carousel. Card fills parent (see ServiceCard).
  const card = useMemo(() => {
    if (isMobile) {
      // Make card wider, but ensure it fits with the side buttons.
      // We can make the card wider now that we're removing the side buttons.
      const width = Math.round(Math.min(winW - 32, 380)); // 1rem padding on each side
      const height = Math.round(width * MOBILE_ASPECT_RATIO);
      return { width, height };
    }
    return { width: DESKTOP_CARD_WIDTH, height: DESKTOP_CARD_HEIGHT };
  }, [isMobile, winW]);

  // 3D math (desktop only)
  const useSimplifiedLayout = isMobile || numServices < 3;

  const { anglePerItem, radius } = useMemo(() => {
    if (useSimplifiedLayout) return { anglePerItem: 0, radius: 0 };
    const n = numServices;
    const angle = 360 / n;
    const r = ((card.width / 2) / Math.tan(Math.PI / n)) * 1.15; // slight extra so edges aren’t clipped
    return { anglePerItem: angle, radius: r };
  }, [useSimplifiedLayout, card.width, numServices]);

  // Rotation spring (desktop)
  const rotateY = useSpring(0, { stiffness: 120, damping: 28 });
  useEffect(() => {
    if (!useSimplifiedLayout) rotateY.set(-rotation * anglePerItem);
  }, [rotation, anglePerItem, useSimplifiedLayout, rotateY]);

  const next = useCallback(() => setRotation((r) => r + 1), []);
  const prev = useCallback(() => setRotation((r) => r - 1), []); // Prevent clipping: give enough vertical space and let 3D overflow be visible.

  const containerHeight = isMobile ? card.height + 80 : Math.round(card.height * 1.6);

  if (!mounted) {
    // Render a placeholder with a fixed height to prevent layout shift on initial load.
    // This prevents the "pop-in" effect where the desktop layout flashes on mobile.
    // The height is an approximation of the final component height.
    return <div className="relative w-full" style={{ height: '600px' }} />;
  }

  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height: containerHeight }}
    >
      {/* Arrows for non-mobile layouts with more than one card */}
      {!isMobile && numServices > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full"
            onClick={prev}
            aria-label="Previous service"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full"
            onClick={next}
            aria-label="Next service"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* --- SIMPLIFIED LAYOUT (Mobile, or Desktop with < 3 items) --- */}
      {useSimplifiedLayout && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div
            className="relative flex items-center justify-center"
            style={{ width: card.width, height: card.height }}
          >
            {/* Card */}
            <AnimatePresence mode="wait">
              <motion.div
                ref={cardRef}
                key={activeIndex}
                className="cursor-pointer"
                style={{
                  width: card.width,
                  height: card.height,
                  willChange: 'transform, opacity', // Hint for smoother animations
                }}
                variants={{ enter: { opacity: 0, scale: 0.9 }, center: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onTap={isMobile ? (event, info) => {
                  if (numServices > 1) {
                    // On mobile, event.currentTarget can be null in a race condition.
                    // Using a ref and the gesture info object is more robust.
                    if (!cardRef.current) return;

                    const cardRect = cardRef.current.getBoundingClientRect();
                    const tapX = info.point.x;

                    if (tapX > cardRect.left + cardRect.width / 2) {
                      next();
                    } else {
                      prev();
                    }
                  }
                } : undefined}
              >
                <ServiceCard service={services[activeIndex]} isCarouselCard isActive={true} isMobile={isMobile} />
              </motion.div>
            </AnimatePresence>

            {/* Tap to navigate prompt */}
            <AnimatePresence>
              {showTapPrompt && isMobile && activeIndex === 0 && numServices > 1 && (
                <motion.div
                  className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none z-20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.3 } }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2 text-white bg-black/60 py-2 px-3 rounded-full backdrop-blur-sm shadow-lg">
                    <MousePointerClick className="w-4 h-4" />
                    <span className="text-xs font-semibold">Tap sides to navigate</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          {numServices > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setRotation(rotation + (index - activeIndex))}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-accent scale-125' : 'bg-muted-foreground/40 hover:bg-muted-foreground/70'}`}
                  aria-label={`Go to service ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- DESKTOP LAYOUT (true 3D cylinder) --- */}
      {!useSimplifiedLayout && (
        <div
          className="w-full h-full relative"
          // apply perspective on the direct parent of the rotating element
          style={{ perspective: 1200, overflow: 'visible' }}
        >
          <motion.ul
            className="relative w-full h-full list-none p-0 m-0"
            style={{
              transformStyle: 'preserve-3d',
              rotateY,
              // Hide initial “flat” paint until mounted & radius computed
              visibility: mounted ? 'visible' : 'hidden',
            }}
          >
            {services.map((s, index) => {
              const transform = `rotateY(${index * anglePerItem}deg) translateZ(${radius}px)`;
              const isActive = index === activeIndex;
              return (
                <motion.li
                  key={s._id}
                  initial={false}
                  className="absolute top-1/2 left-1/2 cursor-pointer"
                  onTap={() => {
                    if (isActive) {
                      // If the active card is clicked, navigate to its page.
                      // The fallback to '/services' is a safety net.
                      router.push(s.link || '/services');
                    } else {
                      // If an inactive card is clicked, rotate it to the front.
                      let diff = index - activeIndex;
                      if (Math.abs(diff) > numServices / 2) {
                        if (diff > 0) diff -= numServices;
                        else diff += numServices;
                      }
                      setRotation(rotation + diff);
                    }
                  }}
                  style={{
                    width: card.width,
                    height: card.height,
                    marginLeft: -card.width / 2,
                    marginTop: -card.height / 2,
                    transformStyle: 'preserve-3d',
                    // Hint to the browser to optimize the transform animation
                    willChange: 'transform',
                  }}
                  animate={{
                    transform: `${transform} scale(${isActive ? 1 : 0.85})`,
                    transition: { type: 'tween', ease: 'easeInOut', duration: 0.5 },
                  }}
                >
                  <ServiceCard service={s} isCarouselCard isActive={isActive} isMobile={isMobile} />
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      )}
    </div>
  );
};
