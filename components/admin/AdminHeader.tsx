'use client';

import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { AdminSidebarNav } from './AdminSidebar';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-background p-0">
          <AdminSidebarNav isMobile={true} />
        </SheetContent>
      </Sheet>
      <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{title}</h1>
      {/* You can add user profile button or other header items here */}
    </header>
  );
}