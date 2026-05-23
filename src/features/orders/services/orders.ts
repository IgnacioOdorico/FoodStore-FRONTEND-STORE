import { apiFetch } from '../../../shared/services/api';
import type { CreateOrderPayload, Order } from '../types/order';

export const ordersService = {
  getAll: () => apiFetch<Order[]>('/pedidos/me'),

  getById: (id: number) => apiFetch<Order>(`/pedidos/${id}`),

  // Crea un pedido desde el carrito
  create: (payload: CreateOrderPayload) =>
    apiFetch('/pedidos/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // El cliente puede cancelar solo desde PENDIENTE o CONFIRMADO
  // El backend requiere body { motivo: string }
  cancel: (id: number, motivo = 'Cancelado por el cliente') =>
    apiFetch(`/pedidos/${id}/cancelar`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    }),
};
