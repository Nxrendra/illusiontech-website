import Link from 'next/link';
import {
  Home,
  Users,
  Briefcase,
  FileText,
  ClipboardEdit,
  BarChart2,
  MessageSquare,
  Newspaper,
  PanelLeft,
  Package2,
  Rocket,
} from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';
import { NavLink } from '@/components/admin/NavLink';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';

// A complete list of navigation items for the admin panel
const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/dashboard/services', icon: Briefcase, label: 'Services & Features' },
  { href: '/admin/dashboard/content', icon: ClipboardEdit, label: 'Page Content' },
  { href: '/admin/dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/admin/dashboard/contact-submissions', icon: FileText, label: 'Submissions' },
  { href: '/admin/dashboard/chat-sessions', icon: MessageSquare, label: 'Chat Sessions' },
  { href: '/admin/dashboard/newsletter', icon: Newspaper, label: 'Newsletter' },
  { href: '/admin/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Rocket className="h-6 w-6 text-accent" />
              <span className="">IllusionTech CMS</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile Header & Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/admin/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Package2 className="h-6 w-6" />
                  <span>IllusionTech CMS</span>
                </Link>
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto"><LogoutButton /></div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
        </header>
        <main className="flex-1 overflow-auto bg-muted/40">{children}</main>
      </div>
    </div>
  );
}
