import { AdminSidebarNav } from '@/components/admin/AdminSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-card md:block">
        <AdminSidebarNav />
      </aside>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}