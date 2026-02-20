import { useState } from 'react';
import { useApplyToJob } from '../hooks/useApplications';
import { useGetCallerCandidateProfile } from '../hooks/useCandidateProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { JobId } from '../backend';

interface ApplicationFormProps {
  jobId: JobId;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ApplicationForm({ jobId, onSuccess, onCancel }: ApplicationFormProps) {
  const applyToJob = useApplyToJob();
  const { data: candidateProfile } = useGetCallerCandidateProfile();
  
  const [formData, setFormData] = useState({
    expectedSalary: '',
    coverLetter: '',
    resumeUrl: '',
  });

  const hasProfile = !!candidateProfile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasProfile) {
      toast.error('Please create your candidate profile first');
      return;
    }

    try {
      await applyToJob.mutateAsync({
        jobId,
        expectedSalary: formData.expectedSalary ? BigInt(formData.expectedSalary) : null,
        coverLetter: formData.coverLetter || null,
        resume: formData.resumeUrl || null,
      });
      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error applying to job:', error);
      if (error.message?.includes('already applied')) {
        toast.error('You have already applied to this job');
      } else {
        toast.error('Failed to submit application');
      }
    }
  };

  if (!hasProfile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to create your candidate profile before applying to jobs.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="expectedSalary">Expected Salary (optional)</Label>
        <Input
          id="expectedSalary"
          type="number"
          value={formData.expectedSalary}
          onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
          placeholder="e.g. 75000"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
          placeholder="Tell the employer why you're a great fit for this role..."
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumeUrl">Resume URL (optional)</Label>
        <Input
          id="resumeUrl"
          type="url"
          value={formData.resumeUrl}
          onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
          placeholder="https://example.com/resume.pdf"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={applyToJob.isPending}>
          {applyToJob.isPending ? 'Submitting...' : 'Submit Application'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
