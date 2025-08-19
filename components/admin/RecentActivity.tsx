import { formatDistanceToNow } from 'date-fns';
import { FileText, UserPlus, MessageSquare } from 'lucide-react';
import { IContactSubmission } from '@/lib/models/ContactSubmission';
import { IClient } from '@/lib/models/Client';

// A type to unify different kinds of activities
type ActivityItem =
  | { type: 'submission'; data: IContactSubmission & { _id: string; createdAt: string } }
  | { type: 'client'; data: IClient & { _id: string; createdAt: string } }
  | { type: 'chat'; data: { sessionId: string; name: string; createdAt: string; lastMessage: string; } };

const serviceTypeLabels: { [key: string]: string } = {
  'new-project': 'New Project Inquiry',
  'maintenance': 'Support Request',
  'ui-ux-design': 'UI/UX Design Inquiry',
  'website-design': 'Web Design Inquiry',
  'automation': 'Automation Inquiry',
  'general': 'General Inquiry',
};

export function RecentActivity({
  submissions,
  clients,
  chats,
}: {
  submissions: (IContactSubmission & { _id: string; createdAt: string })[],
  clients: (IClient & { _id: string; createdAt: string })[],
  chats: { sessionId: string; name: string; createdAt: string; lastMessage: string; }[],
}) {
  // Combine and sort activities
  const activities: ActivityItem[] = [
    ...submissions.map(s => ({ type: 'submission', data: s } as ActivityItem)),
    ...clients.map(c => ({ type: 'client', data: c } as ActivityItem)),
    ...chats.map(c => ({ type: 'chat', data: c } as ActivityItem)),
  ];

  activities.sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

  const recentActivities = activities.slice(0, 5); // Show latest 5 activities

  const renderIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'submission':
        return <FileText className="w-5 h-5 text-muted-foreground" />;
      case 'client':
        return <UserPlus className="w-5 h-5 text-muted-foreground" />;
      case 'chat':
        return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const renderDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'submission':
        return <>{serviceTypeLabels[activity.data.serviceType] || 'New Submission'} from <span className="font-semibold">{`${activity.data.firstName} ${activity.data.lastName}`}</span></>;
      case 'client':
        return <>New Client Added: <span className="font-semibold">{activity.data.name}</span></>;
      case 'chat':
        return <>New message in session <span className="font-semibold font-mono text-xs">{activity.data.sessionId.substring(0, 8)}...</span></>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivities.map(activity => (
          <div key={`${activity.type}-${activity.type === 'chat' ? activity.data.sessionId : activity.data._id}`} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              {renderIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                {renderDescription(activity)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.data.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        {recentActivities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}