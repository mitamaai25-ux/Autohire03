import { useState } from 'react';
import { useGetJobPostings } from '../hooks/useJobPostings';
import CandidateSearch from '../components/CandidateSearch';
import FreelanceJobCard from '../components/FreelanceJobCard';
import EmptyState from '../components/EmptyState';
import { DollarSign } from 'lucide-react';

export default function FreelanceMarketplace() {
  const { data: jobPostings = [], isLoading } = useGetJobPostings();
  const [searchTerm, setSearchTerm] = useState('');

  const freelanceJobs = jobPostings.filter(job => 
    job.isActive && (job.employmentType === 'freelance' || job.employmentType === 'contract')
  );

  const filteredJobs = freelanceJobs.filter(job => {
    return searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Freelance Marketplace</h1>
        </div>
        <p className="text-muted-foreground">
          Discover {freelanceJobs.length} freelance and contract opportunities
        </p>
      </div>

      <CandidateSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        hideTypeFilter
      />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading opportunities...</div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No freelance opportunities found"
          description="Check back later for new freelance and contract positions"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <FreelanceJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
