// /Users/macbookair/Documents/IllusionTech-Development/app/admin/layout.tsx
import Link from 'next/link';
import { Home, MessageSquare, Users, BarChart2, Mail } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';

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
            <li>
              <Link href="/admin/dashboard" className="flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                <Home size={18} />
                Dashboard
              </Link>
            </li>
            <li>
                  <Link href="/admin/dashboard/chat-sessions" className="flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                <MessageSquare size={18} />
                Chat Sessions
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/contact-submissions" className="flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                <Mail size={18} />
                Contact Forms
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/clients" className="flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                <Users size={18} />
                Clients
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/analytics" className="flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                <BarChart2 size={18} />
                Analytics
              </Link>
            </li>
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
