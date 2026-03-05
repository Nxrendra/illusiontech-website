import { AdminSidebarNav } from '@/components/admin/AdminSidebar';

// By exporting 'force-dynamic' from this layout, we are telling Next.js that all
// pages within this layout (i.e., all admin dashboard pages) should be
// rendered dynamically at request time. This is necessary because they use
// `verifyAdminSession`, which reads cookies.
export const dynamic = 'force-dynamic';

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