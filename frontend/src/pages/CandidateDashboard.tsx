import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useGetCallerCandidateProfile } from '../hooks/useCandidateProfile';
import { useGetUserApplications } from '../hooks/useApplications';
import AuthGuard from '../components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, User, DollarSign } from 'lucide-react';
import JobRecommendations from '../components/JobRecommendations';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: candidateProfile } = useGetCallerCandidateProfile();
  const { data: applications = [] } = useGetUserApplications(identity?.getPrincipal().toString() || '');

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const hasProfile = !!candidateProfile;

  return (
    <AuthGuard requireRole="candidate" userRole={userProfile?.role}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {userProfile?.name}!
          </h1>
          <p className="text-muted-foreground">
            Your personalized job dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {hasProfile ? 'Complete' : 'Incomplete'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Briefcase className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => navigate({ to: '/jobs' })}
                className="w-full"
              >
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Alert */}
        {!hasProfile && (
          <Card className="mb-8 border-warning bg-warning/5">
            <CardHeader>
              <CardTitle className="text-warning">Complete Your Profile</CardTitle>
              <CardDescription>
                Create your candidate profile to get personalized job recommendations and apply to positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/profile' })}>
                Create Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate({ to: '/jobs' })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Browse Jobs
              </CardTitle>
              <CardDescription>
                Explore full-time and part-time opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate({ to: '/freelance' })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Freelance Work
              </CardTitle>
              <CardDescription>
                Find contract and freelance projects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate({ to: '/my-applications' })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Applications
              </CardTitle>
              <CardDescription>
                Track your application status
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Job Recommendations */}
        {hasProfile && <JobRecommendations />}
      </div>
    </AuthGuard>
  );
}
