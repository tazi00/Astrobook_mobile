// src/features/astrologers/hooks/useAstrologers.ts
import { useQuery } from '@tanstack/react-query';
import { astrologerService } from '../service/astrologer.service';

export function useAstrologers() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['astrologers'],
    queryFn: () => astrologerService.getAll(),
  });

  return {
    astrologers: data?.astrologers ?? [],
    isLoading,
    error,
    refetch,
  };
}
