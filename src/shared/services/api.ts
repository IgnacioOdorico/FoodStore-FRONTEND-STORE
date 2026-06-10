import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const httpStatus = error.response?.status;
    const url: string = error.config?.url || '';
    // Endpoints de sesión: el authStore maneja el 401 (set user=null) y la
    // redirección la hace React Router vía ProtectedRoute. NO redirigir acá
    // para estos, porque hacerlo con window.location.href provoca una recarga
    // que vuelve a pedir /auth/me → 401 → recarga… (loop infinito en /login).
    const isSessionEndpoint =
      url.includes('/auth/token') ||
      url.includes('/auth/me') ||
      url.includes('/auth/register') ||
      url.includes('/auth/logout');

    const path = window.location.pathname;
    const onAuthPage = path.startsWith('/login') || path.startsWith('/register');

    if (httpStatus === 401 && !isSessionEndpoint && !onAuthPage) {
      window.location.href = '/login';
    }

    if (httpStatus === 403 && !path.startsWith('/forbidden')) {
      window.location.href = '/forbidden';
    }

    return Promise.reject(error);
  },
);

// Helper de delay solo para demo en el video 
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DEMO_DELAY_MS = 1200; // en produccion cambiarlo a 0


export async function apiFetch<T = unknown>(
  endpoint: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  await delay(DEMO_DELAY_MS);

  const response = await apiClient.request<T>({
    url: endpoint,
    method: (options.method as any) ?? 'GET',
    data: options.body ? JSON.parse(options.body) : undefined,
    headers: options.headers,
  });

  return response.data;
}
