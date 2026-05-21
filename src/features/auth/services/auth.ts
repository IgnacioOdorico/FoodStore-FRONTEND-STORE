import { api } from '../../../shared/services/api';

export interface LoginResponse {
  mensaje: string;
  user_email: string;
}

export interface UserPublic {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  roles: string[];
  created_at: string;
}

/**
 * Servicio de autenticación.
 *
 * El login usa application/x-www-form-urlencoded porque el backend de FastAPI
 * implementa el flujo OAuth2 Password (form data). Pasamos URLSearchParams
 * directamente a axios — él detecta el tipo y setea el Content-Type correcto.
 *
 * El resto de las rutas usan la instancia de axios con JSON por defecto.
 */
export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    return api
      .post('/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then(r => r.data);
  },

  logout: (): Promise<{ mensaje: string }> =>
    api.post('/auth/logout').then(r => r.data),

  me: (): Promise<UserPublic> =>
    api.get('/auth/me').then(r => r.data),
};
