import { useGetJobPostings } from '../hooks/useJobPostings';
import { useGetCandidateProfile } from '../hooks/useCandidates';
import { useUpdateApplicationStatus } from '../hooks/useApplications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Application, JobId } from '../backend';

interface ApplicationListProps {
  applications: Application[];
  jobId?: JobId;
  isEmployer: boolean;
}

export default function ApplicationList({ applications, jobId, isEmployer }: ApplicationListProps) {
  const { data: jobPostings = [] } = useGetJobPostings();
  const updateStatus = useUpdateApplicationStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'reviewed': return 'secondary';
      case 'shortlisted': return 'default';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleStatusChange = async (app: Application, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        jobId: app.jobId,
        applicantId: app.applicantId.toString(),
        newStatus,
      });
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No applications yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app, idx) => {
        const job = jobPostings.find(j => j.id === app.jobId);
        
        return (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {!isEmployer && job && (
                    <>
                      <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </>
                  )}
                  {isEmployer && (
                    <CandidateInfo applicantId={app.applicantId.toString()} />
                  )}
                </div>
                <Badge variant={getStatusColor(app.status)}>
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Applied on {formatDate(app.appliedAt)}
              </div>

              {app.expectedSalary && (
                <div className="text-sm">
                  <span className="font-medium">Expected Salary:</span> ${Number(app.expectedSalary).toLocaleString()}
                </div>
              )}

              {app.coverLetter && (
                <div className="text-sm">
                  <span className="font-medium">Cover Letter:</span>
                  <p className="mt-1 text-muted-foreground">{app.coverLetter}</p>
                </div>
              )}

              {app.resume && (
                <div className="text-sm">
                  <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View Resume
                  </a>
                </div>
              )}

              {isEmployer && (
                <div className="pt-2">
                  <Select value={app.status} onValueChange={(value) => handleStatusChange(app, value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CandidateInfo({ applicantId }: { applicantId: string }) {
  const { data: candidate } = useGetCandidateProfile(applicantId);

  if (!candidate) {
    return <CardTitle className="text-lg">Applicant</CardTitle>;
  }

  return (
    <>
      <CardTitle className="text-lg mb-1">
        {candidate.firstName} {candidate.lastName}
      </CardTitle>
      <CardDescription>{candidate.headline}</CardDescription>
    </>
  );
}
