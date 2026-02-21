import { useGetJobPostings } from '../hooks/useJobPostings';
import { useGetCallerCandidateProfile } from '../hooks/useCandidateProfile';
import JobCard from './JobCard';
import EmptyState from './EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function JobRecommendations() {
  const { data: jobPostings = [], isLoading } = useGetJobPostings();
  const { data: candidateProfile } = useGetCallerCandidateProfile();

  if (!candidateProfile) {
    return null;
  }

  // Filter jobs based on candidate's skills and preferred job types
  const recommendedJobs = jobPostings.filter(job => {
    if (!job.isActive) return false;

    // Check if job type matches candidate preferences
    const jobTypeMatches = candidateProfile.preferredJobTypes.some(
      prefType => job.employmentType === prefType.toString()
    );

    // Check if any of the candidate's skills match the job requirements
    const skillsMatch = candidateProfile.skills.some(skill =>
      job.skillsRequired.some(reqSkill => 
        reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(reqSkill.toLowerCase())
      )
    );

    return jobTypeMatches || skillsMatch;
  }).slice(0, 6); // Limit to 6 recommendations

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Recommended for You</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading recommendations...</div>
      ) : recommendedJobs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No recommendations yet</CardTitle>
            <CardDescription>
              We'll show personalized job recommendations based on your skills and preferences
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
