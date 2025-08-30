'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2 } from 'lucide-react';
import { changeAdminPassword } from '@/lib/actions/user.actions';

export function SecuritySettingsForm() {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await changeAdminPassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (result.success) {
        toast.success(result.message);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your admin account password. After saving, you may need to log in again.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" name="currentPassword" type="password" value={passwords.currentPassword} onChange={handleInputChange} required /></div>
          <div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" name="newPassword" type="password" value={passwords.newPassword} onChange={handleInputChange} required /></div>
          <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" name="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handleInputChange} required /></div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update Password</Button></CardFooter>
      </form>
    </Card>
  );
}

