import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  firebaseUid: string;
  phone?: string | null;
  email?: string | null;
  name: string;
  role: 'user' | 'astrologer' | 'admin';
  isOnboarded: boolean;
  dob?: string;
  interests?: string[];
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (data: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken: string) => void; // ← naya
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (user: User, accessToken: string, refreshToken: string) =>
        set({ isLoggedIn: true, user, accessToken, refreshToken }),

      updateUser: (data: Partial<User>) => set({ user: { ...get().user!, ...data } }),

      setTokens: (accessToken: string, refreshToken: string) => set({ accessToken, refreshToken }),

      logout: () => set({ isLoggedIn: false, user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'astrobook-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
