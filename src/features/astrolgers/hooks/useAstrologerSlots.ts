// src/features/astrologers/hooks/useAstrologerSlots.ts
import { useQuery } from '@tanstack/react-query';
import { astrologerService } from '../service/astrologer.service';

export function useAstrologerSlots(astrologerId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['astrologer-slots', astrologerId],
    queryFn: () => astrologerService.getSlots(astrologerId),
    enabled: !!astrologerId,
  });

  return {
    slots: data?.slots ?? [],
    isLoading,
    error,
  };
}
