import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Application, JobId } from '../backend';
import { Principal } from '@dfinity/principal';

export function useApplyToJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jobId: JobId;
      expectedSalary: bigint | null;
      coverLetter: string | null;
      resume: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyToJob(data.jobId, data.expectedSalary, data.coverLetter, data.resume);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userApplications'] });
    },
  });
}

export function useGetJobApplications(jobId: JobId) {
  const { actor, isFetching } = useActor();

  return useQuery<Application[]>({
    queryKey: ['jobApplications', jobId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobApplications(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== undefined,
  });
}

export function useGetUserApplications(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Application[]>({
    queryKey: ['userApplications', userId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserApplications(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jobId: JobId;
      applicantId: string;
      newStatus: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatus(
        data.jobId,
        Principal.fromText(data.applicantId),
        data.newStatus
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications', variables.jobId] });
    },
  });
}
