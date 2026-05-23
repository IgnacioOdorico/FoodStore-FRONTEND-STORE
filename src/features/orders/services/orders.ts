import { apiFetch } from '../../../shared/services/api';
import type { CreateOrderPayload, Order } from '../types/order';

export const ordersService = {
  getAll: async () => {
    const data: any[] = await apiFetch('/pedidos/me');
    return data.map(pedido => ({
      ...pedido,
      estado: pedido.estado_codigo,
      forma_pago: pedido.forma_pago_codigo,
      items: pedido.detalles.map((d: any) => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_snapshot,
        nombre_snapshot: d.nombre_snapshot,
        producto: { nombre: d.nombre_snapshot }
      })),
      direccion_entrega_id: pedido.direccion_id,
    }));
  },

  getById: (id: number) => apiFetch<Order>(`/pedidos/${id}`),

  create: (payload: CreateOrderPayload) => {
    const backendPayload = {
      detalles: payload.items.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
      })),
      forma_pago_codigo: payload.forma_pago_codigo,
      direccion_id: payload.direccion_id || null,
      notas: payload.notas || null,
    };

    return apiFetch('/pedidos/', {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });
  },

  // El cliente puede cancelar solo desde PENDIENTE o CONFIRMADO
  // El backend requiere body { motivo: string }
  cancel: (id: number, motivo = 'Cancelado por el cliente') =>
    apiFetch(`/pedidos/${id}/cancelar`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    }),
};
