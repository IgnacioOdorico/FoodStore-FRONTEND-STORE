import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../services/products';
import { useCartStore } from '../../cart/store/useCartStore';
import { useHomeStore } from '../store/useHomeStore';
import { LoadingState, ErrorState, EmptyState } from '../../../shared/ui/States';
import type { Producto } from '../types/producto';

/**
 * ProductsPage — listado de productos.
 *
 * Server state (TanStack Query):
 *   useQuery con queryKey ['products'] y queryFn productsService.getAll
 *   → GET /api/v1/productos/
 *   Cuando el usuario navega de vuelta, TanStack devuelve el caché
 *   inmediatamente (staleTime por defecto) sin re-fetch innecesario.
 *
 * UI state: useHomeStore (Zustand) para search y selectedCategory.
 *   Al navegar al detalle y volver, el filtro activo se mantiene.
 *
 * Navegación con parámetro dinámico:
 *   navigate(`/products/${p.id}`) → AppRouter define Route path="/products/:id"
 *   En ProductDetailPage se extrae con: const { id } = useParams<{ id: string }>()
 */

export const ProductsPage: React.FC = () => {
  const search = useHomeStore(state => state.search);
  const selectedCategory = useHomeStore(state => state.selectedCategory);
  const setSearch = useHomeStore(state => state.setSearch);
  const setSelectedCategory = useHomeStore(state => state.setSelectedCategory);
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);

  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!products || products.length === 0) return <EmptyState message="No hay productos disponibles" />;

  const allCategories: string[] = Array.from(
    new Set(products.flatMap((p: Producto) => (p.categorias || []).map(c => c.nombre)))
  );

  const filtered = products.filter((p: Producto) => {
    const matchSearch = !search || p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || (p.categorias || []).some(c => c.nombre === selectedCategory);
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-28" style={{ backgroundColor: 'var(--color-background)' }}>
      <main className="px-5 pt-8 max-w-lg mx-auto md:max-w-4xl">

        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl"
            style={{ color: 'var(--color-outline)' }}>search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none transition-colors"
            style={{
              backgroundColor: 'var(--color-surface-container-high)',
              color: 'var(--color-on-surface)',
            }}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('')}
            className="whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-extrabold uppercase tracking-wide shadow-sm transition-colors"
            style={{
              backgroundColor: !selectedCategory ? 'var(--color-secondary)' : 'var(--color-surface-container-highest)',
              color: !selectedCategory ? 'var(--color-on-secondary)' : 'var(--color-on-surface-variant)',
            }}
          >
            Todos
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
              className="whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-extrabold uppercase tracking-wide shadow-sm transition-colors"
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--color-secondary)' : 'var(--color-surface-container-highest)',
                color: selectedCategory === cat ? 'var(--color-on-secondary)' : 'var(--color-on-surface-variant)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No se encontraron productos" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((p: Producto) => (
              <article
                key={p.id}
                className="rounded-xl overflow-hidden flex flex-col group"
                style={{
                  backgroundColor: 'var(--color-surface-container-high)',
                  boxShadow: '0 -4px 12px rgba(130,81,58,0.08)',
                }}
              >
                <div
                  className="relative h-48 w-full cursor-pointer"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  {p.imagenes_url?.[0] ? (
                    <img
                      src={p.imagenes_url[0]}
                      alt={p.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-surface-dim)' }}>
                      <span className="material-symbols-outlined text-5xl"
                        style={{ color: 'var(--color-outline-variant)' }}>lunch_dining</span>
                    </div>
                  )}
                  {(!p.disponible || p.stock_cantidad === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                      <span className="px-4 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wide"
                        style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--color-on-tertiary)' }}>
                        Agotado
                      </span>
                    </div>
                  )}
                  {p.categorias && p.categorias.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="px-3 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wide shadow-sm"
                        style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>
                        {p.categorias[0].nombre}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h2
                    className="text-[22px] font-extrabold leading-tight line-clamp-2 mb-element-gap cursor-pointer"
                    style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)' }}
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    {p.nombre}
                  </h2>
                  {p.descripcion && (
                    <p className="text-sm mb-4 flex-grow line-clamp-3" style={{ color: 'var(--color-outline)' }}>
                      {p.descripcion}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="text-[28px] font-black leading-tight"
                      style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-primary)' }}
                    >
                      ${p.precio_base?.toLocaleString()}
                    </span>
                    <button
                      disabled={!p.disponible || p.stock_cantidad === 0}
                      onClick={() => addItem(p, 1)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base hover:opacity-90 active:scale-95 shadow-sm transition-all disabled:opacity-40"
                      style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}
                    >
                      <span className="material-symbols-outlined fill-icon text-xl">add_shopping_cart</span>
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
