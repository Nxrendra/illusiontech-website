'use client';

import { usePathname } from 'next/navigation';
import ServicesSubNav from '@/components/ServicesSubNav';

/**
 * This client component conditionally renders the `ServicesSubNav`
 * based on the current URL path. It's used in the root layout
 * to ensure the sub-nav is positioned correctly relative to the main navbar.

 */
export default function ConditionalSubNav() {
  const pathname = usePathname();
  // The usePathname hook can return null in some circumstances (e.g. during
  // initial render). We use optional chaining (?.) to safely call .startsWith()
  // only if pathname is a string.
  const showSubNav = pathname?.startsWith('/services');

  return showSubNav ? <ServicesSubNav /> : null;
}
