'use client';

import { useState } from 'react';
import { IClient } from '@/lib/models/Client';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/AlertDialog';
import { Badge } from '@/components/ui/Badge';

type SerializedClient = Omit<IClient, 'joinedDate' | '_id'> & {
  _id: string;
  joinedDate: string;
};

interface ClientListProps {
  clients: SerializedClient[];
  onEdit: (client: SerializedClient) => void;
  onRemove: (id: string) => Promise<void>;
}

export default function ClientList({ clients, onEdit, onRemove }: ClientListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [clientToRemove, setClientToRemove] = useState<SerializedClient | null>(null);

  const handleRemoveClick = (client: SerializedClient) => {
    setClientToRemove(client);
    setIsAlertOpen(true);
  };

  const confirmRemove = async () => {
    if (!clientToRemove) return;
    setIsDeleting(clientToRemove._id);
    await onRemove(clientToRemove._id);
    setIsDeleting(null);
    setClientToRemove(null);
    setIsAlertOpen(false);
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground">No Clients Found</h3>
        <p className="text-muted-foreground mt-2 text-sm">Add a new client to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.servicePlan}</TableCell>
                <TableCell>
                  <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>{client.status}</Badge>
                </TableCell>
                <TableCell>{new Date(client.joinedDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(client)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoveClick(client)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client <span className="font-medium">{clientToRemove?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} disabled={isDeleting === clientToRemove?._id} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting === clientToRemove?._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}