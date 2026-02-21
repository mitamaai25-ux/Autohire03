import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { JobPosting, JobId, Time } from '../backend';

export function useGetJobPostings() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['jobPostings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobPostings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      company: string;
      location: string;
      employmentType: string;
      salaryRange: { min: bigint; max: bigint };
      skillsRequired: string[];
      experienceLevel: string;
      educationLevel: string;
      benefits: string[];
      isActive: boolean;
      applicationDeadline: Time;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJobPosting(
        data.title,
        data.description,
        data.company,
        data.location,
        data.employmentType,
        data.salaryRange,
        data.skillsRequired,
        data.experienceLevel,
        data.educationLevel,
        data.benefits,
        data.isActive,
        data.applicationDeadline
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });
}

export function useUpdateJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jobId: JobId;
      title: string;
      description: string;
      company: string;
      location: string;
      employmentType: string;
      salaryRange: { min: bigint; max: bigint };
      skillsRequired: string[];
      experienceLevel: string;
      educationLevel: string;
      benefits: string[];
      isActive: boolean;
      applicationDeadline: Time;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobPosting(
        data.jobId,
        data.title,
        data.description,
        data.company,
        data.location,
        data.employmentType,
        data.salaryRange,
        data.skillsRequired,
        data.experienceLevel,
        data.educationLevel,
        data.benefits,
        data.isActive,
        data.applicationDeadline
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });
}

export function useDeleteJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: JobId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobPosting(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });
}
