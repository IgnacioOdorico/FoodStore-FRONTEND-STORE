import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { LoadingState, ErrorState } from '../../../shared/ui/States';
import { ArrowLeft, ShoppingBag, Minus, Plus, AlertTriangle, Tags, Info } from 'lucide-react';
import { useCartStore } from '../../cart/store/useCartStore';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="No se pudo cargar el producto." />;
  if (!product) return <ErrorState message="El producto no existe." />;

  const outOfStock = !product.disponible || product.stock_cantidad === 0;
  const hasAllergens = product.ingredientes?.some((i: any) => i.es_alergeno);

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="pt-20 pb-16 max-w-[1280px] mx-auto px-4 md:px-10">

        {/* Volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-[#5c403a] hover:text-[#b22300] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>

        {/* ── Layout principal ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">

          {/* Imagen — columna izquierda */}
          <div className="md:col-span-7 lg:col-span-8 relative rounded-xl overflow-hidden shadow-sm">
            <div className="aspect-square md:aspect-video">
              <img
                src={
                  product.imagenes_url?.[0] ||
                  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'
                }
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            {outOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-[#ba1a1a] text-white px-8 py-3 rounded-full font-black uppercase text-sm tracking-wider">
                  Sin Stock
                </span>
              </div>
            )}

            {/* Badge alérgeno */}
            {hasAllergens && (
              <div className="absolute top-4 left-4">
                <span className="flex items-center gap-1.5 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  Contiene Alérgenos
                </span>
              </div>
            )}
          </div>

          {/* Info — columna derecha */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-center gap-6">

            {/* Categorías */}
            {product.categorias && product.categorias.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categorias.map((cat: any) => (
                  <span
                    key={cat.id}
                    className="bg-[#ffe9e4] text-[#b22300] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                  >
                    {cat.nombre}
                  </span>
                ))}
              </div>
            )}

            {/* Título */}
            <h1 className="text-[#281814] font-black text-3xl md:text-4xl leading-tight tracking-tight">
              {product.nombre}
            </h1>

            {/* Descripción */}
            {product.descripcion && (
              <p className="text-[#5c403a] text-base leading-relaxed">
                {product.descripcion}
              </p>
            )}

            {/* Precio + disponibilidad */}
            <div className="flex items-baseline gap-3">
              <span className="text-[#b22300] font-black text-5xl tracking-tight">
                ${product.precio_base?.toLocaleString('es-AR')}
              </span>
              {product.stock_cantidad > 0 ? (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {product.stock_cantidad} disponibles
                </span>
              ) : (
                <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-1 rounded-full">
                  Agotado
                </span>
              )}
            </div>

            {/* Qty + Agregar */}
            <div className="flex items-center gap-4">
              {/* Control de cantidad */}
              <div className="flex items-center border-2 border-[#e5beb5] rounded-xl p-1 gap-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={outOfStock}
                  className="w-10 h-10 flex items-center justify-center text-[#b22300] hover:bg-[#ffe9e4] rounded-lg transition-colors disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-black text-[#281814] text-lg select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={outOfStock}
                  className="w-10 h-10 flex items-center justify-center text-[#b22300] hover:bg-[#ffe9e4] rounded-lg transition-colors disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Botón agregar */}
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="flex-1 h-14 bg-[#b22300] text-white font-bold rounded-xl hover:bg-[#da3711] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#b22300]/20 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {outOfStock ? 'Sin Stock' : `AGREGAR${quantity > 1 ? ` (${quantity})` : ''} AL CARRITO`}
              </button>
            </div>
          </div>
        </div>

        {/* ── Ingredientes + Alérgenos ── */}
        {product.ingredientes && product.ingredientes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

            {/* Card ingredientes */}
            <div className="md:col-span-2 bg-[#fff0ed] rounded-2xl p-8 border border-[#e5beb5]">
              <div className="flex items-center gap-3 mb-6">
                <Tags className="w-5 h-5 text-[#b22300]" />
                <h3 className="font-bold text-[#281814] text-lg">Ingredientes</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.ingredientes.map((ing: any) => (
                  <div
                    key={ing.id}
                    className={`flex flex-col items-center p-4 rounded-xl text-center border transition-all ${
                      ing.es_alergeno
                        ? 'bg-[#ffdad6] border-[#ba1a1a]/20 text-[#ba1a1a]'
                        : 'bg-white border-[#e5beb5] text-[#281814]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm mb-2 ${
                      ing.es_alergeno ? 'bg-[#ba1a1a] text-white' : 'bg-[#ffe9e4] text-[#b22300]'
                    }`}>
                      {ing.nombre[0].toUpperCase()}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">
                      {ing.nombre}
                    </span>
                    {ing.es_alergeno && (
                      <span className="text-[9px] font-bold mt-0.5 opacity-70">Alérgeno</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Card alérgenos / info nutricional */}
            <div className="bg-[#b22300] text-white rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Info className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Información</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-sm opacity-80">Precio unitario</span>
                    <span className="font-black">${product.precio_base?.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-sm opacity-80">Stock</span>
                    <span className="font-black">{product.stock_cantidad} u.</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-sm opacity-80">Disponible</span>
                    <span className="font-black">{product.disponible ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              </div>
              {hasAllergens && (
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-80">
                  <AlertTriangle className="w-4 h-4" />
                  Contiene alérgenos
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
