'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  BarChart2,
  Bot,
  Briefcase,
  FileText,
  FileDigit,
  Shield,
  Users2,
  Inbox,
  LayoutGrid,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from  '@/components/ui/Tooltip';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/dashboard/services', label: 'Services & Features', icon: Briefcase },
  { href: '/admin/dashboard/content', label: 'Page Content', icon: FileText },
  { href: '/admin/dashboard/legal', label: 'Legal Documents', icon: Shield },
  { href: '/admin/dashboard/contact-submissions', label: 'Submissions', icon: Inbox },
  { href: '/admin/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/admin/dashboard/agents', label: 'Agents', icon: Users2 },
  { href: '/admin/dashboard/price-breakdowns', label: 'Price Breakdowns', icon: FileDigit },
  { href: '/admin/dashboard/chat', label: 'AI Chat', icon: Bot },
  { href: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/dashboard/newsletter', label: 'Newsletter', icon: Newspaper },
];

const bottomNavItems = [
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/', label: 'Back to Site', icon: ArrowLeft },
];

interface AdminSidebarNavProps {
  isMobile?: boolean;
}

export function AdminSidebarNav({ isMobile = false }: AdminSidebarNavProps) {
  const pathname = usePathname();

  const renderLink = (item: typeof navItems[0]) => {
    const isActive =
      (item.href === '/admin/dashboard' && pathname === item.href) ||
      (item.href !== '/admin/dashboard' && pathname && pathname.startsWith(item.href));
    const linkClass = cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
      { 'bg-accent text-accent-foreground hover:text-accent-foreground': isActive }
    );

    const linkContent = (
      <>
        <item.icon className="h-4 w-4" />
        {item.label}
      </>
    );

    if (isMobile) {
      return (
        <Link key={item.href} href={item.href} className={linkClass}>
          {linkContent}
        </Link>
      );
    }

    return (
      <TooltipProvider key={item.href} delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href} className={linkClass}>
              {linkContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <nav className="flex flex-col gap-2 p-2 text-lg font-medium">
      <Link href="/admin/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4 px-3 py-2">
        <Bot className="h-6 w-6 text-accent" />
        <span>IllusionTech</span>
      </Link>
      {navItems.map(renderLink)}
      <div className="mt-auto flex flex-col gap-2">{bottomNavItems.map(renderLink)}</div>
    </nav>
  );
}