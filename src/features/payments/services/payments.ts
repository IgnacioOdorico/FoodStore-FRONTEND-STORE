import { apiFetch } from '../../../shared/services/api';

export interface CrearPagoResponse {
  pago_id: number;
  preference_id: string;
  init_point: string | null;
  public_key: string | null;
}

export interface ConfirmarPagoResponse {
  pedido_id: number;
  estado: string | null; // aprobado | rechazado | pendiente | null
}

export const paymentsService = {
  crear: (pedidoId: number) =>
    apiFetch<CrearPagoResponse>('/pagos/crear', {
      method: 'POST',
      body: JSON.stringify({ pedido_id: pedidoId }),
    }),

  confirm: (pedidoId: number, paymentId?: number | null) =>
    apiFetch<ConfirmarPagoResponse>('/pagos/confirm', {
      method: 'POST',
      body: JSON.stringify({ pedido_id: pedidoId, payment_id: paymentId ?? null }),
    }),
};
