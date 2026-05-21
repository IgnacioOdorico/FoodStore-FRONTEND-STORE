import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../store/useCartStore';
import { ordersService } from '../../orders/services/orders';
import { authService } from '../../auth/services/auth';

/**
 * CartPage — pantalla del carrito de compras.
 *
 * Estado del carrito: Zustand (useCartStore con persist en localStorage)
 *
 * Crear pedido: useMutation de TanStack Query.
 *   - mutationFn: llama a ordersService.create con el payload correcto del backend
 *   - onSuccess: limpia el carrito y navega a /orders
 *   - isPending: deshabilita el botón mientras procesa
 *   - error: muestra el mensaje de error si falla
 *
 * Payload enviado al backend (POST /api/v1/pedidos/):
 *   {
 *     detalles: [{ producto_id, cantidad }],
 *     forma_pago_codigo: 'EFECTIVO',
 *     notas: null,
 *   }
 */
export const CartPage: React.FC = () => {
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clear = useCartStore(state => state.clear);
  const getTotal = useCartStore(state => state.getTotal);
  const navigate = useNavigate();

  // Modal de login lazy — solo se muestra al intentar confirmar el pedido
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { mutate: createOrder, isPending, error } = useMutation({
    mutationFn: () =>
      ordersService.create({
        forma_pago_codigo: 'EFECTIVO',
        notas: null,
        detalles: items.map(i => ({
          producto_id: i.producto.id!,
          cantidad: i.cantidad,
        })),
      }),
    onSuccess: () => {
      clear();
      navigate('/orders');
    },
  });

  /**
   * Al pulsar "Finalizar Compra":
   * 1. Si ya está autenticado → crea el pedido directo.
   * 2. Si no → muestra modal con credenciales demo precargadas.
   */
  const handleConfirm = async () => {
    if (items.length === 0) return;
    try {
      await authService.me();
      // Ya autenticado — crear pedido
      createOrder();
    } catch {
      // No autenticado — mostrar modal de login
      setLoginError('');
      setShowLoginModal(true);
    }
  };

  /** Se llama desde el modal con las credenciales demo hardcodeadas */
  const handleLoginAndOrder = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      await authService.login('juan@ejemplo.com', 'Juan1234!');
      setShowLoginModal(false);
      createOrder();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoginLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-28 flex flex-col items-center justify-center gap-4 px-5"
        style={{ backgroundColor: 'var(--color-background)' }}>
        <span className="material-symbols-outlined text-7xl" style={{ color: 'var(--color-outline-variant)' }}>
          shopping_cart
        </span>
        <h2 className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-secondary)' }}>
          Tu carrito está vacío
        </h2>
        <p className="text-sm text-center" style={{ color: 'var(--color-outline)' }}>
          Agregá productos para continuar.
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

  return (
    <div className="min-h-screen pt-20 pb-28 flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <main className="flex-grow pt-6 pb-8 px-5 flex flex-col max-w-2xl mx-auto w-full">

        <div className="mb-6 flex items-center justify-between">
          <h2
            className="text-[22px] font-extrabold"
            style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-secondary)' }}
          >
            Tu Carrito
          </h2>
          <span
            className="text-[12px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full"
            style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}
          >
            {items.reduce((a, i) => a + i.cantidad, 0)} ÍTEMS
          </span>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {items.map(it => (
            <div
              key={it.producto.id}
              className="p-3 flex gap-4 items-center rounded-xl"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                boxShadow: '0 4px 12px rgba(130,81,58,0.05)',
                border: '1px solid rgba(222,230,195,0.3)',
              }}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0"
                style={{ backgroundColor: 'var(--color-surface-variant)' }}>
                {it.producto.imagenes_url?.[0] ? (
                  <img src={it.producto.imagenes_url[0]} alt={it.producto.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--color-outline)' }}>
                      lunch_dining
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-grow flex flex-col justify-between h-full py-1 min-w-0">
                <h3 className="font-semibold text-base line-clamp-1" style={{ color: 'var(--color-on-surface)' }}>
                  {it.producto.nombre}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="text-[22px] font-extrabold"
                    style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-primary)' }}
                  >
                    ${(it.producto.precio_base * it.cantidad).toLocaleString()}
                  </span>
                  <div
                    className="flex items-center rounded-full p-1"
                    style={{ backgroundColor: 'var(--color-surface-container-highest)' }}
                  >
                    <button
                      onClick={() => it.cantidad === 1 ? removeItem(it.producto.id!) : updateQuantity(it.producto.id!, it.cantidad - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                      style={
                        it.cantidad === 1
                          ? { backgroundColor: 'var(--color-error-container)', color: 'var(--color-error)' }
                          : { color: 'var(--color-on-surface)' }
                      }
                    >
                      <span className="material-symbols-outlined text-lg">
                        {it.cantidad === 1 ? 'delete' : 'remove'}
                      </span>
                    </button>
                    <span className="w-6 text-center font-semibold text-base" style={{ color: 'var(--color-on-surface)' }}>
                      {it.cantidad}
                    </span>
                    <button
                      onClick={() => updateQuantity(it.producto.id!, it.cantidad + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-90 shadow-sm"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-auto rounded-3xl p-6"
          style={{ backgroundColor: 'var(--color-surface-container-highest)', boxShadow: '0 -8px 24px rgba(130,81,58,0.08)' }}
        >
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between items-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              <span>Subtotal</span>
              <span>${getTotal().toLocaleString()}</span>
            </div>
            <div className="h-[2px] rounded-full" style={{ backgroundColor: 'rgba(199,199,186,0.3)' }} />
            <div className="flex justify-between items-end">
              <span className="text-[22px] font-extrabold" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-secondary)' }}>
                Total
              </span>
              <span className="text-[28px] font-black" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-secondary)' }}>
                ${getTotal().toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}
          >
            {isPending
              ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              : <><span>Finalizar Compra</span><span className="material-symbols-outlined fill-icon text-xl">arrow_forward</span></>
            }
          </button>

          {error && (
            <p className="mt-3 text-sm font-semibold text-center" style={{ color: 'var(--color-error)' }}>
              {error.message}
            </p>
          )}
        </div>

      </main>

      {/* ── Modal de login lazy ── aparece solo al confirmar el pedido ── */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(23,30,8,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-7 flex flex-col gap-5"
            style={{ backgroundColor: 'var(--color-surface-container-high)' }}
          >
            {/* Encabezado */}
            <div className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--color-secondary-container)' }}
              >
                <span className="material-symbols-outlined fill-icon" style={{ color: 'var(--color-secondary)' }}>
                  lock
                </span>
              </span>
              <div>
                <h2
                  className="text-[18px] font-black leading-tight"
                  style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}
                >
                  Iniciá sesión para confirmar
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>
                  Necesitás una cuenta para hacer tu pedido.
                </p>
              </div>
            </div>

            {/* Credenciales demo */}
            <div
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ backgroundColor: 'var(--color-primary-container)' }}
            >
              <span className="material-symbols-outlined text-xl mt-0.5" style={{ color: 'var(--color-primary)' }}>
                info
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: 'var(--color-on-primary-container)' }}>
                  Usuario demo precargado
                </p>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-on-primary-container)' }}>
                  juan@ejemplo.com
                </p>
                <p className="text-xs" style={{ color: 'var(--color-on-primary-container)', opacity: 0.75 }}>
                  Contraseña: Juan1234!
                </p>
              </div>
            </div>

            {loginError && (
              <p className="text-sm font-semibold text-center" style={{ color: 'var(--color-error)' }}>
                {loginError}
              </p>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLoginAndOrder}
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}
              >
                {loginLoading
                  ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  : <><span className="material-symbols-outlined fill-icon text-xl">login</span><span>Ingresar y confirmar pedido</span></>
                }
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                disabled={loginLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-outline)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
