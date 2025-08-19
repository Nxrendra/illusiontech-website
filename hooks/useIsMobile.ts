'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // Corresponds to Tailwind's `md` breakpoint

/**
 * A hook to determine if the current viewport is a mobile device based on width.
 * @returns {boolean} `true` if the viewport width is less than 768px, otherwise `false`.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};