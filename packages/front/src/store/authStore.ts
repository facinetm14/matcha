import { create } from 'zustand'

type AuthState = {
  isLoggedIn: boolean;
  updateLoginStatus: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  updateLoginStatus: (status: boolean) => set(() => ({ isLoggedIn: status })),
}))

