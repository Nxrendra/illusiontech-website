export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout applies to all /admin routes, including login.
  // It should not contain the dashboard sidebar.
  return <>{children}</>;
}
