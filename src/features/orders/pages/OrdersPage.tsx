import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ordersService } from '../services/orders';
import { LoadingState, ErrorState } from '../../../shared/ui/States';
import type { Order, OrderStatus } from '../types/order';

const STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  en_preparacion: 'En curso',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const STATUS_STYLE: Record<OrderStatus, React.CSSProperties> = {
  pendiente: { backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  en_preparacion: { backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  listo: { backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-on-primary-fixed-variant)' },
  entregado: { backgroundColor: 'var(--color-surface-container-highest)', color: 'var(--color-outline)' },
  cancelado: { backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)' },
};

/**
 * OrdersPage — lista los pedidos del usuario autenticado.
 *
 * Server state: useQuery con queryKey ['orders'] y queryFn ordersService.getAll
 *   → GET /api/v1/pedidos/me (solo los pedidos del usuario logueado)
 *
 * Separa los pedidos en dos grupos:
 *   - activos: pendiente | en_preparacion | listo
 *   - historial: entregado | cancelado
 *
 * Los pedidos activos muestran una barra de progreso visual.
 * El historial muestra una lista compacta con fecha y estado.
 */
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
      <div className="min-h-screen pt-20 pb-28 flex flex-col items-center justify-center gap-4 px-5"
        style={{ backgroundColor: 'var(--color-background)' }}>
        <span className="material-symbols-outlined text-7xl" style={{ color: 'var(--color-outline-variant)' }}>
          receipt_long
        </span>
        <h2 className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-secondary)' }}>
          No tenés pedidos aún
        </h2>
        <p className="text-sm text-center" style={{ color: 'var(--color-outline)' }}>
          Cuando confirmes un pedido, aparecerá acá.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-2 px-6 py-3 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}
        >
          Ver productos
        </button>
      </div>
    );
  }

  // Separar pedidos activos e historial usando el campo correcto del backend
  const activeOrders = (orders as Order[]).filter(
    o => o.estado_codigo === 'en_preparacion' || o.estado_codigo === 'pendiente' || o.estado_codigo === 'listo'
  );
  const pastOrders = (orders as Order[]).filter(
    o => o.estado_codigo === 'entregado' || o.estado_codigo === 'cancelado'
  );

  return (
    <div className="min-h-screen pt-20 pb-28" style={{ backgroundColor: 'var(--color-background)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">

        <h2
          className="text-[22px] font-extrabold mb-6"
          style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-background)' }}
        >
          Mis Pedidos
        </h2>

        {activeOrders.map(order => {
          const status = order.estado_codigo as OrderStatus;
          const progressPct = status === 'pendiente' ? 15 : status === 'en_preparacion' ? 45 : 90;
          const itemCount = order.detalles?.length ?? 0;

          return (
            <div
              key={order.id}
              className="rounded-xl p-4 mb-6"
              style={{
                backgroundColor: 'var(--color-surface-container-high)',
                boxShadow: '0 4px 12px rgba(130,81,58,0.08)',
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wide"
                    style={STATUS_STYLE[status]}>
                    {STATUS_LABEL[status]}
                  </span>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-outline)' }}>
                    Pedido #{order.id}
                  </p>
                </div>
                <span
                  className="text-[22px] font-extrabold"
                  style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-primary)' }}
                >
                  ${order.total.toLocaleString()}
                </span>
              </div>

              <div
                className="p-4 rounded-xl flex items-center gap-4 mb-4"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <span className="material-symbols-outlined text-4xl" style={{ color: 'var(--color-secondary)' }}>
                  local_pizza
                </span>
                <div>
                  <p className="font-semibold text-base" style={{ color: 'var(--color-on-background)' }}>
                    {status === 'listo' ? '¡Tu pedido está listo!' : '¡Tu pedido está en preparación!'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-outline)' }}>
                    {itemCount} ítem{itemCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="w-full h-2.5 rounded-full mb-2" style={{ backgroundColor: 'var(--color-surface-variant)' }}>
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, backgroundColor: 'var(--color-secondary)' }}
                />
              </div>
              <div className="flex justify-between text-[12px] font-extrabold uppercase tracking-wide"
                style={{ color: 'var(--color-outline)' }}>
                <span>Preparando</span>
                <span>En camino</span>
                <span>Entregado</span>
              </div>
            </div>
          );
        })}

        {pastOrders.length > 0 && (
          <>
            <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--color-on-background)' }}>
              Historial de Pedidos
            </h3>
            <div className="flex flex-col gap-4">
              {pastOrders.map(order => {
                const status = order.estado_codigo as OrderStatus;
                const itemCount = order.detalles?.length ?? 0;
                return (
                  <div
                    key={order.id}
                    className="rounded-xl p-4 flex justify-between items-center shadow-sm"
                    style={{ backgroundColor: 'var(--color-surface-container)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-secondary)' }}
                      >
                        <span className="material-symbols-outlined">receipt_long</span>
                      </div>
                      <div>
                        <p className="font-semibold text-base" style={{ color: 'var(--color-on-background)' }}>
                          Pedido #{order.id}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-outline)' }}>
                          {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {' • '}
                          {itemCount} ítem{itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-base" style={{ color: 'var(--color-primary)' }}>
                        ${order.total.toLocaleString()}
                      </p>
                      <span
                        className="text-[12px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={STATUS_STYLE[status]}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </main>
    </div>
  );
};
