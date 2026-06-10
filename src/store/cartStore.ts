import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  producto_id: number;
  cantidad: number;
  personalizacion?: number[];
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (producto_id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.producto_id === item.producto_id);
        if (existing) {
          return {
            items: state.items.map(i => i.producto_id === item.producto_id 
              ? { ...i, cantidad: i.cantidad + item.cantidad, personalizacion: item.personalizacion } 
              : i)
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.producto_id !== id)
      })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'cart-storage'
    }
  )
);
