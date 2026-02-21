import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useGetJobPostings } from '../hooks/useJobPostings';
import { useGetJobApplications } from '../hooks/useApplications';
import AuthGuard from '../components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, Plus, FileText } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import EmployerJobPostingCard from '../components/EmployerJobPostingCard';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: jobPostings = [], isLoading } = useGetJobPostings();

  const myJobs = jobPostings.filter(job => 
    job.employerId.toString() === identity?.getPrincipal().toString()
  );

  const activeJobs = myJobs.filter(job => job.isActive);

  return (
    <AuthGuard requireRole="employer" userRole={userProfile?.role}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job postings and review applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Postings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myJobs.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Plus className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => navigate({ to: '/employer/jobs' })}
                className="w-full"
              >
                Post New Job
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate({ to: '/employer/jobs' })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Manage Job Postings
              </CardTitle>
              <CardDescription>
                Create, edit, and manage your job listings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate({ to: '/jobs' })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Search Candidates
              </CardTitle>
              <CardDescription>
                Browse and filter qualified candidates
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Job Postings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Job Postings</h2>
            <Button onClick={() => navigate({ to: '/employer/jobs' })}>
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : myJobs.length === 0 ? (
            <EmptyState
              title="No job postings yet"
              description="Create your first job posting to start receiving applications"
              action={
                <Button onClick={() => navigate({ to: '/employer/jobs' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Posting
                </Button>
              }
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJobs.slice(0, 6).map(job => (
                <EmployerJobPostingCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
