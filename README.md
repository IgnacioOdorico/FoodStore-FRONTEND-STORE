# FoodStore — Store App (Frontend)

---

## Tecnologías

| Herramienta | Versión | Propósito |
|---|---|---|
| React + TypeScript | 19 / 6 | UI |
| Vite | 8 | Bundler y dev server |
| React Router DOM | 7 | Navegación entre rutas |
| TanStack Query | 5 | Server state (fetching, caché, invalidación) |
| TanStack Table | 8 | Tablas con filtros (disponible para uso futuro) |
| TanStack Form | 1 | Formularios con validación |
| Axios | 1 | Cliente HTTP con instancia base e interceptores |
| Zustand | 5 | Estado global del cliente (carrito, sesión) |
| Tailwind CSS | 4 | Estilos utility-first |

---

## Requisitos previos

- Node.js 20+
- pnpm 9+ (o npm)
- Backend FoodStore corriendo en `http://localhost:8000`

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd FoodStore-FRONTEND-STORE

# 2. Instalar dependencias
pnpm install       # o: npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env si el backend corre en una URL distinta

# 4. Levantar el servidor de desarrollo
pnpm dev           # o: npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API (incluye `/api/v1`) | `http://localhost:8000/api/v1` |

---

## Estructura de carpetas

```
src/
├── features/               # Módulos por dominio
│   ├── auth/
│   │   ├── pages/          # LoginPage, ForbiddenPage
│   │   └── services/       # authService (login, me, logout)
│   ├── cart/
│   │   ├── pages/          # CartPage
│   │   └── store/          # useCartStore (Zustand + persist)
│   ├── categories/
│   │   ├── services/       # categoriesService
│   │   └── types/          # Categoria
│   ├── ingredients/
│   │   ├── services/       # ingredientsService
│   │   └── types/          # Ingrediente
│   ├── orders/
│   │   ├── pages/          # OrdersPage
│   │   ├── services/       # ordersService (getAll, create, cancel)
│   │   └── types/          # Order, OrderStatus, CreateOrderPayload
│   ├── products/
│   │   ├── components/     # ProductTable
│   │   ├── pages/          # ProductsPage, ProductDetailPage
│   │   ├── services/       # productsService
│   │   └── types/          # Producto
│   └── profile/
│       └── pages/          # ProfilePage
├── shared/
│   ├── components/         # Navbar
│   ├── services/           # api.ts — instancia Axios + interceptores
│   ├── types/              # auth.types.ts (IUser, IRole)
│   └── ui/                 # Button, Input, Modal, States
├── store/
│   └── useAuthStore.ts     # Zustand store de autenticación
├── router/
│   ├── AppRouter.tsx       # BrowserRouter + rutas
│   └── ProtectedRoute.tsx  # Guard por roles
└── main.tsx                # Punto de entrada
```

---

## Pantallas disponibles

| Ruta | Pantalla | Descripción |
|---|---|---|
| `/products` | Listado de Productos | Grid con foto, nombre, precio, categoría, búsqueda y filtro |
| `/products/:id` | Detalle de Producto | Descripción, ingredientes, alérgenos, cantidad + agregar al carrito |
| `/cart` | Carrito | Ítems, cantidades, total y confirmar pedido |
| `/orders` | Mis Pedidos | Historial de pedidos del cliente con estados y opción de cancelar |
| `/login` | Login | Autenticación con email + contraseña |

---

## Estado de servidor (TanStack Query)

```tsx
// Ejemplo: listar productos con useQuery
const { data, isLoading, isError } = useQuery({
  queryKey: ['products'],
  queryFn: productsService.getAll,
});

// Ejemplo: cancelar un pedido con useMutation + invalidación
const cancel = useMutation({
  mutationFn: (id: number) => ordersService.cancel(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
});
```

---

## Carrito persistente

El carrito usa el middleware `persist` de Zustand con `localStorage`. Al recargar la página, los ítems se restauran automáticamente desde la clave `foodstore-cart`.

---

## Axios — Instancia y Interceptores

`src/shared/services/api.ts` expone:
- **`apiClient`**: instancia Axios con `baseURL` desde `VITE_API_URL` y `withCredentials: true` para enviar la cookie JWT.
- **Interceptor de respuesta**: redirige automáticamente a `/login` en 401 y a `/forbidden` en 403.
- **`apiFetch`**: helper de compatibilidad que mantiene la firma usada por los servicios existentes.

---

## Video del Parcial
([https://www.youtube.com/watch?v=HCHS3oAsbC4](https://youtu.be/pKjKTs4ttKA))
