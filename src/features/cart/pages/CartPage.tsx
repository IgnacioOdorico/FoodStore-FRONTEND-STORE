import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../../../shared/ui/Button';
import { ordersService } from '../../orders/services/orders';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';

export const CartPage: React.FC = () => {
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clear = useCartStore(state => state.clear);
  const getTotal = useCartStore(state => state.getTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (items.length === 0) return;

    setIsLoading(true);
    setError('');

    const payload = {
      metodo_pago: 'efectivo',
      notas: null,
      items: items.map(i => ({
        producto_id: i.producto.id,
        cantidad: i.cantidad,
        precio_unitario: i.producto.precio_base,
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
      <div className="max-w-4xl mx-auto py-20 px-4 flex flex-col items-center gap-6">
        <ShoppingBag className="w-20 h-20 text-cocoa/30" />
        <h1 className="text-2xl font-black text-brand-active uppercase italic">Tu carrito está vacío</h1>
        <p className="text-cocoa/60 font-bold italic">Agregá productos para continuar.</p>
        <Button onClick={() => navigate('/products')} variant="secondary" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Ver productos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-brand-active uppercase italic">Carrito</h1>
        <button
          onClick={clear}
          className="text-xs text-red-400 font-black uppercase italic hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Vaciar carrito
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {items.map(it => (
          <div key={it.producto.id} className="card p-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black/20">
              {it.producto.imagenes_url?.[0] ? (
                <img
                  src={it.producto.imagenes_url[0]}
                  alt={it.producto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-bold italic">Sin img</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-black text-white text-lg leading-tight truncate">{it.producto.nombre}</div>
              <div className="text-cocoa/70 text-sm italic">${it.producto.precio_base.toLocaleString()} c/u</div>
            </div>

            <div className="flex items-center gap-2 bg-black/10 rounded-2xl border border-white/10 p-1">
              <button
                onClick={() => updateQuantity(it.producto.id!, it.cantidad - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-black text-white">{it.cantidad}</span>
              <button
                onClick={() => updateQuantity(it.producto.id!, it.cantidad + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="w-24 text-right font-black text-canvas text-lg">
              ${(it.producto.precio_base * it.cantidad).toLocaleString()}
            </div>

            <button
              onClick={() => removeItem(it.producto.id!)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/10 rounded-3xl border-2 border-cocoa/20 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-cocoa/60 text-[10px] font-black uppercase tracking-widest italic">Total a pagar</span>
          <span className="text-4xl font-black text-brand-active italic">${getTotal().toLocaleString()}</span>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/products')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Button>
          <Button onClick={handleConfirm} isLoading={isLoading} className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Confirmar Pedido
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-black text-sm italic">
          {error}
        </div>
      )}
    </div>
  );
};
