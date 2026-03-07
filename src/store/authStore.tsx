// Next.js mein Context API ya Redux use karte the
// React Native mein Zustand best hai — bohot simple hai

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// TypeScript type define karo
interface User {
  phone?: string;
  name?: string;
  email?: string;
  dob?: string;
  interests?: string[];
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// create() — Zustand store banana
export const useAuthStore = create<AuthState>()(
  // persist: State ko AsyncStorage mein save karo
  // Iska matlab: App restart hone pe bhi user logged in rahega
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      login: (user: User) => set({ isLoggedIn: true, user }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: 'auth-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// Use karo kisi bhi screen mein:
// const { isLoggedIn, login, logout } = useAuthStore();
