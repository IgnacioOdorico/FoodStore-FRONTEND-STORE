import { apiClient } from '../../../shared/services/api';
import type { Producto } from '../types/producto';

/**
 * Servicio de productos.
 * Usa la instancia de axios centralizada — no hay lógica de fetch manual acá.
 *
 * useQuery (TanStack) ejemplo:
 *   const { data } = useQuery({ queryKey: ['products'], queryFn: productsService.getAll })
 *   const { data } = useQuery({ queryKey: ['product', id], queryFn: () => productsService.getById(id) })
 */
export const productsService = {
  getAll: (): Promise<Producto[]> =>
    apiClient.get('/productos/').then(r => r.data),

  getById: (id: number): Promise<Producto> =>
    apiClient.get(`/productos/${id}`).then(r => r.data),
};
