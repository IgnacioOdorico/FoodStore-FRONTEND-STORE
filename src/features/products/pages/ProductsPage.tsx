import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { apiClient } from '../../../shared/services/api';
import { LoadingState, ErrorState, EmptyState } from '../../../shared/ui/States';
import { useCartStore } from '../../cart/store/useCartStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import type { Producto } from '../types/producto';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';

export const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const resetPagination = () => setPage(1);

  const scrollToProducts = () => {
    setTimeout(() => {
      document.getElementById('productos-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Trae TODAS las categorías de una (sin paginación) para pills y hero filters
  const { data: allCategorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () =>
      apiClient
        .get<{ id: number; nombre: string }[]>('/categorias/')
        .then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const allCategories: string[] = allCategorias?.map((c) => c.nombre) ?? [];

  const querySize = categoriaId ? 100 : PAGE_SIZE;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', page, categoriaId],
    queryFn: () => productsService.getAll({ page, size: querySize }),
  });

  const allItems = data?.items ?? [];
  const total = data?.total ?? 0;

  const products = !categoriaId
    ? allItems
    : allItems.filter((p) =>
      (p.categorias || []).some((c) => c.id === categoriaId),
    );

  const totalPages = categoriaId ? 1 : Math.ceil(total / PAGE_SIZE);

  const debouncedSearch = useDebounce(search, 400);

  const filtered = !debouncedSearch
    ? products
    : products.filter((p) => p.nombre.toLowerCase().includes(debouncedSearch.toLowerCase()));

  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  // ── Handlers ──

  const handleCategoryClick = (keyword: string) => {
    const cat = allCategorias?.find((c) =>
      c.nombre.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (cat) {
      setCategoriaId(cat.id);
      setSelectedCategory(cat.nombre);
    } else {
      setCategoriaId(undefined);
      setSelectedCategory(keyword);
    }
    resetPagination();
    scrollToProducts();
  };

  const handlePillClick = (catName: string) => {
    if (catName === selectedCategory) {
      setSelectedCategory('');
      setCategoriaId(undefined);
    } else {
      const cat = allCategorias?.find((c) => c.nombre === catName);
      setCategoriaId(cat?.id);
      setSelectedCategory(catName);
    }
    resetPagination();
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setCategoriaId(undefined);
    resetPagination();
  };

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  // Empty state que distingue si hay filtro activo o posta no hay productos
  if (!data || (products.length === 0 && !categoriaId))
    return <EmptyState message="No hay productos disponibles" />;

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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                  scrollToProducts();
                }}
                className="bg-white text-[#b22300] font-bold px-6 py-3 rounded-lg w-fit text-sm hover:bg-[#fff0ed] active:scale-95 transition-all"
              >
                Explorar catálogo
              </button>
            </div>
          </div>

          {/* Mini cards */}
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <div
              className="relative overflow-hidden rounded-xl bg-[#dae2fd] group cursor-pointer h-[130px]"
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('Postre');
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h2 className="text-[#131b2e] font-black text-xl group-hover:scale-105 origin-left transition-transform">Postres & Dulces</h2>
                <p className="text-[#131b2e]/70 text-sm">Repostería artesanal</p>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-xl bg-[#cce5ff] group cursor-pointer h-[130px]"
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('Ensalada');
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h2 className="text-[#001e31] font-black text-xl group-hover:scale-105 origin-left transition-transform">Bowls Saludables</h2>
                <p className="text-[#001e31]/70 text-sm">Directo del campo</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Header de la grilla ── */}
        <div id="productos-section" className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 scroll-mt-24">
          <div>
            <h2 className="text-[#281814] font-black text-3xl tracking-tight">Productos Frescos</h2>
            <p className="text-[#5c403a] text-sm mt-1">Selección especial para vos</p>
          </div>

        </div>

        {/* ── Pills de categoría ── */}
        {allCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            <button
              onClick={clearAllFilters}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === ''
                ? 'bg-[#b22300] text-white'
                : 'bg-[#ffe9e4] text-[#5c403a] hover:bg-[#ffe2db]'
                }`}
            >
              Todos
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handlePillClick(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
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
        {isLoading ? (
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </section>
        ) : filtered.length === 0 ? (
          <EmptyState message={
            categoriaId
              ? `No hay productos de "${selectedCategory}" por el momento.`
              : 'No se encontraron productos con ese criterio'
          } />
        ) : (
          <>
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

            {/* ── Paginación ── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg text-sm font-bold border border-[#e5beb5] text-[#5c403a] hover:bg-[#ffe9e4] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${p === page
                      ? 'bg-[#b22300] text-white'
                      : 'border border-[#e5beb5] text-[#5c403a] hover:bg-[#ffe9e4]'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg text-sm font-bold border border-[#e5beb5] text-[#5c403a] hover:bg-[#ffe9e4] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
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
            src={p.imagenes_url[0].includes('/upload/')
              ? p.imagenes_url[0].replace('/upload/', '/upload/f_auto,q_auto,c_fill,w_400,h_400/')
              : p.imagenes_url[0]}
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
