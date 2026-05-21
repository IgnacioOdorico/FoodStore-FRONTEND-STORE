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
    const status = error.response?.status;

    if (status === 401) {
      // Token expirado o no autenticado -> forzar login
      window.location.href = '/login';
    }

    if (status === 403) {
      // Autenticado pero sin permisos-> página de acceso denegado
      window.location.href = '/forbidden';
    }

    // Propaga el error para que cada servicio / useQuery lo maneje
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
