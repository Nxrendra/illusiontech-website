// /Users/macbookair/Documents/IllusionTech-Development/components/TrackingPixel.tsx

'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function Track() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Optional: Don't track admin pages to keep analytics clean
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    const referrer = document.referrer;

    // Send beacon (non-blocking)
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        page: url, 
        referrer
      }),
      keepalive: true // Ensures request completes even if user navigates away
    }).catch(err => {
      // Silently fail to not disturb user experience
      if (process.env.NODE_ENV === 'development') console.error('Tracking failed', err);
    });
    
  }, [pathname, searchParams]);

  return null;
}

export default function TrackingPixel() {
  return (
    <Suspense fallback={null}>
      <Track />
    </Suspense>
  );
}
