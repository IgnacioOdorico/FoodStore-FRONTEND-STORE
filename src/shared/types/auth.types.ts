// Roles definidos en el backend v6:
// ADMIN   -> CRUD completo de todo el sistema
// STOCK   -> Leer productos, actualizar stock y disponibilidad
// PEDIDOS -> Ver y avanzar estados de pedidos (cajero)
// CLIENT  -> Catalogo, carrito, pedidos propios
export type IRole = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT';

export interface IUser {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  celular?: string;
  roles: IRole[];      // un usuario puede tener mas de un rol
  created_at?: string;
}
