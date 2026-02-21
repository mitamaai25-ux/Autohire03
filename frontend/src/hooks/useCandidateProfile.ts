import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CandidateProfile, ExperienceEntry, EducationEntry, Certification, Availability, JobType } from '../backend';

export function useGetCallerCandidateProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<CandidateProfile | null>({
    queryKey: ['callerCandidateProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerCandidateProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCandidateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      headline: string;
      summary: string;
      skills: string[];
      experience: ExperienceEntry[];
      education: EducationEntry[];
      portfolioLinks: string[];
      hourlyRate: bigint | null;
      availability: Availability;
      location: string;
      resumeUrl: string | null;
      certifications: Certification[];
      preferredJobTypes: JobType[];
      references: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCandidateProfile(
        data.firstName,
        data.lastName,
        data.email,
        data.headline,
        data.summary,
        data.skills,
        data.experience,
        data.education,
        data.portfolioLinks,
        data.hourlyRate,
        data.availability,
        data.location,
        data.resumeUrl,
        data.certifications,
        data.preferredJobTypes,
        data.references
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerCandidateProfile'] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}
