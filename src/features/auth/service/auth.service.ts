import { apiClient } from '@/src/core/api/apiClient';

// ── Types ──────────────────────────────────────────────────
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firebaseUid: string;
    phone: string | null;
    email: string | null;
    name: string;
    role: 'user' | 'astrologer' | 'admin';
    isOnboarded: boolean;
  };
}

// ── Service ────────────────────────────────────────────────
export const authService = {
  // Firebase idToken → backend login → tokens + user
  login: (idToken: string) =>
    apiClient.post<LoginResponse>(
      '/auth/login',
      {
        idToken,
        deviceInfo: { platform: 'android' },
      },
      { auth: false },
    ), // no token needed for login

  // Get current user profile
  getMe: () => apiClient.get<LoginResponse['user']>('/auth/me'),

  // Logout current device
  logout: (refreshToken: string) => apiClient.post('/auth/logout', { refreshToken }),

  // Logout all devices
  logoutAll: () => apiClient.post('/auth/logout-all'),

  // Refresh access token
  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }, { auth: false }),
};
