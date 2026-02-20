import { useNavigate } from '@tanstack/react-router';
import { useDeleteJobPosting } from '../hooks/useJobPostings';
import { useGetJobApplications } from '../hooks/useApplications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { JobPosting } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EmployerJobPostingCardProps {
  job: JobPosting;
  onEdit?: () => void;
}

export default function EmployerJobPostingCard({ job, onEdit }: EmployerJobPostingCardProps) {
  const navigate = useNavigate();
  const deleteJob = useDeleteJobPosting();
  const { data: applications = [] } = useGetJobApplications(job.id);

  const handleDelete = async () => {
    try {
      await deleteJob.mutateAsync(job.id);
      toast.success('Job posting deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job posting');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
            <CardDescription className="space-y-1">
              <div className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.company}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </div>
            </CardDescription>
          </div>
          <Badge variant={job.isActive ? 'default' : 'secondary'}>
            {job.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="font-medium">{applications.length} Applications</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{job.employmentType}</Badge>
          <Badge variant="outline">{job.experienceLevel}</Badge>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate({ to: `/employer/jobs/${job.id}/applications` })}
          >
            View Applications
          </Button>
          {onEdit && (
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Job Posting?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the job as inactive. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
