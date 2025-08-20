// app/test/client-page.tsx
'use client';

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Dynamic Test: {count}</h1>
    </div>
  );
}