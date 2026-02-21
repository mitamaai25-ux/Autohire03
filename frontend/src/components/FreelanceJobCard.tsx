import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import type { JobPosting } from '../backend';
import ApplicationForm from './ApplicationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FreelanceJobCardProps {
  job: JobPosting;
}

export default function FreelanceJobCard({ job }: FreelanceJobCardProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const formatSalary = (min: bigint, max: bigint) => {
    if (min === BigInt(0) && max === BigInt(0)) return 'Negotiable';
    return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow border-primary/20 h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge className="bg-primary">{job.employmentType}</Badge>
          </div>
          <CardTitle className="text-xl">{job.title}</CardTitle>
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
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {job.description}
            </p>

            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary(job.salaryRange.min, job.salaryRange.max)}</span>
            </div>

            {job.skillsRequired.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skillsRequired.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.skillsRequired.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{job.experienceLevel} level</span>
            </div>
          </div>

          <Button onClick={() => setShowApplicationForm(true)} className="w-full">
            Apply for Project
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply to {job.title}</DialogTitle>
          </DialogHeader>
          <ApplicationForm 
            jobId={job.id} 
            onSuccess={() => setShowApplicationForm(false)}
            onCancel={() => setShowApplicationForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
