import Link from 'next/link';
import {
  Home,
  Users,
  Briefcase,
  FileText,
  Mail,
  Rocket,
} from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';
import { NavLink } from '@/components/admin/NavLink';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Rocket className="h-6 w-6 text-accent" />
            <span className="">IllusionTech CMS</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavLink href="/admin/dashboard"><Home className="h-4 w-4" /> Dashboard</NavLink>
            <NavLink href="/admin/dashboard/clients"><Users className="h-4 w-4" /> Clients</NavLink>
            <NavLink href="/admin/dashboard/services"><Briefcase className="h-4 w-4" /> Services</NavLink>
            <NavLink href="/admin/dashboard/submissions"><FileText className="h-4 w-4" /> Submissions</NavLink>
            {/* <NavLink href="/admin/dashboard/newsletter"><Mail className="h-4 w-4" /> Newsletter</NavLink> */}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <LogoutButton />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}