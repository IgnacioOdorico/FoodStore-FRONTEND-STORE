import { create } from 'zustand';
import type { IRole, IUser } from '../shared/types/auth.types';
import { authService } from '../features/auth/services/auth';

interface AuthState {
  user: IUser | null;
  login: (email: string, password: string) => Promise<IUser | null>;
  logout: () => Promise<void>;
  hasRole: (...roles: IRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  login: async (email, password) => {
    try {
      const user = await authService.login(email, password);
      set({ user });
      return user;
    } catch {
      return null;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  // Verifica si el usuario tiene al menos uno de los roles indicados
  hasRole: (...roles) => {
    const { user } = get();
    if (!user) return false;
    return roles.some((r) => user.roles.includes(r));
  },
}));
