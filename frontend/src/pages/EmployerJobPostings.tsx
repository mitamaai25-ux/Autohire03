import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useGetJobPostings } from '../hooks/useJobPostings';
import AuthGuard from '../components/AuthGuard';
import JobPostingForm from '../components/JobPostingForm';
import EmployerJobPostingCard from '../components/EmployerJobPostingCard';
import EmptyState from '../components/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EmployerJobPostings() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: jobPostings = [], isLoading } = useGetJobPostings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const myJobs = jobPostings.filter(job => 
    job.employerId.toString() === identity?.getPrincipal().toString()
  );

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  return (
    <AuthGuard requireRole="employer" userRole={userProfile?.role}>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
            <p className="text-muted-foreground">
              Create and manage your job listings
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job Posting
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : myJobs.length === 0 ? (
          <EmptyState
            title="No job postings yet"
            description="Create your first job posting to start receiving applications from qualified candidates"
            action={
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job Posting
              </Button>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myJobs.map(job => (
              <EmployerJobPostingCard 
                key={job.id} 
                job={job} 
                onEdit={() => handleEdit(job)}
              />
            ))}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? 'Edit Job Posting' : 'Create Job Posting'}
              </DialogTitle>
            </DialogHeader>
            <JobPostingForm 
              job={editingJob} 
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
