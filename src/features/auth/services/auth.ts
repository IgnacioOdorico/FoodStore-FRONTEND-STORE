import { apiClient } from '../../../shared/services/api';
import type { IUser } from '../../../shared/types/auth.types';

// Usuarios de test sin backend
const MOCK_USERS: IUser[] = [
  { id: 1, nombre: 'Admin',   email: 'admin@app.com',  roles: ['ADMIN'] },
  { id: 2, nombre: 'Cajero',  email: 'cajero@app.com', roles: ['PEDIDOS'] },
  { id: 3, nombre: 'Cliente', email: 'client@app.com', roles: ['CLIENT'] },
];

export const authService = {
  login: async (email: string, password: string): Promise<IUser> => {
    try {
      await apiClient.post('/auth/login', { email, password });
      const me = await apiClient.get<IUser>('/auth/me');
      return me.data;
    } catch {
      // Fallback de mock sin backend
      const mock = MOCK_USERS.find((u) => u.email === email);
      if (mock) return mock;
      throw new Error('Credenciales inválidas');
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
      // si el backend no responde, limpiamos igual en el cliente
    }
  },
};
