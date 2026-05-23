import { create } from 'zustand';
import type { IRole, IUser } from '../shared/types/auth.types';
import { authService } from '../features/auth/services/auth';

interface AuthState {
  user: IUser | null;
  isCheckingAuth: boolean;
  login: (email: string, password: string) => Promise<IUser | null>;
  register: (data: Record<string, any>) => Promise<IUser | null>;
  logout: () => Promise<void>;
  hasRole: (...roles: IRole[]) => boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isCheckingAuth: true,

  login: async (email, password) => {
    try {
      const user = await authService.login(email, password);
      set({ user });
      return user;
    } catch {
      return null;
    }
  },

  register: async (data) => {
    try {
      const user = await authService.register(data);
      set({ user });
      return user;
    } catch (e: any) {
      throw e;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  hasRole: (...roles) => {
    const { user } = get();
    if (!user) return false;
    return roles.some((r) => user.roles.includes(r));
  },

  checkAuth: async () => {
    try {
      const user = await authService.me();
      set({ user, isCheckingAuth: false });
    } catch {
      set({ user: null, isCheckingAuth: false });
    }
  },
}));
