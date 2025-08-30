'use client';

import { useState } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Badge } from '@/components/ui/Badge';
import { IAgent } from '@/lib/models/Agent';
import { AgentForm } from './AgentForm';
import { DeleteAgentDialog } from './DeleteAgentDialog';
import { format } from 'date-fns';

interface AgentListProps {
  agents: IAgent[];
  onAgentAdd: (agent: IAgent) => void;
  onAgentUpdate: (agent: IAgent) => void;
  onAgentDelete: (id: string) => void;
}

export function AgentList({ agents, onAgentAdd, onAgentUpdate, onAgentDelete }: AgentListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<IAgent | null>(null);

  const handleEdit = (agent: IAgent) => {
    setSelectedAgent(agent);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAgent(null);
    setIsFormOpen(true);
  };

  const handleDelete = (agent: IAgent) => {
    setSelectedAgent(agent);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <AgentForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} agent={selectedAgent} onAgentAdd={onAgentAdd} onAgentUpdate={onAgentUpdate} />
      {selectedAgent && <DeleteAgentDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} agent={selectedAgent} onAgentDelete={onAgentDelete} />}
      <Card>
        <CardHeader className="relative">
          <CardTitle>Agents</CardTitle>
          <CardDescription>Manage your sales agents and their information.</CardDescription>
          <div className="absolute top-6 right-6">
            <Button size="sm" className="h-8 gap-1" onClick={handleAddNew}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Agent</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Commission</TableHead>
                <TableHead className="hidden md:table-cell">Date Joined</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <TableRow key={agent._id}>
                    <TableCell className="font-medium">{agent.fullName}<div className="text-sm text-muted-foreground md:hidden">{agent.companyName}</div></TableCell>
                    <TableCell className="hidden md:table-cell">{agent.companyName}</TableCell>
                    <TableCell><Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>{agent.status}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell">{agent.commissionRate}%</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(agent.createdAt), 'PPP')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleEdit(agent)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDelete(agent)} className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="h-24 text-center">No agents found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

