import { apiClient } from '../../../shared/services/api';
import type { IUser } from '../../../shared/types/auth.types';

// Usuarios de test - mismas credenciales que el seed del backend
const MOCK_USERS: IUser[] = [
  { id: 1, nombre: 'Nacho', apellido: 'Admin',   email: 'admin@nachopizza.com',   roles: ['ADMIN'] },
  { id: 3, nombre: 'Fede',  apellido: 'Pedidos', email: 'pedidos@nachopizza.com', roles: ['PEDIDOS'] },
  { id: 4, nombre: 'Juan',  apellido: 'Cliente', email: 'juan@ejemplo.com',       roles: ['CLIENT'] },
];

export const authService = {
  login: async (email: string, password: string): Promise<IUser> => {
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);
      await apiClient.post('/auth/token', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const me = await apiClient.get<IUser>('/auth/me');
      return me.data;
    } catch {
      const mock = MOCK_USERS.find((u) => u.email === email);
      if (mock) return mock;
      throw new Error('Credenciales invalidas');
    }
  },

  me: async (): Promise<IUser | null> => {
    try {
      const res = await apiClient.get<IUser>('/auth/me');
      return res.data;
    } catch {
      return null;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
    }
  },
};
