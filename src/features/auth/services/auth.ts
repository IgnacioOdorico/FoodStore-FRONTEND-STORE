import { apiClient } from '../../../shared/services/api';
import type { IUser } from '../../../shared/types/auth.types';

export const authService = {
  login: async (email: string, password: string): Promise<IUser> => {
    try {
      // FastAPI OAuth2PasswordRequestForm expects Form Data with 'username' and 'password'
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      await apiClient.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const me = await apiClient.get<IUser>('/auth/me');
      return me.data;
    } catch (error) {
      console.error("Error en login real contra el backend:", error);
      throw new Error('Credenciales inválidas o error en el servidor');
    }
  },

  register: async (data: Record<string, any>): Promise<IUser> => {
    try {
      // Backend expects UserCreate schema at POST /auth/register
      const res = await apiClient.post<IUser>('/auth/register', data);
      return res.data;
    } catch (error: any) {
      console.error("Error en registro:", error);
      throw new Error(error.response?.data?.detail || 'Error al registrar usuario');
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


