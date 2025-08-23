'use client';

import { useState } from 'react';
import { IServiceData } from '@/lib/models/Service';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Edit, Trash2, Loader2, Star, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/AlertDialog';
import { Badge } from '@/components/ui/Badge';

type SerializedService = IServiceData & {
  _id: string;
};

interface ServiceListProps {
  services: SerializedService[];
  onEdit: (service: SerializedService) => void;
  onRemove: (id: string) => Promise<void>;
}

export default function ServiceList({ services, onEdit, onRemove }: ServiceListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [serviceToRemove, setServiceToRemove] = useState<SerializedService | null>(null);

  const handleRemoveClick = (service: SerializedService) => {
    setServiceToRemove(service);
    setIsAlertOpen(true);
  };

  const confirmRemove = async () => {
    if (!serviceToRemove) return;
    setIsDeleting(serviceToRemove._id);
    await onRemove(serviceToRemove._id);
    setIsDeleting(null);
    setServiceToRemove(null);
    setIsAlertOpen(false);
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground">No Services Found</h3>
        <p className="text-muted-foreground mt-2 text-sm">Add a new service to get started. You may need to run a seeding script to populate initial data.</p>
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
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell><Badge variant="secondary">{service.type}</Badge></TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {service.featured && <Badge><Star className="mr-1 h-3 w-3" /> Featured</Badge>}
                  {service.isCoreService && <Badge variant="outline"><CheckCircle className="mr-1 h-3 w-3" /> Core</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(service)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoveClick(service)} className="text-destructive">
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
              This action cannot be undone. This will permanently delete the service <span className="font-medium">{serviceToRemove?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} disabled={isDeleting === serviceToRemove?._id} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting === serviceToRemove?._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}