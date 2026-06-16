import { apiClient } from '../../../shared/services/api';
import { isAxiosError } from 'axios';
import type { IUser, RegisterData } from '../../../shared/types/auth.types';

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

  register: async (data: RegisterData): Promise<IUser> => {
    try {
      // Backend expects UserCreate schema at POST /auth/register
      const res = await apiClient.post<IUser>('/auth/register', data);
      return res.data;
    } catch (error: unknown) {
      console.error("Error en registro:", error);
      if (isAxiosError(error) && error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Error al registrar usuario');
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

  updateMe: async (data: { nombre?: string; apellido?: string; celular?: string }): Promise<IUser> => {
    const res = await apiClient.patch<IUser>('/auth/me', data);
    return res.data;
  },

  changePassword: async (password_actual: string, password_nuevo: string): Promise<void> => {
    await apiClient.patch('/auth/me/password', { password_actual, password_nuevo });
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
    }
  },
};


