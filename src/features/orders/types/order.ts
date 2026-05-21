export type OrderStatus = 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';

// Mapeo de estado_codigo del backend a OrderStatus del frontend
export type OrderStatusCode = OrderStatus;

export interface OrderItem {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  subtotal_snap: number;
  personalizacion?: number[] | null;
  created_at: string;
}

export interface Order {
  id: number;
  usuario_id: number;
  direccion_id?: number | null;
  estado_codigo: OrderStatus;
  forma_pago_codigo: string;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  notas?: string | null;
  created_at: string;
  updated_at: string;
  detalles: OrderItem[];
}

export interface CreateOrderPayload {
  detalles: { producto_id: number; cantidad: number }[];
  forma_pago_codigo: string;
  notas?: string | null;
  descuento?: number;
  costo_envio?: number;
}
