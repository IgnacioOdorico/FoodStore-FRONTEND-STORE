import { apiFetch } from '../../../shared/services/api';
import type { CreateOrderPayload } from '../types/order';

export const ordersService = {
  // Cliente ve solo sus propios pedidos (backend filtra por JWT)
  getAll: () => apiFetch('/pedidos/'),

  getById: (id: number) => apiFetch(`/pedidos/${id}`),

  // Crea un pedido desde el carrito
  create: (payload: CreateOrderPayload) =>
    apiFetch('/pedidos/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // El cliente puede cancelar solo desde PENDIENTE o CONFIRMADO
  cancel: (id: number) =>
    apiFetch(`/pedidos/${id}/cancelar`, { method: 'PATCH' }),
};
