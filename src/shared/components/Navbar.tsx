import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingCart, ClipboardList, User, LogOut, UtensilsCrossed, Settings, Search, Wifi, WifiOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../features/cart/store/useCartStore';

export const Navbar: React.FC = () => {
  const { user, logout, isCheckingAuth} = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [searchParams] = useSearchParams();

  const itemCount = useCartStore(
    (state) => state.items.reduce((acc, i) => acc + i.cantidad, 0),
  );

  // Sincroniza el input con el param ?q= de la URL
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '');
  }, [location.pathname, searchParams]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      navigate(`/products?q=${encodeURIComponent(value.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/80 backdrop-blur-md shadow-sm border-b border-[#e5beb5]/60">
      <nav className="flex items-center justify-between h-16 max-w-[1280px] mx-auto px-10">

        {/* ── Brand + Search ── */}
        <div className="flex items-center gap-6">
          <Link to="/products" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#b22300] rounded-lg flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-[#b22300] tracking-tight">
              FoodStore
            </span>
          </Link>

          {/* Search Bar — solo desktop, siguiendo diseño Stitch */}
          <div className="hidden md:flex items-center bg-[#ffe9e4] rounded-full px-4 py-2 w-72 group transition-all focus-within:ring-2 focus-within:ring-[#b22300]/20">
            <Search className="w-4 h-4 text-[#5c403a] mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent border-none focus:ring-0 text-sm text-[#281814] placeholder:text-[#5c403a]/50 w-full outline-none"
            />
          </div>
        </div>

        {/* ── Nav links ── */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-widest transition-colors h-16 flex items-center border-b-2 ${
                isActive
                  ? 'text-[#b22300] border-[#b22300]'
                  : 'text-[#5c403a] border-transparent hover:text-[#b22300]'
              }`
            }
          >
            Productos
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-widest transition-colors h-16 flex items-center border-b-2 ${
                isActive
                  ? 'text-[#b22300] border-[#b22300]'
                  : 'text-[#5c403a] border-transparent hover:text-[#b22300]'
              }`
            }
          >
            Mis Pedidos
          </NavLink>
        </div>

        {/* ── Acciones ── */}
        <div className="flex items-center gap-2">
          {/* Carrito */}
          <Link
            to="/cart"
            className="relative p-2 text-[#5c403a] hover:bg-[#ffe9e4] rounded-full transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#b22300] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Pedidos (mobile) */}
          <NavLink
            to="/orders"
            className="md:hidden p-2 text-[#5c403a] hover:bg-[#ffe9e4] rounded-full transition-all"
          >
            <ClipboardList className="w-5 h-5" />
          </NavLink>

          {/* Usuario */}
          {isCheckingAuth ? (
            <div className="w-8 h-8 ml-2 rounded-full border-2 border-[#b22300]/20 border-t-[#b22300] animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#ffe9e4] rounded-full hover:bg-[#fadcd5] transition-all"
                title="Mi Perfil"
              >
                <div className="w-6 h-6 rounded-full bg-[#b22300] flex items-center justify-center">
                  <span className="text-white text-[10px] font-black uppercase">
                    {user.nombre[0]}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#281814]">{user.nombre}</span>
              </Link>

              <Link
                to="/profile"
                className="p-2 text-[#5c403a] hover:bg-[#ffe9e4] rounded-full transition-all"
                title="Configuración"
              >
                <Settings className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-[#5c403a] hover:bg-[#ffe9e4] rounded-full transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#b22300] text-white text-xs font-bold rounded-lg hover:bg-[#da3711] transition-all"
            >
              <User className="w-3.5 h-3.5" />
              Ingresar
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};
