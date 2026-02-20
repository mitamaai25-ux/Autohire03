import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface CandidateSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType?: string;
  onTypeChange?: (value: string) => void;
  hideTypeFilter?: boolean;
}

export default function CandidateSearch({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange,
  hideTypeFilter = false 
}: CandidateSearchProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, company, or keywords..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {!hideTypeFilter && onTypeChange && (
        <div className="flex gap-4">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Employment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
