import { apiFetch } from './api';

export function createPedido(payload: {
  forma_pago_codigo: string;
  notas?: string | null;
  direccion_id?: number | null;
  detalles: {
    producto_id: number;
    cantidad: number;
    personalizacion?: number[];
  }[];
  descuento?: number;
  costo_envio?: number;
}) {
  return apiFetch<{ id: number }>('/pedidos/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
