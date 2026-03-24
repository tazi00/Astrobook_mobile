// src/features/cart/hooks/useMyBookings.ts
import { useQuery } from '@tanstack/react-query';
import { cartService } from '../service/cart.service';

export function useMyBookings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => cartService.getMyAppointments(),
  });

  return {
    upcoming: data?.upcoming?.filter((a) => a.status === 'confirmed') ?? [],
    ongoing: data?.ongoing ?? [],
    completed: data?.completed ?? [],
    cancelled: data?.cancelled ?? [],
    isLoading,
    error,
    refetch,
  };
}
