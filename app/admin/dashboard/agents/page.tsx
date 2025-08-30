import { AdminHeader } from '@/components/admin/AdminHeader';
import AgentManager from '@/components/admin/agents/AgentManager';
import { getAgents } from '@/lib/actions/agent.actions';
import { verifyAdminSession } from '@/lib/auth-utils';

export default async function AgentsPage() {
  try {
    await verifyAdminSession();
  } catch (error) {
    const authError = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{authError}</p>
      </div>
    );
  }

  const agents = await getAgents();

  return (
    <>
      <AdminHeader title="Sales Agents" />
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <AgentManager initialAgents={agents} />
      </main>
    </>
  );
}

