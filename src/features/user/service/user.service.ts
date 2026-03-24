import { apiClient } from '@/src/core/api/apiClient';

export interface OnboardingPayload {
  name: string;
  dateOfBirth?: string;
  interests?: string[];
}

export interface UserProfile {
  id: string;
  firebaseUid: string;
  phone: string | null;
  email: string | null;
  name: string;
  role: 'user' | 'astrologer' | 'admin';
  isOnboarded: boolean;
}

export const userService = {
  onboard: (payload: OnboardingPayload) =>
    apiClient.post<UserProfile>('/users/onboarding', payload),

  getMe: () => apiClient.get<UserProfile>('/users/me'),

  updateMe: (data: Partial<OnboardingPayload>) => apiClient.patch<UserProfile>('/users/me', data),
};
