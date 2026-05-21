export type OrderStatus =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREP'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface OrderItem {
  id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  nombre_snapshot?: string;                 
  producto?: { nombre: string; imagenes_url?: string[] };
}

export interface Order {
  id: number;
  estado: OrderStatus;
  forma_pago: string;                   
  notas?: string | null;
  created_at: string;
  items: OrderItem[];
  total?: number;
  direccion_entrega_id?: number | null;
}

// Payload para crear un pedido desde el carrito
export interface CreateOrderPayload {
  forma_pago: string;
  notas?: string | null;
  direccion_entrega_id?: number | null;
  items: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}
