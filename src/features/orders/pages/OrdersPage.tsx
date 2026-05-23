import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../services/orders';
import { productsService } from '../../products/services/products';
import { LoadingState, ErrorState } from '../../../shared/ui/States';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, X, CheckCircle2, Clock, Truck, ChefHat, PackageCheck, XCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../types/order';

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En Preparación',
  EN_CAMINO: 'En Camino',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const STATUS_TEXT: Record<OrderStatus, string> = {
  PENDIENTE: 'text-amber-600',
  CONFIRMADO: 'text-indigo-600',
  EN_PREP: 'text-[#b22300]',
  EN_CAMINO: 'text-orange-500',
  ENTREGADO: 'text-[#5c403a]',
  CANCELADO: 'text-[#ba1a1a]',
};


const TIMELINE_STEPS: { key: OrderStatus; label: string; detail: string }[] = [
  { key: 'PENDIENTE', label: 'Pedido Recibido', detail: 'Recibimos tu orden correctamente.' },
  { key: 'CONFIRMADO', label: 'Confirmado', detail: 'El local confirmó tu pedido.' },
  { key: 'EN_PREP', label: 'En Preparación', detail: 'El chef está preparando tus platos.' },
  { key: 'EN_CAMINO', label: 'En Camino', detail: 'Tu pedido está en camino.' },
  { key: 'ENTREGADO', label: 'Entregado', detail: '¡Tu pedido fue entregado!' },
];

const STATUS_ORDER: OrderStatus[] = ['PENDIENTE', 'CONFIRMADO', 'EN_PREP', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'];

const CANCELLABLE: OrderStatus[] = ['PENDIENTE', 'CONFIRMADO'];


const stepIndex = (status: OrderStatus) =>
  status === 'CANCELADO' ? -1 : STATUS_ORDER.indexOf(status);


const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const calcTotal = (order: Order) =>
  order.total ??
  (order.items || []).reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0);

interface SidebarProps {
  order: Order;
  onCancel: (id: number) => void;
  isCancelling: boolean;
  onClose?: () => void;
}

const OrderDetailSidebar: React.FC<SidebarProps> = ({ order, onCancel, isCancelling, onClose }) => {
  const status = order.estado as OrderStatus;
  const currentStep = stepIndex(status);
  const total = calcTotal(order);
  const cancelled = status === 'CANCELADO';

  return (
    <aside className="bg-[#ffe9e4] rounded-xl p-6 border border-[#e5beb5] h-fit sticky top-[88px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#281814]">Detalle del Pedido</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-[#5c403a] hover:text-[#b22300] transition-colors"
          >
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
                  <div
                    className={`absolute left-3 top-6 w-0.5 h-full ${done ? 'bg-[#b22300]' : 'bg-[#e5beb5]'}`}
                  />
                )}

                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors ${done ? 'bg-[#b22300]' : 'bg-[#e5beb5]'
                      }`}
                  >
                    {done && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    )}
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
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <XCircle className="w-6 h-6 text-[#ba1a1a] flex-shrink-0" />
          <div>
            <p className="font-bold text-[#ba1a1a] text-sm">Pedido cancelado</p>
            <p className="text-xs text-red-400 mt-0.5">Este pedido fue cancelado.</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border-t border-[#e5beb5] pt-4 space-y-2">
        {(order.items || []).map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-[#5c403a]">
              {item.nombre_snapshot ?? item.producto?.nombre ?? `Producto #${item.producto_id}`}
              <span className="ml-1 text-[#907068]">x{item.cantidad}</span>
            </span>
            <span className="text-[#281814] font-bold">
              ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
            </span>
          </div>
        ))}

        {/* Total */}
        <div className="border-t border-dashed border-[#e5beb5] pt-3 mt-3 flex justify-between items-center">
          <span className="text-lg font-semibold text-[#281814]">Total</span>
          <span className="text-2xl font-bold text-[#b22300]">
            ${total.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Forma de pago */}
      {
        order.forma_pago && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#5c403a]">
            <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Pago:</span>
            <span className="font-medium">{order.forma_pago}</span>
          </div>
        )
      }

      {/* Notas */}
      {
        order.notas && (
          <div className="mt-3 p-3 bg-[#fff0ed] rounded-lg border border-[#e5beb5] text-sm text-[#5c403a]">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#907068] block mb-1">Notas</span>
            {order.notas}
          </div>
        )
      }

      {/* Cancelar */}
      {
        CANCELLABLE.includes(status) && (
          <button
            onClick={() => onCancel(order.id)}
            disabled={isCancelling}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg border border-red-200 bg-red-50 text-[#ba1a1a] font-bold text-sm hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancelar Pedido
          </button>
        )
      }
    </aside >
  );
};


export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => ordersService.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  const typedOrders = (orders || []) as Order[];

  useEffect(() => {
    if (selectedId === null && typedOrders.length > 0) {
      setSelectedId(typedOrders[0].id);
    }
  }, [typedOrders, selectedId]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (!orders || orders.length === 0) {
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
    EN_CAMINO: <Truck className="w-4 h-4" />,
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

          {/* Lista de las ordenes */}
          <div className="lg:col-span-7 space-y-6">
            {typedOrders.map((order) => {
              const status = order.estado as OrderStatus;
              const total = calcTotal(order);
              const isActive = status !== 'ENTREGADO' && status !== 'CANCELADO';
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
                      {/* Estado  */}
                      <span className={`block text-[12px] font-bold uppercase tracking-[0.05em] mb-1 ${STATUS_TEXT[status]}`}>
                        {STATUS_LABEL[status]}
                      </span>
                      <h3 className="text-lg font-semibold text-[#281814]">
                        #ORD-{order.id}
                      </h3>
                      <p className="text-sm text-[#5c403a]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${isActive ? 'text-[#b22300]' : 'text-[#281814]'}`}>
                        ${total.toLocaleString('es-AR')}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(order.id); }}
                        className={`mt-1 flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.05em] transition-colors ${isActive
                          ? 'text-[#b22300] hover:underline'
                          : 'text-[#5c403a] hover:text-[#b22300]'
                          }`}
                      >
                        Ver Detalle
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Ordenes activas y la imagen  */}
                  {isActive && order.items && order.items.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                      {order.items.map((item, idx) => {
                        const productData = products?.find(p => p.id === item.producto_id);
                        const imageUrl = item.producto?.imagenes_url?.[0] || productData?.imagenes_url?.[0];
                        return (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-lg bg-[#fadcd5] flex-shrink-0 overflow-hidden flex items-center justify-center"
                            title={item.nombre_snapshot ?? item.producto?.nombre ?? `Producto #${item.producto_id}`}
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.nombre_snapshot ?? ''}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-[#b22300]/50 text-center leading-tight px-1">
                                {(item.nombre_snapshot ?? `#${item.producto_id}`).slice(0, 4)}
                              </span>
                            )}
                          </div>
                        );
                      })}
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
