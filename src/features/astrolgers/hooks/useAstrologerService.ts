import { useQuery } from '@tanstack/react-query';
import { astrologerService } from '../service/astrologer.service';

export function useAstrologerServices(astrologerId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['astrologer-services', astrologerId],
    queryFn: () => astrologerService.getServices(astrologerId),
    enabled: !!astrologerId,
  });

  return {
    services: data?.services ?? [],
    isLoading,
    error,
  };
}
