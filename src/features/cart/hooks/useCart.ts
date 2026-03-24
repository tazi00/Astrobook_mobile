// src/features/cart/hooks/useCart.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../service/cart.service';

// ─── Get my appointments (grouped) ───────────────────────────────────────────

export function useMyAppointments() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => cartService.getMyAppointments(),
  });

  return {
    upcoming: data?.upcoming ?? [], // confirmed — time nahi aaya
    ongoing: data?.ongoing ?? [], // session chal raha hai
    completed: data?.completed ?? [], // khatam
    cancelled: data?.cancelled ?? [], // cancel hua
    pending: data?.upcoming?.filter((a) => a.status === 'pending') ?? [], // cart items
    isLoading,
    error,
    refetch,
  };
}

export function useInitiateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.initiateBooking,
    onSuccess: () => {
      // Cart refresh karo
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
  });
}


// ─── Cancel appointment (remove from cart) ───────────────────────────────────
 
export function useCancelAppointment() {
  const queryClient = useQueryClient()
 
  return useMutation({
    mutationFn: (id: string) => cartService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
  })
}
 
// ─── Create Razorpay order ────────────────────────────────────────────────────
 
export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (appointmentId: string) => cartService.createPaymentOrder(appointmentId),
  })
}
 
// ─── Verify payment ───────────────────────────────────────────────────────────
 
export function useVerifyPayment() {
  const queryClient = useQueryClient()
 
  return useMutation({
    mutationFn: cartService.verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
  })
}
 