import { useState } from 'react';
import { useGetJobPostings } from '../hooks/useJobPostings';
import CandidateSearch from '../components/CandidateSearch';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CandidateBrowse() {
  const { data: jobPostings = [], isLoading } = useGetJobPostings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const activeJobs = jobPostings.filter(job => job.isActive);

  const filteredJobs = activeJobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || job.employmentType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Browse Jobs</h1>
        <p className="text-muted-foreground">
          Find your next opportunity from {activeJobs.length} active positions
        </p>
      </div>

      <CandidateSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your search criteria or check back later for new opportunities"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
