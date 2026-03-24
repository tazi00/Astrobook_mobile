// src/features/cart/store/useCartStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import uuid from 'react-native-uuid';

import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartItemCategory, CartState } from '../types/index';

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      activeCategory: 'consultation',

      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              cartItemId: uuid.v4() as string,
              status: 'pending',
            },
          ],
        })),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      markSlotUnavailable: (cartItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, status: 'slot_unavailable' } : i,
          ),
        })),

      updateSlot: (cartItemId, selectedDate, selectedTime) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId
              ? { ...i, selectedDate, selectedTime, status: 'pending' }
              : i,
          ),
        })),

      setAppointmentId: (cartItemId, appointmentId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, appointmentId } : i,
          ),
        })),

      setActiveCategory: (category: CartItemCategory) => set({ activeCategory: category }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'astrobook-cart',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
