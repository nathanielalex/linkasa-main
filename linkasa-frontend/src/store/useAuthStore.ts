
import type { User } from "@/api/thread";
import { getMe, logoutUser } from "@/api/auth";
import { create } from "zustand";

interface AuthState {
  user?: User;
  loading: boolean;
  setUser: (user?: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  loading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    set({ loading: true });
    try {
      const user = await getMe();
      set({ user, loading: false });
    } catch {
      set({ user: undefined, loading: false });
    }
  },
  logout: async () => {
    set({ user: undefined });

    try {
      const message = await logoutUser();
      console.log("Logout successful:", message);
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    window.location.href = "/login";
  },
}));
