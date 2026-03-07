import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  phone?: string;
  name?: string;
  dob?: string;
  interests?: string[];
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,

      login: (user: User) =>
        set({ isLoggedIn: true, user }),

      updateUser: (data: Partial<User>) =>
        set({ user: { ...get().user, ...data } }),

      logout: () =>
        set({ isLoggedIn: false, user: null }),
    }),
    {
      name: 'astrobook-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
