import { useQuery } from '@tanstack/react-query';
import { astrologerService } from '../service/astrologer.service';

export function useAstrologer(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['astrologer', id],
    queryFn: () => astrologerService.getById(id),
    enabled: !!id,
  });

  return {
    astrologer: data?.astrologer ?? null,
    isLoading,
    error,
  };
}
