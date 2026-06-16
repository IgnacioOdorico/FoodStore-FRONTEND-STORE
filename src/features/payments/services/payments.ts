import { apiFetch } from '../../../shared/services/api';

export interface ConfirmarPagoResponse {
  pedido_id: number;
  estado: string | null;
}

export const paymentsService = {
  confirm: (pedidoId: number, paymentId?: number | null) =>
    apiFetch<ConfirmarPagoResponse>('/pagos/confirm', {
      method: 'POST',
      body: JSON.stringify({ pedido_id: pedidoId, payment_id: paymentId ?? null }),
    }),
};
