import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../services/orders';
import { LoadingState, ErrorState, EmptyState } from '../../../shared/ui/States';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ShoppingBag } from 'lucide-react';
import type { Order, OrderStatus } from '../types/order';
import { Button } from '../../../shared/ui/Button';

const STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  en_preparacion: 'En preparación',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pendiente: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  en_preparacion: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  listo: 'bg-green-500/20 text-green-300 border-green-500/30',
  entregado: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  cancelado: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 flex flex-col items-center gap-6">
        <ClipboardList className="w-20 h-20 text-cocoa/30" />
        <h1 className="text-2xl font-black text-brand-active uppercase italic">No tenés pedidos aún</h1>
        <p className="text-cocoa/60 font-bold italic">Cuando confirmes un pedido, aparecerá acá.</p>
        <Button onClick={() => navigate('/products')} variant="secondary" className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Ver productos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black text-brand-active uppercase italic mb-8">Mis Pedidos</h1>

      <div className="flex flex-col gap-4">
        {(orders as Order[]).map(order => {
          const status = order.estado as OrderStatus;
          const total =
            order.total ??
            (order.items || []).reduce(
              (acc, item) => acc + item.precio_unitario * item.cantidad,
              0
            );

          return (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-xs font-black uppercase italic">Pedido</span>
                    <span className="font-black text-white text-lg">#{order.id}</span>
                  </div>
                  <span className="text-cocoa/60 text-xs italic">
                    {new Date(order.created_at).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase italic border ${STATUS_COLOR[status] ?? STATUS_COLOR.pendiente}`}>
                  {STATUS_LABEL[status] ?? status}
                </span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="flex flex-col gap-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-white/80 font-bold">
                        {item.producto?.nombre ?? `Producto #${item.producto_id}`}
                        <span className="text-white/40 ml-1">x{item.cantidad}</span>
                      </span>
                      <span className="text-canvas font-black">
                        ${(item.precio_unitario * item.cantidad).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-cocoa/60 text-xs font-black uppercase italic">{order.metodo_pago}</span>
                <span className="font-black text-canvas text-xl italic">${total.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
