// src/features/cart/hooks/usePayNow.ts
import { env } from '@/src/core/config/env';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { cartService } from '../service/cart.service';
import { Appointment } from '../types';

const RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID;

interface UsePayNowResult {
  payNow: (appointments: Appointment[]) => Promise<void>;
  isPaying: boolean;
}

export function usePayNow(onSuccess?: (appointments: Appointment[]) => void): UsePayNowResult {
  const [isPaying, setIsPaying] = useState(false);
  const queryClient = useQueryClient();

  const payNow = async (appointments: Appointment[]) => {
    if (appointments.length === 0) return;
    setIsPaying(true);

    try {
      // Saare selected appointments ke liye ek ek order banao aur pay karo
      const confirmed: Appointment[] = [];

      for (const appointment of appointments) {
        try {
          // Step 1: Create Razorpay order
          const order = await cartService.createPaymentOrder(appointment.id);

          // Step 2: Razorpay checkout open karo
          const paymentData = await RazorpayCheckout.open({
            description: appointment.service.title,
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: String(order.amount * 100), // paise mein
            order_id: order.orderId,
            name: 'Astrobook',
            prefill: {
              contact: '',
              email: '',
            },
            theme: { color: '#9d0399' },
          });

          // Step 3: Verify payment
          const result = await cartService.verifyPayment({
            appointmentId: appointment.id,
            razorpayOrderId: order.orderId,
            razorpayPaymentId: paymentData.razorpay_payment_id,
            razorpaySignature: paymentData.razorpay_signature,
          });

          confirmed.push(result.appointment);
        } catch (err: any) {
          // User ne payment cancel kiya
          if (err?.code === 0) {
            Alert.alert('Payment Cancelled', 'You cancelled the payment.');
            break;
          }
          // Koi aur error
          Alert.alert('Payment Failed', err?.message ?? 'Something went wrong.');
          break;
        }
      }

      if (confirmed.length > 0) {
        // Cart refresh karo
        queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
        onSuccess?.(confirmed);
      }
    } finally {
      setIsPaying(false);
    }
  };

  return { payNow, isPaying };
}
