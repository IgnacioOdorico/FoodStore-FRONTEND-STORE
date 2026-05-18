import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { LoadingState, ErrorState, EmptyState } from '../../../shared/ui/States';
import { useCartStore } from '../../cart/store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Eye } from 'lucide-react';
import type { Producto } from '../types/producto';

export const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });

  const addItem = useCartStore(state => state.addItem);
  const navigate = useNavigate();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const allCategories: string[] = Array.from(
    new Set(
      (products || []).flatMap((p: Producto) =>
        (p.categorias || []).map(c => c.nombre)
      )
    )
  );

  const filtered = (products || []).filter((p: Producto) => {
    const matchSearch = !search || p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      !selectedCategory ||
      (p.categorias || []).some(c => c.nombre === selectedCategory);
    return matchSearch && matchCategory;
  });

  if (!products || products.length === 0) return <EmptyState message="No hay productos disponibles" />;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-black text-brand-active uppercase italic">Productos</h1>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa/50" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="input-field pl-9 w-full sm:w-56"
            />
          </div>

          {allCategories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="input-field sm:w-48"
            >
              <option value="">Todas las categorías</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No se encontraron productos con ese criterio" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p: Producto) => (
            <div key={p.id} className="card p-0 flex flex-col overflow-hidden group">
              <div
                className="h-48 bg-gray-100 overflow-hidden cursor-pointer relative"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                {p.imagenes_url?.[0] ? (
                  <img
                    src={p.imagenes_url[0]}
                    alt={p.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-sm font-bold uppercase italic">
                    Sin imagen
                  </div>
                )}
                {!p.disponible || p.stock_cantidad === 0 ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full font-black text-xs uppercase italic">
                      Sin Stock
                    </span>
                  </div>
                ) : null}
                {p.categorias && p.categorias.length > 0 && (
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {p.categorias.slice(0, 2).map(cat => (
                      <span
                        key={cat.id}
                        className="bg-brand/90 text-white text-[9px] font-black uppercase italic px-2 py-0.5 rounded-full"
                      >
                        {cat.nombre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col p-4">
                <h3
                  className="font-black text-white text-lg leading-tight cursor-pointer hover:text-canvas transition-colors"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  {p.nombre}
                </h3>
                {p.descripcion && (
                  <p className="text-white/60 text-sm mt-1 line-clamp-2">{p.descripcion}</p>
                )}

                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-2xl font-black text-canvas italic">
                    ${p.precio_base?.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary flex items-center gap-1 text-xs px-3 py-2"
                      onClick={() => navigate(`/products/${p.id}`)}
                    >
                      <Eye className="w-3 h-3" />
                      Ver
                    </button>
                    <button
                      className="btn-primary flex items-center gap-1 text-xs px-3 py-2"
                      disabled={!p.disponible || p.stock_cantidad === 0}
                      onClick={() => addItem(p, 1)}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
