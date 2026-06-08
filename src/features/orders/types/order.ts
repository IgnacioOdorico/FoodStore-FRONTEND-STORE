import type { Direccion } from '../../../shared/services/direcciones';

export type OrderStatus =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREP'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface OrderItem {
  pedido_id?: number;
  producto_id: number;
  cantidad: number;
  nombre_snapshot: string;
  precio_snapshot: number;      
  subtotal_snap?: number;
  personalizacion?: number[] | null;
  created_at?: string;
}

export interface HistorialEntry {
  id: number;
  estado_desde: string | null;
  estado_hacia: string;
  usuario_id: number | null;
  motivo: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  usuario_id?: number;
  estado_codigo: OrderStatus;    
  forma_pago_codigo: string;     
  notas?: string | null;
  created_at: string;
  updated_at?: string;
  detalles: OrderItem[];        
  total: number;
  subtotal?: number;
  descuento?: number;
  costo_envio?: number;
  direccion_id?: number | null;
  direccion?: Direccion | null;
  historial?: HistorialEntry[];
}

export interface CreateOrderPayload {
  forma_pago_codigo: string;
  notas?: string | null;
  direccion_id?: number | null;
  detalles: {
    producto_id: number;
    cantidad: number;
    personalizacion?: number[];
  }[];
  descuento?: number;
  costo_envio?: number;
}
