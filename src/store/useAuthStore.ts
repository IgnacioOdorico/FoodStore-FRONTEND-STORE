import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IRole, IUser, RegisterData } from '../shared/types/auth.types';
import { authService } from '../features/auth/services/auth';

interface AuthState {
  user: IUser | null;
  isCheckingAuth: boolean;
  login: (email: string, password: string) => Promise<IUser | null>;
  register: (data: RegisterData) => Promise<IUser | null>;
  logout: () => Promise<void>;
  hasRole: (...roles: IRole[]) => boolean;
  checkAuth: () => Promise<void>;
  updateUser: (data: { nombre?: string; apellido?: string; celular?: string }) => Promise<IUser>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
        const user = await authService.register(data);
        set({ user });
        return user;
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
          try {
            const { attemptRefresh } = await import('../shared/services/api');
            const refreshed = await attemptRefresh();
            if (refreshed) {
              const user = await authService.me();
              set({ user, isCheckingAuth: false });
              return;
            }
          } catch {
            /* fallback a logout */
          }
          set({ user: null, isCheckingAuth: false });
        }
      },

      updateUser: async (data) => {
        const updated = await authService.updateMe(data);
        set({ user: updated });
        return updated;
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

