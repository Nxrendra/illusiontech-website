'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { getCookie, setCookie } from '@/lib/cookie-utils';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // We run this in useEffect to ensure it only runs on the client
    // where `document.cookie` is available.
    const consent = getCookie(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // Set a cookie that expires in 365 days.
    setCookie(COOKIE_CONSENT_KEY, 'true', 365);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-full max-w-md rounded-lg bg-background/80 p-4 shadow-2xl backdrop-blur-md animate-fade-in-up">
      <p className="text-sm text-foreground/90">
        We use essential cookies to make our site work. For more details, see our{' '}
        <Link href="/privacy-policy" className="font-semibold text-primary underline-offset-4 hover:underline">
          Privacy Policy
        </Link>.
      </p>
      <Button onClick={handleAccept} size="sm" className="mt-3 w-full sm:w-auto">
        Okay, I understand
      </Button>
    </div>
  );
}