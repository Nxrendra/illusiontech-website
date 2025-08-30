import { cookies } from 'next/headers';
import { connectToDB } from '@/lib/mongoose';
import { jwtVerify } from 'jose';
import ContactSubmission, { IContactSubmissionData } from '@/lib/models/ContactSubmission';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { SubmissionsChart } from '@/components/admin/SubmissionsChart';
import { SubmissionCard } from '@/components/admin/SubmissionCard';
import { AdminHeader } from '@/components/admin/AdminHeader';

const JWT_SECRET = process.env.JWT_SECRET;

async function getSubmissions() {
  const token = cookies().get('auth_token')?.value;

  if (!token || !JWT_SECRET) {
    // This check is a safeguard. The middleware should prevent this page from being rendered without a token.
    return { error: 'Authentication required. Please log in.' };
  }

  try {
    // Verify the token's validity before fetching data from the database
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);
    
    // Connect to the database and fetch submissions using the Mongoose model.
    // This is more consistent with the rest of your application and more type-safe.
    await connectToDB();
    const submissions = await ContactSubmission.find({}).sort({ createdAt: -1 }).lean();

    // Convert non-serializable data like ObjectId and Date to strings
    return { submissions: JSON.parse(JSON.stringify(submissions)) };
  } catch (error) {
    console.error('JWT verification or DB error:', error);
    return { error: 'Your session is invalid or has expired. Please log in again.' };
  }
}

// Create a more specific type for submissions after they've been serialized.
// This tells TypeScript that `_id` from MongoDB's ObjectId is now a string.
type SerializedContactSubmission = IContactSubmissionData & { _id: string; createdAt: string; updatedAt: string; };

export default async function ContactSubmissionsPage() {
  const { submissions, error } = (await getSubmissions()) as { submissions?: SerializedContactSubmission[], error?: string };

  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4" role="alert">
        <p className="font-bold">Access Denied</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="bg-background p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-foreground mb-6">Contact Form Submissions</h1>
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <h2 className="text-xl font-semibold text-foreground">No Submissions Yet</h2>
          <p className="text-muted-foreground mt-2">When new submissions arrive, they will appear here.</p>
        </div>
      </div>
    );
  }

  // Process data for stats and charts
  const totalSubmissions = submissions.length;
  const newProjectsCount = submissions.filter(s => s.serviceType === 'new-project').length;
  const maintenanceCount = submissions.filter(s => s.serviceType === 'maintenance').length;

  const serviceTypeCounts = submissions.reduce((acc: { [key: string]: number }, s) => {
    acc[s.serviceType] = (acc[s.serviceType] || 0) + 1;
    return acc;
  }, {});

  const serviceTypeData = Object.entries(serviceTypeCounts).map(([name, count]) => ({ name, count }));

  const submissionsByDate = submissions.reduce((acc: { [key: string]: number }, s) => {
    const date = new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const submissionsChartData = Object.entries(submissionsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <AdminHeader title="Submissions" />
      <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
        {/* Stats Cards */}
        <DashboardStats 
          totalSubmissions={totalSubmissions}
          newProjectsCount={newProjectsCount}
          maintenanceCount={maintenanceCount}
        />

        {/* Charts */}
        <SubmissionsChart serviceTypeData={serviceTypeData} submissionsChartData={submissionsChartData} />

        {/* Submissions List */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">All Inquiries</h2>
          <div className="space-y-6">
            {submissions.map((submission) => (
              <SubmissionCard key={submission._id} submission={submission} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}