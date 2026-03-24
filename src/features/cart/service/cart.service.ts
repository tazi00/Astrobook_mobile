import { apiClient } from '@/src/core/api/apiClient';
import {
  Appointment,
  CreateOrderResponse,
  InitiateBookingDto,
  MyAppointmentsResponse,
  VerifyPaymentDto,
} from '../types';

export const cartService = {
  // Step 1: Pending appointment banao (cart mein add)
  initiateBooking: (dto: InitiateBookingDto) =>
    apiClient.post<{ message: string; appointment: Appointment }>(
      '/consultation/appointments/initiate',
      dto,
    ),

  // Get all my appointments grouped
  getMyAppointments: () => apiClient.get<MyAppointmentsResponse>('/consultation/appointments/mine'),

  // Single appointment detail
  getAppointmentById: (id: string) =>
    apiClient.get<{ appointment: Appointment }>(`/consultation/appointments/${id}`),

  // Cancel appointment
  cancelAppointment: (id: string) =>
    apiClient.patch<void>(`/consultation/appointments/${id}/cancel`, {}),

  // Step 2: Razorpay order banao
  createPaymentOrder: (appointmentId: string) =>
    apiClient.post<CreateOrderResponse>('/payments/create-order', { appointmentId }),

  // Step 3: Payment verify karo → confirmed + Agora token
  verifyPayment: (dto: VerifyPaymentDto) =>
    apiClient.post<{ message: string; appointment: Appointment }>('/payments/verify', dto),
};
