import { apiClient } from '../../../shared/services/api';
import type { Producto } from '../types/producto';

interface PaginatedResponse {
  items: Producto[];
  total: number;
}

export const productsService = {
  getAll: (params?: { page?: number; size?: number; categoria_id?: number }): Promise<PaginatedResponse> =>
    apiClient
      .get<PaginatedResponse>('/productos/', { params })
      .then((r) => r.data),

  getById: (id: number): Promise<Producto> =>
    apiClient.get(`/productos/${id}`).then((r) => r.data),
};
