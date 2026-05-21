import { api } from '../../../shared/services/api';
import type { Order, CreateOrderPayload } from '../types/order';

/**
 * Servicio de pedidos.
 *
 * Rutas del backend:
 *   GET  /pedidos/me          → lista los pedidos del usuario autenticado
 *   GET  /pedidos/{id}        → detalle de un pedido
 *   POST /pedidos/            → crear un nuevo pedido
 *
 * useMutation (TanStack) ejemplo para crear pedido:
 *   const { mutate } = useMutation({
 *     mutationFn: ordersService.create,
 *     onSuccess: () => { clear(); navigate('/orders'); },
 *   });
 *
 * useQuery ejemplo para listar:
 *   const { data } = useQuery({ queryKey: ['orders'], queryFn: ordersService.getAll });
 */
export const ordersService = {
  // ✅ Ruta correcta: /pedidos/me → mis pedidos (no /pedidos/ que es admin)
  getAll: (): Promise<Order[]> =>
    api.get('/pedidos/me').then(r => r.data),

  getById: (id: number): Promise<Order> =>
    api.get(`/pedidos/${id}`).then(r => r.data),

  create: (payload: CreateOrderPayload): Promise<Order> =>
    api.post('/pedidos/', payload).then(r => r.data),
};
