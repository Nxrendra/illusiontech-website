'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import type { ILegalDocumentData } from '@/lib/models/LegalDocument';

export default function LegalDocumentList({ initialDocuments }: { initialDocuments: (ILegalDocumentData & { _id: string })[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/dashboard/legal/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Document
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialDocuments.map((doc) => (
              <TableRow key={doc.slug}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>
                  <Badge variant={doc.isPublished ? 'default' : 'secondary'}>{doc.isPublished ? 'Published' : 'Draft'}</Badge>
                </TableCell>
                <TableCell>{new Date(doc.updatedAt!).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm"><Link href={`/admin/dashboard/legal/${doc.slug}`}>Edit</Link></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}