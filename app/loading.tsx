import CodeTypeLoader from '@/components/ui/CodeTypeLoader';

export default function Loading() {
  // This full-screen loading UI will be displayed as a fallback for the initial load
  // and when navigating between routes.
  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-full items-center justify-center bg-background">
      <CodeTypeLoader />
    </div>
  );
}