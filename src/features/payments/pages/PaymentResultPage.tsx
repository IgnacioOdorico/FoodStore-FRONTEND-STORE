import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { paymentsService } from '../services/payments';

/**
 * Página de retorno tras el pago en MercadoPago.
 */

type Estado = 'confirmando' | 'aprobado' | 'rechazado' | 'pendiente' | 'error';

export const PaymentResultPage: React.FC = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>('confirmando');

  const pid = Number(pedidoId);
  const paymentIdParam = searchParams.get('payment_id') ?? searchParams.get('collection_id');

  useEffect(() => {
    let cancelado = false;
    async function confirmar() {
      try {
        const paymentId = paymentIdParam ? Number(paymentIdParam) : null;
        const res = await paymentsService.confirm(pid, paymentId);
        if (cancelado) return;
        if (res.estado === 'aprobado') setEstado('aprobado');
        else if (res.estado === 'rechazado') setEstado('rechazado');
        else setEstado('pendiente');
      } catch {
        if (!cancelado) setEstado('error');
      }
    }
    confirmar();
    return () => { cancelado = true; };
  }, [pid, paymentIdParam]);

  const config: Record<Estado, { icon: React.ReactNode; titulo: string; texto: string; color: string }> = {
    confirmando: {
      icon: <Loader2 className="w-10 h-10 text-[#b22300] animate-spin" />,
      titulo: 'Confirmando tu pago…',
      texto: 'Estamos verificando el estado de tu pago con MercadoPago.',
      color: '#b22300',
    },
    aprobado: {
      icon: <CheckCircle2 className="w-10 h-10 text-green-600" />,
      titulo: '¡Pago aprobado!',
      texto: 'Tu pago fue procesado y tu pedido fue confirmado.',
      color: '#16a34a',
    },
    pendiente: {
      icon: <Clock className="w-10 h-10 text-amber-500" />,
      titulo: 'Pago pendiente',
      texto: 'Tu pago está siendo procesado. Te avisaremos cuando se acredite.',
      color: '#f59e0b',
    },
    rechazado: {
      icon: <XCircle className="w-10 h-10 text-[#ba1a1a]" />,
      titulo: 'Pago rechazado',
      texto: 'No se pudo procesar el pago. Tu pedido quedó pendiente; podés reintentar.',
      color: '#ba1a1a',
    },
    error: {
      icon: <XCircle className="w-10 h-10 text-[#ba1a1a]" />,
      titulo: 'No pudimos confirmar el pago',
      texto: 'Hubo un problema al verificar el estado. Revisá tus pedidos en unos minutos.',
      color: '#ba1a1a',
    },
  };

  const c = config[estado];

  return (
    <div className="min-h-screen bg-[#fff8f6] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#e5beb5]/40 shadow-[0_4px_24px_rgba(178,35,0,0.08)] p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#fff0ed] flex items-center justify-center mx-auto mb-5">
          {c.icon}
        </div>
        <h1 className="text-2xl font-black text-[#281814] mb-2">{c.titulo}</h1>
        <p className="text-sm text-[#5c403a] mb-6">{c.texto}</p>

        {estado !== 'confirmando' && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-[#b22300] text-white py-3 rounded-xl font-bold hover:bg-[#da3711] active:scale-[0.98] transition-all"
            >
              Ver mis pedidos
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full text-sm font-semibold text-[#5c403a] hover:text-[#b22300] transition-colors py-2"
            >
              Volver al catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
