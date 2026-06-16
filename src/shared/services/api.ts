import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (reason?: unknown) => void }> = [];

function processQueue(error: unknown): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url || '';

    const isSessionEndpoint =
      url.includes('/auth/token') ||
      url.includes('/auth/me') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout') ||
      url.includes('/auth/register');

    const path = window.location.pathname;
    const onAuthPage = path.startsWith('/login') || path.startsWith('/register');

    if (status === 401 && !isSessionEndpoint && !onAuthPage) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await apiClient.post('/auth/refresh', {}, { withCredentials: true });
          processQueue(null);
          return apiClient(error.config);
        } catch (refreshError) {
          processQueue(refreshError);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(error.config);
        });
      }
    }

    if (status === 403 && !path.startsWith('/forbidden')) {
      window.location.href = '/forbidden';
    }

    return Promise.reject(error);
  },
);

export async function attemptRefresh(): Promise<boolean> {
  try {
    await apiClient.post('/auth/refresh', {}, { withCredentials: true });
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const response = await apiClient.request<T>({
    url: endpoint,
    method: (options.method ?? 'GET') as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    data: options.body ? JSON.parse(options.body) : undefined,
    headers: options.headers,
  });

  return response.data;
}
