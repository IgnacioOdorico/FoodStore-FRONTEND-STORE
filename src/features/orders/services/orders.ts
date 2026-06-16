import { apiFetch } from '../../../shared/services/api';
import type { CreateOrderPayload, Order } from '../types/order';

export const ordersService = {
  getAll: () => apiFetch<Order[]>('/pedidos/me'),

  getById: (id: number) => apiFetch<Order>(`/pedidos/${id}`),

  create: (payload: CreateOrderPayload) =>
    apiFetch<Order>('/pedidos/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // El cliente puede cancelar solo desde PENDIENTE o CONFIRMADO
  cancel: (id: number, motivo = 'Cancelado por el cliente') =>
    apiFetch(`/pedidos/${id}/cancelar`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    }),
};
