'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { IAgent } from '@/lib/models/Agent';
import { deleteAgent } from '@/lib/actions/agent.actions';

interface DeleteAgentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  agent: IAgent;
  onAgentDelete: (id: string) => void;
}

export function DeleteAgentDialog({ isOpen, setIsOpen, agent, onAgentDelete }: DeleteAgentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAgent(agent._id);
      if (result.success) {
        onAgentDelete(agent._id);
        toast.success('Agent deleted successfully!');
        setIsOpen(false);
      } else { throw new Error(result.error); }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the agent <span className="font-semibold">{agent.fullName}</span>.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction asChild><Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete</Button></AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

