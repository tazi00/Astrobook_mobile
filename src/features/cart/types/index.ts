// src/features/cart/types/cart.types.ts

export type CartItemCategory = 'consultation' | 'course' | 'product';

export type CartItemStatus = 'pending' | 'slot_unavailable';

export interface CartItem {
  cartItemId: string;
  category: CartItemCategory;
  status: CartItemStatus;

  // Appointment info
  astroId: string;
  serviceId: string;
  appointmentId?: string; // milega initiate ke baad

  // Display
  astroName: string;
  astroEmoji: string;
  serviceName: string;
  shortDescription: string;
  durationMinutes: number;
  price: number;

  // Selected slot
  selectedDate: string; // "2026-03-13"
  selectedTime: string; // "11:00 AM"
  scheduledAt: string; // ISO datetime — backend ke liye
}

export interface AppointmentService {
  id: string;
  serviceCode: number;
  title: string;
  shortDescription: string;
  coverImage: string;
  durationMinutes: number;
  price: string;
}

export interface Appointment {
  id: string;
  scheduledAt: string;
  endsAt: string;
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  bundleStatus: 'in_progress' | 'paused' | 'completed' | null;
  parentId: string | null;
  agoraChannel: string | null;
  agoraToken: string | null;
  notes: string | null;
  createdAt: string;
  service: AppointmentService;
  astrologerName: string;
  astrologerId: string;
  userId: string;
}

export interface MyAppointmentsResponse {
  upcoming: Appointment[];
  ongoing: Appointment[];
  completed: Appointment[];
  cancelled: Appointment[];
}

export interface InitiateBookingDto {
  astrologerId: string;
  serviceId: string;
  scheduledAt: string; // ISO datetime e.g. "2026-03-13T11:00:00.000Z"
  notes?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  appointmentId: string;
}

export interface VerifyPaymentDto {
  appointmentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
