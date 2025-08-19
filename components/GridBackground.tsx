export function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full bg-background">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}