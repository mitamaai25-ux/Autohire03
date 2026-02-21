import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetJobPostings } from '../hooks/useJobPostings';
import { useGetJobApplications } from '../hooks/useApplications';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AuthGuard from '../components/AuthGuard';
import ApplicationList from '../components/ApplicationList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Briefcase } from 'lucide-react';

export default function JobApplications() {
  const { jobId } = useParams({ from: '/employer/jobs/$jobId/applications' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: jobPostings = [] } = useGetJobPostings();
  const { data: applications = [], isLoading } = useGetJobApplications(Number(jobId));

  const job = jobPostings.find(j => j.id === Number(jobId));
  const isOwner = job?.employerId.toString() === identity?.getPrincipal().toString();

  if (!job) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Job not found</p>
          <Button onClick={() => navigate({ to: '/employer/jobs' })}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireRole="employer" userRole={userProfile?.role}>
      <div className="container py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: '/employer/jobs' })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                <CardDescription className="text-base">
                  {job.company} • {job.location} • {job.employmentType}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-5 w-5" />
                <span className="font-semibold">{applications.length} Applications</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Applications</h2>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading applications...</div>
          ) : (
            <ApplicationList applications={applications} jobId={Number(jobId)} isEmployer />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
