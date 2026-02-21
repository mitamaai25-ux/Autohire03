import { useState, useEffect } from 'react';
import { useCreateJobPosting, useUpdateJobPosting } from '../hooks/useJobPostings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { JobPosting } from '../backend';

interface JobPostingFormProps {
  job?: JobPosting | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function JobPostingForm({ job, onSuccess, onCancel }: JobPostingFormProps) {
  const createJob = useCreateJobPosting();
  const updateJob = useUpdateJobPosting();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    employmentType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    skillsRequired: '',
    experienceLevel: 'entry',
    educationLevel: 'bachelor',
    benefits: '',
    applicationDeadline: '',
  });

  useEffect(() => {
    if (job) {
      const deadline = new Date(Number(job.applicationDeadline) / 1000000);
      setFormData({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        employmentType: job.employmentType,
        salaryMin: job.salaryRange.min.toString(),
        salaryMax: job.salaryRange.max.toString(),
        skillsRequired: job.skillsRequired.join(', '),
        experienceLevel: job.experienceLevel,
        educationLevel: job.educationLevel,
        benefits: job.benefits.join(', '),
        applicationDeadline: deadline.toISOString().split('T')[0],
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const deadline = new Date(formData.applicationDeadline).getTime() * 1000000;

    const jobData = {
      title: formData.title,
      description: formData.description,
      company: formData.company,
      location: formData.location,
      employmentType: formData.employmentType,
      salaryRange: {
        min: BigInt(formData.salaryMin || 0),
        max: BigInt(formData.salaryMax || 0),
      },
      skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel: formData.experienceLevel,
      educationLevel: formData.educationLevel,
      benefits: formData.benefits.split(',').map(s => s.trim()).filter(Boolean),
      isActive: true,
      applicationDeadline: BigInt(deadline),
    };

    try {
      if (job) {
        await updateJob.mutateAsync({ jobId: job.id, ...jobData });
        toast.success('Job posting updated successfully!');
      } else {
        await createJob.mutateAsync(jobData);
        toast.success('Job posting created successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job posting');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Senior Software Engineer"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company *</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Company name"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. San Francisco, CA"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select value={formData.employmentType} onValueChange={(value) => setFormData({ ...formData, employmentType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={6}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Minimum Salary</Label>
          <Input
            id="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
            placeholder="50000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryMax">Maximum Salary</Label>
          <Input
            id="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
            placeholder="100000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skillsRequired">Required Skills (comma-separated)</Label>
        <Input
          id="skillsRequired"
          value={formData.skillsRequired}
          onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
          placeholder="e.g. JavaScript, React, Node.js"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationLevel">Education Level</Label>
          <Select value={formData.educationLevel} onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="associate">Associate Degree</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="benefits">Benefits (comma-separated)</Label>
        <Input
          id="benefits"
          value={formData.benefits}
          onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          placeholder="e.g. Health Insurance, 401k, Remote Work"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="applicationDeadline">Application Deadline</Label>
        <Input
          id="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={createJob.isPending || updateJob.isPending}>
          {createJob.isPending || updateJob.isPending ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
