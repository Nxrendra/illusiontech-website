// /Users/macbookair/Documents/IllusionTech-Development/app/services/layout.tsx
import React from 'react';

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  // This layout now only renders children - the subnav is handled globally
  // by ConditionalSubNav in the root layout
  return (
    <>
      {children}
    </>
  );
}
