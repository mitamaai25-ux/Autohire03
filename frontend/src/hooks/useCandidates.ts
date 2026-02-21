import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CandidateProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useFilterCandidates(skills: string[], minExperience: number) {
  const { actor, isFetching } = useActor();

  return useQuery<CandidateProfile[]>({
    queryKey: ['candidates', skills, minExperience],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterCandidates(skills, BigInt(minExperience));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCandidateProfile(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CandidateProfile | null>({
    queryKey: ['candidateProfile', userId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCandidateProfile(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}
