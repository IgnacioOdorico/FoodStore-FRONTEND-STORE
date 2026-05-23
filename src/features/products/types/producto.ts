export interface Categoria {
  id: number;
  nombre: string;
  es_principal?: boolean;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  es_alergeno: boolean;
  es_removible?: boolean;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
}
