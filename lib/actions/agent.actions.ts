'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '@/lib/mongoose';
import Agent, { IAgent, IAgentData } from '@/lib/models/Agent';
import { verifyAdminSession } from '../auth-utils';
import { sendBroadcastEmail } from '../email';


// Create
export async function createAgent(agentData: IAgentData) {
  await verifyAdminSession();
  try {
    await connectToDB();
    const newAgent = await Agent.create(agentData);
    revalidatePath('/admin/dashboard/agents');
    return { success: true, data: JSON.parse(JSON.stringify(newAgent)) as IAgent };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    if (errorMessage.includes('duplicate key error')) {
      return { success: false, error: 'An agent with this email already exists.' };
    }
    return { success: false, error: errorMessage };
  }
}

// Read (all)
export async function getAgents(): Promise<IAgent[]> {
  try {
    await connectToDB();
    const agents = await Agent.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(agents));
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

// Update
export async function updateAgent(id: string, agentData: Partial<IAgentData>) {
  await verifyAdminSession();
  try {
    await connectToDB();
    const updatedAgent = await Agent.findByIdAndUpdate(id, agentData, { new: true });
    if (!updatedAgent) {
      return { success: false, error: 'Agent not found.' };
    }
    revalidatePath('/admin/dashboard/agents');
    return { success: true, data: JSON.parse(JSON.stringify(updatedAgent)) as IAgent };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

// Delete
export async function deleteAgent(id: string) {
  await verifyAdminSession();
  try {
    await connectToDB();
    const deletedAgent = await Agent.findByIdAndDelete(id);
    if (!deletedAgent) {
      return { success: false, error: 'Agent not found.' };
    }
    revalidatePath('/admin/dashboard/agents');
    return { success: true, message: 'Agent deleted successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

// Broadcast Email
export async function broadcastEmailToAgents({ subject, htmlContent }: { subject: string; htmlContent: string }) {
  await verifyAdminSession();
  try {
    const agents = await getAgents();
    const recipients = agents.filter(agent => agent.status === 'Active').map(agent => agent.email);
    if (recipients.length === 0) return { success: true, message: 'No active agents to send email to.' };
    await sendBroadcastEmail({ recipientEmails: recipients, subject, html: htmlContent });
    return { success: true, message: `Email sent to ${recipients.length} active agents.` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}

