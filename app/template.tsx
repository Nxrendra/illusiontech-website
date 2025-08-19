'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  // The PageTransition component has been removed to disable page transitions.
  return <>{children}</>;
}
