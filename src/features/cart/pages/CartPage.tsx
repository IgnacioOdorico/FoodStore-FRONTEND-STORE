import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { ordersService } from '../../orders/services/orders';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, ArrowRight, Info, MapPin, Store } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { direccionesService } from '../../../shared/services/direcciones';

export const CartPage: React.FC = () => {
  const items        = useCartStore((s) => s.items);
  const updateQty    = useCartStore((s) => s.updateQuantity);
  const removeItem   = useCartStore((s) => s.removeItem);
  const clear        = useCartStore((s) => s.clear);
  const getTotal     = useCartStore((s) => s.getTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');
  const [modalidadEnvio, setModalidadEnvio] = useState<'RETIRO' | 'ENVIO'>('RETIRO');
  const [direccionId, setDireccionId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: direcciones } = useQuery({
    queryKey: ['direcciones'],
    queryFn: direccionesService.getAll,
  });

  useEffect(() => {
    if (direcciones && direcciones.length > 0 && !direccionId) {
      const principal = direcciones.find(d => d.es_principal);
      setDireccionId(principal ? principal.id : direcciones[0].id);
    }
  }, [direcciones, direccionId]);

  const subtotal = getTotal();

  const handleConfirm = async () => {
    if (items.length === 0) return;
    if (modalidadEnvio === 'ENVIO' && !direccionId) {
      setError('Debés seleccionar una dirección para el envío');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const payload = {
      forma_pago_codigo: 'EFECTIVO',
      notas: null,
      direccion_id: modalidadEnvio === 'ENVIO' ? direccionId : null,
      detalles: items.map((i) => ({
        producto_id: i.producto.id!,
        cantidad: i.cantidad,
      })),
    };

    try {
      await ordersService.create(payload);
      clear();
      navigate('/orders');
    } catch (e: any) {
      setError(e.message || 'No se pudo crear el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff8f6] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-[#ffe9e4] flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-[#b22300]/40" />
        </div>
        <h1 className="text-2xl font-black text-[#281814]">Tu carrito está vacío</h1>
        <p className="text-[#5c403a] text-sm">Agregá productos para continuar.</p>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 px-6 py-3 bg-[#b22300] text-white font-bold rounded-lg hover:bg-[#da3711] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="pt-20 pb-16 max-w-[1280px] mx-auto px-4 md:px-10">

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Lista de items ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-black text-[#281814] tracking-tight">
                Revisá tu Pedido
              </h1>
              <button
                onClick={clear}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ba1a1a] hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar
              </button>
            </div>

            <div className="space-y-4">
              {items.map((it) => (
                <div
                  key={it.producto.id}
                  className="bg-white rounded-xl border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(178,35,0,0.04)] p-5 flex flex-col sm:flex-row items-center gap-5"
                >
                  {/* Imagen */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#ffe9e4]">
                    {it.producto.imagenes_url?.[0] ? (
                      <img
                        src={it.producto.imagenes_url[0]}
                        alt={it.producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#b22300]/20 text-xs font-bold">
                        Sin img
                      </div>
                    )}
                  </div>

                  {/* Nombre */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h3 className="font-semibold text-[#281814] text-base leading-snug truncate">
                      {it.producto.nombre}
                    </h3>
                    <p className="text-[#5c403a] text-sm">
                      ${it.producto.precio_base.toLocaleString('es-AR')} c/u
                    </p>
                  </div>

                  {/* Control cantidad */}
                  <div className="flex items-center gap-2 bg-[#ffe9e4] rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQty(it.producto.id!, it.cantidad - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#fadcd5] active:scale-90 transition-all"
                    >
                      <Minus className="w-3 h-3 text-[#b22300]" />
                    </button>
                    <span className="w-6 text-center font-black text-[#281814]">
                      {it.cantidad}
                    </span>
                    <button
                      onClick={() => updateQty(it.producto.id!, it.cantidad + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#fadcd5] active:scale-90 transition-all"
                    >
                      <Plus className="w-3 h-3 text-[#b22300]" />
                    </button>
                  </div>

                  {/* Precio + eliminar */}
                  <div className="flex items-center gap-3 min-w-[110px] justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c403a] mb-0.5">
                        Precio
                      </p>
                      <p className="font-black text-[#b22300] text-lg">
                        ${(it.producto.precio_base * it.cantidad).toLocaleString('es-AR')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(it.producto.id!)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5c403a]/50 hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Seguir comprando */}
            <button
              onClick={() => navigate('/products')}
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#5c403a] hover:text-[#b22300] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Seguir comprando
            </button>
          </div>

          {/* ── Sidebar Order Summary ── */}
          <aside className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)] p-6 sticky top-20">
              <h2 className="font-bold text-[#281814] text-lg mb-4">Modalidad de entrega</h2>
              
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => { setModalidadEnvio('RETIRO'); setError(''); }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border transition-all ${
                    modalidadEnvio === 'RETIRO'
                      ? 'bg-[#ffe9e4] border-[#b22300] text-[#b22300]'
                      : 'bg-white border-[#e5beb5] text-[#5c403a] hover:bg-[#fff8f6]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Retiro
                </button>
                <button
                  onClick={() => { setModalidadEnvio('ENVIO'); setError(''); }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border transition-all ${
                    modalidadEnvio === 'ENVIO'
                      ? 'bg-[#ffe9e4] border-[#b22300] text-[#b22300]'
                      : 'bg-white border-[#e5beb5] text-[#5c403a] hover:bg-[#fff8f6]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Envío
                </button>
              </div>

              {modalidadEnvio === 'ENVIO' && (
                <div className="mb-6">
                  <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] mb-1.5 block">
                    Dirección de envío
                  </label>
                  {direcciones && direcciones.length > 0 ? (
                    <select
                      value={direccionId || ''}
                      onChange={(e) => { setDireccionId(Number(e.target.value)); setError(''); }}
                      className="w-full h-11 px-3 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-sm text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300]"
                    >
                      {direcciones.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.alias ? `${d.alias} - ` : ''}{d.linea1}, {d.ciudad}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-xs text-[#ba1a1a] bg-[#ffdad6] p-3 rounded-lg border border-[#ba1a1a]/20">
                      No tenés direcciones guardadas. Podés agregar una yendo a tu <strong>Perfil</strong>.
                    </div>
                  )}
                </div>
              )}

              <h2 className="font-bold text-[#281814] text-lg mb-6 pt-4 border-t border-[#e5beb5]">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5c403a]">Subtotal</span>
                  <span className="font-semibold text-[#281814]">
                    ${subtotal.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5c403a]">Envío</span>
                  <span className="font-semibold text-[#281814]">A confirmar</span>
                </div>
                <div className="pt-4 border-t border-[#e5beb5]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#281814] text-base">Total</span>
                    <span className="font-black text-[#b22300] text-3xl tracking-tight">
                      ${subtotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-3 p-4 bg-[#ffe9e4] border border-[#b22300]/10 rounded-lg mb-4">
                <Info className="w-4 h-4 text-[#b22300] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#5c403a]">
                  Tu pedido apoya a productores locales y prácticas sustentables.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-lg text-xs font-bold text-[#ba1a1a]">
                  {error}
                </div>
              )}

              {/* Confirmar */}
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full bg-[#b22300] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#da3711] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    Confirmar Pedido
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
