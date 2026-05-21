import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../services/orders';
import { LoadingState, ErrorState } from '../../../shared/ui/States';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ShoppingBag, X } from 'lucide-react';
import type { Order, OrderStatus } from '../types/order';

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDIENTE:  'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP:    'En preparación',
  EN_CAMINO:  'En camino',
  ENTREGADO:  'Entregado',
  CANCELADO:  'Cancelado',
};

const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  PENDIENTE:  { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200' },
  CONFIRMADO: { bg: 'bg-indigo-50',  text: 'text-indigo-700', border: 'border-indigo-200' },
  EN_PREP:    { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200' },
  EN_CAMINO:  { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200' },
  ENTREGADO:  { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200' },
  CANCELADO:  { bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200' },
};

const CANCELLABLE: OrderStatus[] = ['PENDIENTE', 'CONFIRMADO'];

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => ordersService.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff8f6] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-[#ffe9e4] flex items-center justify-center">
          <ClipboardList className="w-10 h-10 text-[#b22300]/40" />
        </div>
        <h1 className="text-2xl font-black text-[#281814]">No tenés pedidos aún</h1>
        <p className="text-[#5c403a] text-sm">Cuando confirmes un pedido, aparecerá acá.</p>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 px-6 py-3 bg-[#b22300] text-white font-bold rounded-lg hover:bg-[#da3711] transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="pt-20 pb-16 max-w-[800px] mx-auto px-4 md:px-10">
        <h1 className="text-3xl font-black text-[#281814] tracking-tight mb-8">Mis Pedidos</h1>

        <div className="space-y-4">
          {(orders as Order[]).map((order) => {
            const status = order.estado as OrderStatus;
            const style = STATUS_STYLE[status] ?? STATUS_STYLE.PENDIENTE;
            const total =
              order.total ??
              (order.items || []).reduce(
                (acc, item) => acc + item.precio_unitario * item.cantidad,
                0,
              );
            const canCancel = CANCELLABLE.includes(status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)] p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#5c403a] text-xs font-bold uppercase tracking-widest">Pedido</span>
                      <span className="font-black text-[#281814] text-xl">#{order.id}</span>
                    </div>
                    <span className="text-[#5c403a] text-xs">
                      {new Date(order.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Badge de estado */}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {STATUS_LABEL[status] ?? status}
                    </span>

                    {/* Cancelar */}
                    {canCancel && (
                      <button
                        onClick={() => cancelMutation.mutate(order.id)}
                        disabled={cancelMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-2 mb-4 py-4 border-t border-b border-[#e5beb5]/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-[#281814] font-medium">
                          {item.nombre_snapshot ?? item.producto?.nombre ?? `Producto #${item.producto_id}`}
                          <span className="text-[#5c403a] ml-1.5 text-xs">×{item.cantidad}</span>
                        </span>
                        <span className="font-bold text-[#b22300]">
                          ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5c403a]/60">
                    {order.forma_pago}
                  </span>
                  <span className="font-black text-[#b22300] text-2xl">
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
