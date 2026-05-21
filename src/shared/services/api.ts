import axios from 'axios';

/**
 * Instancia de axios configurada para el backend de FoodStore.
 *
 * - baseURL apunta a VITE_API_URL (o localhost:8000 por defecto) + /api/v1
 * - withCredentials: true para enviar la cookie de sesión automáticamente
 * - Content-Type: application/json por defecto
 *
 * Interceptor de response:
 *   Normaliza todos los errores del servidor en un único Error estándar,
 *   extrayendo el campo `detail` de FastAPI cuando está disponible.
 */
export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? 'http://localhost:8000') + '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ??
      error.message ??
      'Error en la petición';
    return Promise.reject(new Error(message));
  }
);
