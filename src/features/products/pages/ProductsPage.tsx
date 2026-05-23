import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { LoadingState, ErrorState, EmptyState } from '../../../shared/ui/States';
import { useCartStore } from '../../cart/store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye } from 'lucide-react';
import type { Producto } from '../types/producto';

export const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });

  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!products || products.length === 0)
    return <EmptyState message="No hay productos disponibles" />;

  const allCategories: string[] = Array.from(
    new Set(
      (products as Producto[]).flatMap((p) =>
        (p.categorias || []).map((c) => c.nombre),
      ),
    ),
  );

  const filtered = (products as Producto[]).filter((p) => {
    const matchSearch =
      !search || p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      !selectedCategory ||
      (p.categorias || []).some((c) => c.nombre === selectedCategory);
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="pt-20 pb-16 max-w-[1280px] mx-auto px-4 md:px-10">

        {/* ── Hero / Bento ── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          {/* Hero principal */}
          <div className="md:col-span-8 relative overflow-hidden rounded-xl bg-[#da3711] h-[280px] md:h-[360px] group cursor-pointer"
               onClick={() => navigate('/products')}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#b22300] to-[#da3711]" />
            <div className="absolute inset-0 opacity-20"
                 style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)' }} />
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <span className="bg-white text-[#b22300] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-3">
                Selección del Editor
              </span>
              <h1 className="text-white font-black text-3xl md:text-5xl max-w-md leading-tight tracking-tight mb-3">
                La Mejor Experiencia Gourmet
              </h1>
              <p className="text-white/80 text-sm mb-5 max-w-sm">
                Ingredientes frescos, recetas artesanales, en tu puerta.
              </p>
              <button className="bg-white text-[#b22300] font-bold px-6 py-3 rounded-lg w-fit text-sm hover:bg-[#fff0ed] active:scale-95 transition-all">
                Explorar catálogo
              </button>
            </div>
          </div>

          {/* Mini cards */}
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <div className="relative overflow-hidden rounded-xl bg-[#dae2fd] group cursor-pointer h-[130px]">
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h2 className="text-[#131b2e] font-black text-xl">Postres & Dulces</h2>
                <p className="text-[#131b2e]/70 text-sm">Repostería artesanal</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-[#cce5ff] group cursor-pointer h-[130px]">
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h2 className="text-[#001e31] font-black text-xl">Bowls Saludables</h2>
                <p className="text-[#001e31]/70 text-sm">Directo del campo</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Header de la grilla ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6">
          <div>
            <h2 className="text-[#281814] font-black text-3xl tracking-tight">Productos Frescos</h2>
            <p className="text-[#5c403a] text-sm mt-1">Selección especial para vos</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c403a]/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="pl-9 pr-4 py-2 bg-white border border-[#e5beb5] rounded-full text-sm text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] w-52 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Pills de categoría ── */}
        {allCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === ''
                  ? 'bg-[#b22300] text-white'
                  : 'bg-[#ffe9e4] text-[#5c403a] hover:bg-[#ffe2db]'
              }`}
            >
              Todos
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#b22300] text-white'
                    : 'bg-[#ffe9e4] text-[#5c403a] hover:bg-[#ffe2db]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Grid de productos ── */}
        {filtered.length === 0 ? (
          <EmptyState message="No se encontraron productos con ese criterio" />
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p: Producto) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={() => navigate(`/products/${p.id}`)}
                onAdd={() => addItem(p, 1)}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

/* ── Componente de card de producto ── */
const ProductCard: React.FC<{
  product: Producto;
  onView: () => void;
  onAdd: () => void;
}> = ({ product: p, onView, onAdd }) => {
  const outOfStock = !p.disponible || p.stock_cantidad === 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#e5beb5]/30 shadow-[0_4px_20px_rgba(15,23,42,0.08)] flex flex-col group hover:-translate-y-1 transition-all duration-300">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={onView}>
        {p.imagenes_url?.[0] ? (
          <img
            src={p.imagenes_url[0]}
            alt={p.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#ffe9e4] flex items-center justify-center">
            <span className="text-[#b22300]/30 text-xs font-bold uppercase">Sin imagen</span>
          </div>
        )}

        {/* Badge sin stock */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-[#ba1a1a] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
              Sin Stock
            </span>
          </div>
        )}

        {/* Badge "Nuevo" o categoría */}
        {p.categorias && p.categorias.length > 0 && !outOfStock && (
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur-sm text-[#b22300] text-[9px] font-black uppercase px-2 py-0.5 rounded">
              {p.categorias[0].nombre}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        {p.categorias && p.categorias.length > 0 && (
          <span className="text-[#006192] text-[11px] font-bold uppercase tracking-widest mb-1">
            {p.categorias.map((c) => c.nombre).join(' · ')}
          </span>
        )}

        <h3
          className="font-semibold text-[#281814] text-base leading-snug cursor-pointer hover:text-[#b22300] transition-colors line-clamp-2"
          onClick={onView}
        >
          {p.nombre}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-[#b22300] font-black text-lg">
            ${p.precio_base?.toLocaleString('es-AR')}
          </span>

          <div className="flex gap-1.5">
            <button
              onClick={onView}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e5beb5] text-[#5c403a] hover:bg-[#fff0ed] transition-all"
              title="Ver detalle"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onAdd}
              disabled={outOfStock}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#b22300] text-white hover:bg-[#da3711] active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Agregar al carrito"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
