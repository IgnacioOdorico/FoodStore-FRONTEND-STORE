import { apiFetch } from './api';

export interface CrearPagoResponse {
  pago_id: number;
  preference_id: string;
  init_point: string | null;
  public_key: string | null;
}

export function crearPago(pedidoId: number) {
  return apiFetch<CrearPagoResponse>('/pagos/crear', {
    method: 'POST',
    body: JSON.stringify({ pedido_id: pedidoId }),
  });
}
