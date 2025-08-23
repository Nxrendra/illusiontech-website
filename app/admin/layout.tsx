// /Users/macbookair/Documents/IllusionTech-Development/app/admin/layout.tsx
import Link from 'next/link';
import { Home, MessageSquare, Users, BarChart2, Mail, Newspaper } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';

const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/dashboard/chat-sessions', icon: MessageSquare, label: 'Chat Sessions' },
  { href: '/admin/dashboard/contact-submissions', icon: Mail, label: 'Contact Forms' },
  { href: '/admin/dashboard/newsletter', icon: Newspaper, label: 'Newsletter' },
  { href: '/admin/dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/admin/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col shadow-lg">
        <div className="mb-10">
          <Link href="/admin/dashboard" className="text-2xl font-bold text-white hover:text-gray-200">
            IllusionTech
          </Link>
        </div>
        <nav className="flex-grow">
        <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
      {/* This main element now has padding-top to prevent content from being hidden by a fixed navbar */}
      <main className="flex-1 p-8 pt-24">
        {children}
      </main>
    </div>
  );
}
