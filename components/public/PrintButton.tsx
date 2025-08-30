'use client';

import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button onClick={handlePrint} className="fixed bottom-5 right-5 z-50 no-print shadow-lg" size="large">
      <Download className="mr-2 h-5 w-5" />
      Download PDF
    </Button>
  );
}