// Roles definidos en el backend v6:
// ADMIN   -> CRUD completo de todo el sistema
// STOCK   -> Leer productos, actualizar stock y disponibilidad
// PEDIDOS -> Ver y avanzar estados de pedidos (cajero)
// CLIENT  -> Catálogo, carrito, pedidos propios 
export type IRole = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT';

export interface IUser {
  id: number;
  nombre: string;      
  email: string;
  roles: IRole[];      // un usuario puede tener más de un rol
}
