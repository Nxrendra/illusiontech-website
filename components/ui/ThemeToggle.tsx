'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/Button';
import { useAssistantStore } from '@/lib/assistant-store';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { setInteraction } = useAssistantStore();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  if (!mounted) {
    // return a placeholder or null to avoid hydration mismatch
    return <Button variant="outline" size="icon" disabled className="h-10 w-10" />;
  }

  const assistantMessage = `Click to switch to ${
    resolvedTheme === 'dark' ? 'light' : 'dark'
  } mode. A different look might be easier on your eyes!`;

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      onMouseEnter={() => setInteraction(assistantMessage, buttonRef.current)}
      onMouseLeave={() => setInteraction(null, null)}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
