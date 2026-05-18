import { create } from "zustand";
import type { IRole, IUser } from "../shared/types/auth.types";
import { authService } from "../features/auth/services/auth";

interface AuthState {
  user: IUser | null;
  login: (email: string) => Promise<IUser | null>;
  logout: VoidFunction;
  hasRole: (...roles: IRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  login: async (email) => {
    try {
      const user = await authService.login(email);
      set({ user });
      return user;
    } catch {
      return null;
    }
  },
  logout: () => {
    set({ user: null });
  },
  hasRole: (...roles) => {
    const { user } = get();
    const found = user !== null && roles.includes(user.role);
    return found;
  },
}));
