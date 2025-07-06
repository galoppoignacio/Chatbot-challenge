// src/store/authStore.ts
import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logOut: () => Promise<void>;    // ← Ya no es opcional
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logOut: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));
