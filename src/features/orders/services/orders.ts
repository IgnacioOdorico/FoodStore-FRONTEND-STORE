import { apiFetch } from '../../../shared/services/api';

export const ordersService = {
  getAll: () => apiFetch('/pedidos/'),
  getById: (id: number) => apiFetch(`/pedidos/${id}`),
  create: (payload: any) => apiFetch('/pedidos/', { method: 'POST', body: JSON.stringify(payload) }),
};
