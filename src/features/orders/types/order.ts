export type OrderStatus = 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';

export interface OrderItem {
  id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  producto?: { nombre: string; imagenes_url?: string[] };
}

export interface Order {
  id: number;
  estado: OrderStatus;
  metodo_pago: string;
  notas?: string | null;
  created_at: string;
  items: OrderItem[];
  total?: number;
}
