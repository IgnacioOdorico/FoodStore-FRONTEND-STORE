import { apiClient } from '../../../shared/services/api';
import type { Producto } from '../types/producto';

export const productsService = {
  getAll: (): Promise<Producto[]> =>
    apiClient.get<{ items: Producto[] }>('/productos/').then(r => r.data.items || []),

  getById: (id: number): Promise<Producto> =>
    apiClient.get(`/productos/${id}`).then(r => r.data),
};
