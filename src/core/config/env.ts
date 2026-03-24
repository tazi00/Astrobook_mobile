// src/core/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
  EXPO_PUBLIC_AGORA_APP_ID: z.string().min(1),
});

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_RAZORPAY_KEY_ID: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
  EXPO_PUBLIC_AGORA_APP_ID: process.env.EXPO_PUBLIC_AGORA_APP_ID,
});

if (!parsed.success) {
  console.error('❌ Invalid env variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = {
  API_URL: parsed.data.EXPO_PUBLIC_API_URL,
  RAZORPAY_KEY_ID: parsed.data.EXPO_PUBLIC_RAZORPAY_KEY_ID,
  AGORA_APP_ID: parsed.data.EXPO_PUBLIC_AGORA_APP_ID,
};
