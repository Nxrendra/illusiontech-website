'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AgentList } from './AgentList';
import { BroadcastForm } from './BroadcastForm';
import { IAgent } from '@/lib/models/Agent';

interface AgentManagerProps {
  initialAgents: IAgent[];
}

export default function AgentManager({ initialAgents }: AgentManagerProps) {
  const [agents, setAgents] = useState<IAgent[]>(initialAgents);

  const handleAgentUpdate = (updatedAgent: IAgent) => {
    setAgents(prev => prev.map(agent => agent._id === updatedAgent._id ? updatedAgent : agent));
  };

  const handleAgentAdd = (newAgent: IAgent) => {
    setAgents(prev => [newAgent, ...prev]);
  };

  const handleAgentDelete = (deletedAgentId: string) => {
    setAgents(prev => prev.filter(agent => agent._id !== deletedAgentId));
  };

  return (
    <Tabs defaultValue="agents" className="space-y-4">
      <TabsList>
        <TabsTrigger value="agents">All Agents</TabsTrigger>
        <TabsTrigger value="broadcast">Broadcast Email</TabsTrigger>
      </TabsList>
      <TabsContent value="agents">
        <AgentList agents={agents} onAgentAdd={handleAgentAdd} onAgentUpdate={handleAgentUpdate} onAgentDelete={handleAgentDelete} />
      </TabsContent>
      <TabsContent value="broadcast"><BroadcastForm /></TabsContent>
    </Tabs>
  );
}

