'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { MoreVertical, Edit, Trash2, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/AlertDialog';
import { IPriceBreakdown } from '@/lib/models/PriceBreakdown';
import { deletePriceBreakdown } from '@/lib/actions/priceBreakdown.actions';

type SerializedBreakdown = IPriceBreakdown & { serviceId: { _id: string, name: string } };

interface BreakdownListProps {
  breakdowns: SerializedBreakdown[];
  onEdit: (breakdown: SerializedBreakdown) => void;
  onDelete: (id: string) => void;
}

export function BreakdownList({ breakdowns, onEdit, onDelete }: BreakdownListProps) {
  const handleDelete = async (id: string) => {
    const result = await deletePriceBreakdown(id);
    if (result.success) {
      toast.success('Breakdown deleted successfully.');
      onDelete(id);
    } else {
      toast.error(result.error || 'Failed to delete breakdown.');
    }
  };

  if (breakdowns.length === 0) {
    return <div className="text-center py-16 border-2 border-dashed border-border rounded-lg"><h3 className="text-lg font-semibold">No Price Breakdowns Found</h3><p className="text-muted-foreground mt-2 text-sm">Add a new breakdown to get started.</p></div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {breakdowns.map((breakdown) => (
        <Card key={breakdown._id}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div><CardTitle>{breakdown.title}</CardTitle><CardDescription>For: {breakdown.serviceId.name}</CardDescription></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link href={`/documents/${breakdown.slug}`} target="_blank"><ExternalLink className="mr-2 h-4 w-4" />View Public Page</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(breakdown)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the breakdown for "{breakdown.title}".</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction asChild><Button variant="destructive" onClick={() => handleDelete(breakdown._id)}>Delete</Button></AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground line-clamp-3">{breakdown.summary}</p></CardContent>
          <CardFooter className="flex justify-between text-sm"><div className="font-semibold">{breakdown.priceRange}</div><div className="text-muted-foreground">{breakdown.timeframe}</div></CardFooter>
        </Card>
      ))}
    </div>
  );
}

