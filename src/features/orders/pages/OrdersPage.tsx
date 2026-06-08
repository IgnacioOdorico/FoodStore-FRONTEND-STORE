import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../services/orders';
import { productsService } from '../../products/services/products';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { LoadingState, ErrorState } from '../../../shared/ui/States';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, X, CheckCircle2, Clock, ChefHat, PackageCheck, XCircle, Truck } from 'lucide-react';
import type { Order, OrderStatus } from '../types/order';

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En Preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const STATUS_TEXT: Record<OrderStatus, string> = {
  PENDIENTE: 'text-amber-600',
  CONFIRMADO: 'text-indigo-600',
  EN_PREP: 'text-[#b22300]',
  ENTREGADO: 'text-[#5c403a]',
  CANCELADO: 'text-[#ba1a1a]',
};

const TIMELINE_STEPS: { key: OrderStatus; label: string; detail: string }[] = [
  { key: 'PENDIENTE', label: 'Pedido Recibido', detail: 'Recibimos tu orden correctamente.' },
  { key: 'CONFIRMADO', label: 'Confirmado', detail: 'El local confirmó tu pedido.' },
  { key: 'EN_PREP', label: 'En Preparación', detail: 'El chef está preparando tus platos.' },
  { key: 'ENTREGADO', label: 'Entregado', detail: '¡Tu pedido fue entregado!' },
];

const STATUS_ORDER: OrderStatus[] = ['PENDIENTE', 'CONFIRMADO', 'EN_PREP', 'ENTREGADO', 'CANCELADO'];
const CANCELLABLE: OrderStatus[] = ['PENDIENTE', 'CONFIRMADO'];

const stepIndex = (status: OrderStatus) =>
  status === 'CANCELADO' ? -1 : STATUS_ORDER.indexOf(status);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const calcTotal = (order: Order) =>
  order.total ??
  (order.detalles || []).reduce((acc, i) => acc + i.precio_snapshot * i.cantidad, 0);

interface SidebarProps {
  order: Order;
  onCancel: (id: number) => void;
  isCancelling: boolean;
  onClose?: () => void;
}

const OrderDetailSidebar: React.FC<SidebarProps> = ({ order, onCancel, isCancelling, onClose }) => {
  const status      = order.estado_codigo as OrderStatus;
  const currentStep = stepIndex(status);
  const total       = calcTotal(order);
  const cancelled   = status === 'CANCELADO';

  return (
    <aside className="bg-[#ffe9e4] rounded-xl p-6 border border-[#e5beb5] h-fit sticky top-[88px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#281814]">Detalle del Pedido</h2>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-[#5c403a] hover:text-[#b22300] transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!cancelled ? (
        <div className="mb-10 space-y-6">
          {TIMELINE_STEPS.map((step, idx) => {
            const done = currentStep >= idx;
            const current = currentStep === idx;
            return (
              <div key={step.key} className="flex gap-4 relative">
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div className={`absolute left-3 top-6 w-0.5 h-full ${done ? 'bg-[#b22300]' : 'bg-[#e5beb5]'}`} />
                )}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors ${done ? 'bg-[#b22300]' : 'bg-[#e5beb5]'}`}>
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div className="pb-2">
                  <p className={`font-bold text-base leading-tight ${done ? 'text-[#281814]' : 'text-[#5c403a]/50'}`}>
                    {step.label}
                  </p>
                  {(done || current) && (
                    <p className="text-sm text-[#5c403a] mt-0.5">{step.detail}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-[#ba1a1a] flex-shrink-0" />
            <div>
              <p className="font-bold text-[#ba1a1a] text-sm">Pedido cancelado</p>
              <p className="text-xs text-red-400 mt-0.5">Este pedido fue cancelado.</p>
            </div>
          </div>
          {(() => {
            const cancelEntry = order.historial?.find(h => h.estado_hacia === 'CANCELADO');
            if (cancelEntry?.motivo) {
              return (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#ba1a1a]/60 mb-1">Motivo</p>
                  <p className="text-sm text-[#ba1a1a] font-medium">{cancelEntry.motivo}</p>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Items */}
      <div className="border-t border-[#e5beb5] pt-4 space-y-2">
        {(order.detalles || []).map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-[#5c403a]">
              {item.nombre_snapshot ?? `Producto #${item.producto_id}`}
              <span className="ml-1 text-[#907068]">x{item.cantidad}</span>
            </span>
            <span className="text-[#281814] font-bold">
              ${(item.precio_snapshot * item.cantidad).toLocaleString('es-AR')}
            </span>
          </div>
        ))}
        <div className="border-t border-dashed border-[#e5beb5] pt-3 mt-3 flex justify-between items-center">
          <span className="text-lg font-semibold text-[#281814]">Total</span>
          <span className="text-2xl font-bold text-[#b22300]">
            ${total.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Entrega */}
      <div className="mt-4 p-4 bg-white rounded-lg border border-[#e5beb5] text-sm text-[#5c403a] shadow-sm">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#907068] mb-2 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" /> Entrega
        </h3>
        {order.direccion_id && order.direccion ? (
          <div>
            <p className="font-semibold text-[#281814]">Envío a domicilio</p>
            <p className="mt-0.5 text-xs">
              {order.direccion.alias ? <span className="font-semibold">{order.direccion.alias} - </span> : ''}
              {order.direccion.linea1}
              {order.direccion.linea2 ? `, ${order.direccion.linea2}` : ''}
            </p>
            <p className="text-xs">{order.direccion.ciudad}{order.direccion.provincia ? `, ${order.direccion.provincia}` : ''}</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-[#281814]">Retiro en sucursal</p>
            <p className="mt-0.5 text-xs">Te esperamos en nuestro local para retirar tu pedido.</p>
          </div>
        )}
      </div>

      {order.forma_pago_codigo && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#5c403a]">
          <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Pago:</span>
          <span className="font-medium">{order.forma_pago_codigo}</span>
        </div>
      )}

      {order.notas && (
        <div className="mt-3 p-3 bg-[#fff0ed] rounded-lg border border-[#e5beb5] text-sm text-[#5c403a]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#907068] block mb-1">Notas</span>
          {order.notas}
        </div>
      )}

      {CANCELLABLE.includes(status) && (
        <button
          onClick={() => onCancel(order.id)}
          disabled={isCancelling}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg border border-red-200 bg-red-50 text-[#ba1a1a] font-bold text-sm hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Cancelar Pedido
        </button>
      )}
    </aside>
  );
};


export const OrdersPage: React.FC = () => {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn:  ordersService.getAll,
    refetchInterval: 60_000, // se conserva por si falla el websocket.
  });

  // ─── WebSocket — actualizaciones en tiempo real ───────────────────────────
  // El cliente es role:user — entra a su room de rol pero no recibe
  // eventos generales. Para recibir actualizaciones de un pedido concreto
  // debe llamar a subscribeToOrder(id), que une el socket a "order:{id}".
  //
  // WS_CONNECTED se emite al (re)conectar: aprovechamos ese evento para
  // re-suscribirse a TODOS los pedidos activos, por si se perdieron
  // eventos durante la desconexión.
  //
  // IMPORTANTE: subscribeToOrder/unsubscribeFromOrder se exponen via refs para
  // evitar el error de Temporal Dead Zone (TDZ) que ocurre cuando el useCallback
  // las referencia en sus deps siendo el resultado de la misma llamada a useWebSocket.
  const TERMINAL: OrderStatus[] = ['ENTREGADO', 'CANCELADO'];

  // Refs para acceder a las funciones del hook sin circular initialization.
  const subscribeRef   = useRef<((id: number) => void) | null>(null);
  const unsubscribeRef = useRef<((id: number) => void) | null>(null);

  const handleMessage = useCallback(
    (msg: import('../../../hooks/useWebSocket').WsMessage) => {
      if (msg.event === 'WS_CONNECTED') {
        // Al reconectar, re-suscribirse a todos los pedidos activos.
        const activos = (orders || []).filter(
          (o) => !TERMINAL.includes((o as Order).estado_codigo as OrderStatus),
        );
        activos.forEach((o) => subscribeRef.current?.((o as Order).id));
        // Invalidar para tener datos frescos tras la reconexión.
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        return;
      }

      const PEDIDO_EVENTS = [
        'PEDIDO_NUEVO',
        'PEDIDO_CONFIRMADO',
        'PEDIDO_EN_PREPARACION',
        'PEDIDO_ENTREGADO',
        'PEDIDO_CANCELADO',
      ];
      if (PEDIDO_EVENTS.includes(msg.event)) {
        queryClient.invalidateQueries({ queryKey: ['orders'] });

        // Si el pedido llegó a estado terminal, desuscribirse de su room.
        const payload = msg.data as { id?: number; estado_codigo?: string } | null;
        if (
          payload?.id &&
          (msg.event === 'PEDIDO_ENTREGADO' || msg.event === 'PEDIDO_CANCELADO')
        ) {
          unsubscribeRef.current?.(payload.id);
        }
      }
    },
    // TERMINAL es estable (declarado en render pero siempre igual), orders cambia
    // con los datos. subscribeRef/unsubscribeRef son refs estables → no van en deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orders, queryClient],
  );

  const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({ onMessage: handleMessage });

  // Actualizar las refs cada vez que el hook retorna funciones nuevas (son estables
  // por useCallback interno, pero lo hacemos igualmente para ser correctos).
  subscribeRef.current   = subscribeToOrder;
  unsubscribeRef.current = unsubscribeFromOrder;

  // Suscribir a pedidos activos cuando carga la lista inicial.
  // Cuando WS_CONNECTED llega (al reconectar) también se re-suscriben,
  // por eso aquí solo cubrimos el caso de carga inicial con WS ya abierto.
  useEffect(() => {
    if (!orders) return;
    const activos = (orders as Order[]).filter(
      (o) => !TERMINAL.includes(o.estado_codigo as OrderStatus),
    );
    activos.forEach((o) => subscribeToOrder(o.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);
  
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => ordersService.cancel(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  const typedOrders = (orders || []) as Order[];

  useEffect(() => {
    if (selectedId === null && typedOrders.length > 0) {
      setSelectedId(typedOrders[0].id);
    }
  }, [typedOrders, selectedId]);

  if (isLoading) return <LoadingState />;
  if (isError)   return <ErrorState onRetry={() => refetch()} />;

  if (typedOrders.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff8f6] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-[#ffe9e4] flex items-center justify-center">
          <PackageCheck className="w-10 h-10 text-[#b22300]/40" />
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

  const selectedOrder = typedOrders.find((o) => o.id === selectedId) ?? typedOrders[0];

  // Iconos segun el estado 
  const StatusIcon: Record<OrderStatus, React.ReactNode> = {
    PENDIENTE: <Clock className="w-4 h-4" />,
    CONFIRMADO: <CheckCircle2 className="w-4 h-4" />,
    EN_PREP: <ChefHat className="w-4 h-4" />,
    ENTREGADO: <PackageCheck className="w-4 h-4" />,
    CANCELADO: <XCircle className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="pt-[80px] pb-16 px-4 md:px-10 max-w-[1280px] mx-auto">

        {/* Header de las paginas */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#281814]">
            Mis Pedidos
          </h1>
          <p className="text-base text-[#5c403a] mt-1">
            Gestioná y revisá el historial de tus compras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-7 space-y-6">
            {typedOrders.map((order) => {
              const status     = order.estado_codigo as OrderStatus;
              const total      = calcTotal(order);
              const isActive   = status !== 'ENTREGADO' && status !== 'CANCELADO';
              const isSelected = order.id === selectedId;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  className={`rounded-xl p-6 border transition-all duration-200 cursor-pointer hover:shadow-md group ${isSelected
                    ? 'border-[#b22300]/40 shadow-md ring-2 ring-[#b22300]/10'
                    : isActive
                      ? 'bg-[#fff0ed] border-[#e5beb5] shadow-sm'
                      : 'bg-white border-[#e5beb5] hover:border-[#b22300]/30'
                    }`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <span className={`block text-[12px] font-bold uppercase tracking-[0.05em] mb-1 ${STATUS_TEXT[status]}`}>
                        {STATUS_LABEL[status]}
                      </span>
                      <h3 className="text-lg font-semibold text-[#281814]">#ORD-{order.id}</h3>
                      <p className="text-sm text-[#5c403a]">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${isActive ? 'text-[#b22300]' : 'text-[#281814]'}`}>
                        ${total.toLocaleString('es-AR')}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(order.id); }}
                        className={`mt-1 flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.05em] transition-colors ${
                          isActive ? 'text-[#b22300] hover:underline' : 'text-[#5c403a] hover:text-[#b22300]'
                        }`}
                      >
                        Ver Detalle
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isActive && order.detalles && order.detalles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {order.detalles.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold bg-[#fadcd5] text-[#8b1900] px-2 py-0.5 rounded-full"
                        >
                          {item.nombre_snapshot} x{item.cantidad}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={`mt-3 flex justify-end text-sm ${STATUS_TEXT[status]} opacity-60`}>
                    {StatusIcon[status]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detalles del sidebar */}
          <div className="lg:col-span-5">
            {selectedOrder && (
              <OrderDetailSidebar
                order={selectedOrder}
                onCancel={(id) => cancelMutation.mutate(id)}
                isCancelling={cancelMutation.isPending}
                onClose={() => setSelectedId(null)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
