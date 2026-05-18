import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { LoadingState, ErrorState } from '../../../shared/ui/States';
import { Button } from '../../../shared/ui/Button';
import { ArrowLeft, ShoppingCart, Info, Tags, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../cart/store/useCartStore';

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
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        className="mb-8 group border-2 border-cocoa/10 hover:border-cocoa/40"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Volver al listado
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        <div className="relative group">
          <div className="absolute -inset-4 bg-cocoa/10 rounded-[3rem] blur-2xl group-hover:bg-cocoa/20 transition-all duration-700" />
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
            <img
              src={product.imagenes_url?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591'}
              alt={product.nombre}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase italic tracking-widest shadow-2xl border-2 border-white/20">
                  Sin Stock
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.ingredientes?.some((ing: any) => ing.es_alergeno) && (
                <span className="bg-red-600 text-white text-[10px] font-black uppercase italic tracking-widest px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Contiene Alérgenos
                </span>
              )}
            </div>
            <h1 className="text-5xl font-black text-brand-active uppercase italic tracking-tighter leading-none mb-4">
              {product.nombre}
            </h1>
            <p className="text-cocoa font-bold text-base italic leading-relaxed opacity-80">
              {product.descripcion || 'Una receta artesanal guardada bajo llave por generaciones.'}
            </p>
          </div>

          <div className="flex items-center gap-6 p-6 bg-white/50 backdrop-blur-md rounded-[2rem] border-2 border-cocoa/10 shadow-lg">
            <div className="flex flex-col">
              <span className="text-cocoa/60 text-[10px] font-black uppercase tracking-widest italic mb-1">Precio Unitario</span>
              <span className="text-5xl font-black text-brand-active italic tracking-tighter">
                ${product.precio_base.toLocaleString()}
              </span>
            </div>
            <div className="w-px h-12 bg-cocoa/10" />
            <div className="flex flex-col">
              <span className="text-cocoa/60 text-[10px] font-black uppercase tracking-widest italic mb-1">Disponibilidad</span>
              <span className={`text-sm font-black uppercase italic ${product.stock_cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock_cantidad > 0 ? `${product.stock_cantidad} Unidades` : 'Agotado'}
              </span>
            </div>
          </div>

          {product.categorias && product.categorias.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-cocoa/40 text-[10px] font-black uppercase tracking-widest italic">
                <Tags className="w-3 h-3" /> Categorías
              </span>
              <div className="flex flex-wrap gap-2">
                {product.categorias.map((cat: any) => (
                  <span key={cat.id} className="bg-brand text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest shadow-md">
                    {cat.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.ingredientes && product.ingredientes.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-cocoa/40 text-[10px] font-black uppercase tracking-widest italic">
                <Info className="w-3 h-3" /> Ingredientes
              </span>
              <div className="grid grid-cols-2 gap-2">
                {product.ingredientes.map((ing: any) => (
                  <div
                    key={ing.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      ing.es_alergeno
                        ? 'bg-red-50 border-red-200 hover:border-red-400'
                        : 'bg-canvas/30 border-cocoa/10 hover:border-cocoa/30'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      ing.es_alergeno ? 'bg-red-600 text-white' : 'bg-brand text-white'
                    }`}>
                      {ing.nombre[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-black uppercase italic truncate ${
                        ing.es_alergeno ? 'text-red-700' : 'text-cocoa'
                      }`}>
                        {ing.nombre}
                      </span>
                      {ing.es_alergeno && (
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Alérgeno</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-white/20 rounded-2xl border-2 border-cocoa/20 p-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/30 text-cocoa font-black transition-all"
                disabled={outOfStock}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-black text-brand-active text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/30 text-cocoa font-black transition-all"
                disabled={outOfStock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {outOfStock ? 'Sin stock' : `Agregar ${quantity > 1 ? `(${quantity})` : ''} al carrito`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
