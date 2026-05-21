import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { useCartStore } from '../../cart/store/useCartStore';
import { LoadingState, ErrorState } from '../../../shared/ui/States';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="No se pudo cargar el producto." />;
  if (!product) return <ErrorState message="El producto no existe." />;

  const outOfStock = !product.disponible || product.stock_cantidad === 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen pt-20 pb-28" style={{ backgroundColor: 'var(--color-background)' }}>
      <main className="max-w-lg mx-auto md:max-w-4xl">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-5 pt-6 pb-2 font-extrabold text-sm uppercase tracking-wide transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-secondary)' }}
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Volver
        </button>

        <div className="relative h-72 w-full">
          <img
            src={product.imagenes_url?.[0] || ''}
            alt={product.nombre}
            className="w-full h-full object-cover"
          />
          {!product.imagenes_url?.[0] && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-surface-dim)' }}>
              <span className="material-symbols-outlined text-6xl" style={{ color: 'var(--color-outline-variant)' }}>
                lunch_dining
              </span>
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <span className="px-6 py-2 rounded-full font-extrabold text-sm uppercase tracking-widest"
                style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--color-on-tertiary)' }}>
                Agotado
              </span>
            </div>
          )}
        </div>

        <div className="px-5 pt-6 flex flex-col gap-6">

          <div>
            {product.ingredientes?.some(i => i.es_alergeno) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wide mb-3"
                style={{ backgroundColor: 'var(--color-error-container)', color: 'var(--color-error)' }}>
                <span className="material-symbols-outlined text-sm">warning</span>
                Contiene alérgenos
              </span>
            )}
            <h1
              className="text-[28px] font-black leading-tight tracking-tight"
              style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}
            >
              {product.nombre}
            </h1>
            {product.descripcion && (
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-outline)' }}>
                {product.descripcion}
              </p>
            )}
          </div>

          {product.categorias && product.categorias.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.categorias.map(cat => (
                <span
                  key={cat.id}
                  className="px-3 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wide"
                  style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
          )}

          {product.ingredientes && product.ingredientes.length > 0 && (
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-widest mb-3"
                style={{ color: 'var(--color-outline)' }}>
                Ingredientes
              </p>
              <div className="flex flex-wrap gap-2">
                {product.ingredientes.map(ing => (
                  <span
                    key={ing.id}
                    className="px-3 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wide"
                    style={{
                      backgroundColor: ing.es_alergeno ? 'var(--color-error-container)' : 'var(--color-surface-container-highest)',
                      color: ing.es_alergeno ? 'var(--color-error)' : 'var(--color-on-surface-variant)',
                    }}
                  >
                    {ing.es_alergeno && '⚠ '}{ing.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{
              backgroundColor: 'var(--color-surface-container-highest)',
              boxShadow: '0 -8px 24px rgba(130,81,58,0.08)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
                Precio unitario
              </span>
              <span
                className="text-[28px] font-black leading-tight"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-primary)' }}
              >
                ${product.precio_base.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
                Cantidad
              </span>
              <div
                className="flex items-center rounded-full p-1"
                style={{ backgroundColor: 'var(--color-surface-container-high)' }}
              >
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={outOfStock}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-40"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="w-8 text-center font-bold text-base" style={{ color: 'var(--color-on-surface)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={outOfStock}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-90 shadow-sm disabled:opacity-40"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-md disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}
            >
              <span className="material-symbols-outlined fill-icon text-xl">add_shopping_cart</span>
              {outOfStock ? 'Sin stock' : `Agregar${quantity > 1 ? ` (${quantity})` : ''} al carrito`}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};
