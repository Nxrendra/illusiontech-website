'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { services } from '@/lib/data/services';
import { cn } from '@/lib/utils';

export function ServiceSidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-24 h-[calc(100vh-6rem)] w-full md:w-64 pr-8 hidden md:block">
      <nav className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-foreground mb-2">Our Services</h3>
        {services.map((service) => {
          // For links with hashes, we only care about the base path for matching.
          const basePath = service.link.split('#')[0];
          const isActive = pathname === basePath;

          return (
            <Link
              key={service.name}
              href={service.link}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {service.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}