import { create } from 'zustand';
import type { Producto } from '../../products/types/producto';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clear: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (producto, cantidad = 1) => {
    const items = get().items.slice();
    const found = items.find(i => i.producto.id === producto.id);
    if (found) {
      found.cantidad += cantidad;
    } else {
      items.push({ producto, cantidad });
    }
    set({ items });
  },
  removeItem: (productoId) => {
    set({ items: get().items.filter(i => i.producto.id !== productoId) });
  },
  updateQuantity: (productoId, cantidad) => {
    const items = get().items.slice();
    const found = items.find(i => i.producto.id === productoId);
    if (found) {
      found.cantidad = Math.max(0, cantidad);
      if (found.cantidad === 0) {
        set({ items: items.filter(i => i.producto.id !== productoId) });
        return;
      }
    }
    set({ items });
  },
  clear: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((acc, it) => acc + it.producto.precio_base * it.cantidad, 0);
  },
}));
