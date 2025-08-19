import {
  Briefcase,
  Phone,
  Calendar,
  ChevronDown,
  CircleDollarSign,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Package,
  User,
  Wrench,
} from 'lucide-react';
import { IContactSubmission } from '@/lib/models/ContactSubmission';

const serviceTypeLabels: { [key: string]: string } = {
  'new-project': 'New Project',
  'maintenance': 'Support & Maintenance',
  'ui-ux-design': 'UI/UX Design',
  'website-design': 'Website Design',
  'automation': 'Automation & Integration',
  'general': 'General Inquiry',
};

const packageLabels: { [key: string]: string } = {
  solo: 'Solo Showcase',
  starter: 'Starter Website',
  business: 'Business Website',
  pro: 'Pro/Custom App',
  unsure: "Not Sure",
};

const planLabels: { [key: string]: string } = {
  basic: 'Basic Care',
  growth: 'Growth Plan',
  premium: 'Premium Support',
  unsure: "Not Sure",
};

const budgetLabels: { [key: string]: string } = {
  '500-700': '$500 - $700 TTD',
  '800-1300': '$800 - $1,300 TTD',
  '1400-3000': '$1,400 - $3,000 TTD',
  '3500+': '$3,500+ TTD',
  '250-400': '$250 - $400 TTD / month',
  '400-600': '$400 - $600 TTD / month',
  '600-1000': '$600 - $1,000 TTD / month',
  flexible: 'Flexible',
};

const timelineLabels: { [key: string]: string } = {
  '1w': '1 Week',
  '2-3w': '2-3 Weeks',
  '1m': '1 Month',
  '2m': '2 Months',
  '3m': '3 Months',
  monthly: 'Monthly',
  quarterly: 'Quarterly (3 months)',
  annually: 'Annually (1 year)',
  flexible: 'Flexible',
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-start text-sm">
      <div className="flex-shrink-0 w-5 h-5 text-muted-foreground mr-3 mt-0.5">{icon}</div>
      <div>
        <span className="font-semibold text-foreground">{label}:</span>
        <span className="text-muted-foreground ml-2">{value}</span>
      </div>
    </div>
  );
};

export function SubmissionCard({ submission }: { submission: IContactSubmission }) {
  const {
    firstName, lastName, email, phoneNumber, message, serviceType, newProjectPackage, maintenancePlan,
    websiteURL, budget, timeline, createdAt
  } = submission;

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{firstName} {lastName}</h3>
            <a href={`mailto:${email}`} className="text-sm text-accent hover:underline flex items-center gap-2">
              <Mail size={14} /> {email}
            </a>
            {phoneNumber && (
              <a href={`tel:${phoneNumber}`} className="text-sm text-muted-foreground hover:underline flex items-center gap-2 mt-1">
                <Phone size={14} /> {phoneNumber}
              </a>
            )}
          </div>
          <div className="text-sm text-muted-foreground text-left sm:text-right">
            {new Date(createdAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-6 space-y-4">
        <DetailItem icon={<Briefcase />} label="Service Type" value={serviceTypeLabels[serviceType]} />
        {serviceType === 'new-project' && (
          <DetailItem icon={<Package />} label="Package" value={packageLabels[newProjectPackage || 'unsure']} />
        )}
        {serviceType === 'maintenance' && (
          <>
            <DetailItem icon={<Wrench />} label="Plan" value={planLabels[maintenancePlan || 'unsure']} />
            <DetailItem icon={<LinkIcon />} label="Website URL" value={websiteURL} />
          </>
        )}
        <DetailItem icon={<CircleDollarSign />} label="Budget" value={budgetLabels[budget || '']} />
        <DetailItem
          icon={<Calendar />}
          label={serviceType === 'maintenance' ? 'Contract Length' : 'Project Timeline'}
          value={timelineLabels[timeline || '']}
        />
      </div>

      <div className="border-t border-border">
        <details className="group">
          <summary className="p-6 flex items-center justify-between cursor-pointer list-none">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">View Message</span>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6">
            <p className="text-muted-foreground whitespace-pre-wrap bg-background/50 p-4 rounded-md border border-border">
              {message}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}