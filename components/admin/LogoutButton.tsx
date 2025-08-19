'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Redirect to the login page regardless of whether the API call succeeded
      router.refresh(); // Ensures the client-side cache is cleared
      router.push('/admin/login');
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="w-full justify-start text-left bg-gray-700 hover:bg-gray-600 text-white"
    >
      <LogOut size={18} className="mr-3" />
      Logout
    </Button>
  );
}
