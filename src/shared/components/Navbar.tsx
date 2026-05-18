import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBasket, ShoppingCart, User, LogOut, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../features/cart/store/useCartStore';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const itemCount = useCartStore(state => state.items.reduce((acc, i) => acc + i.cantidad, 0));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-brand shadow-xl border-b-4 border-cocoa">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <Link to="/products" className="flex items-center gap-3">
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
              FoodStore
            </span>
          </Link>

          <div className="flex items-center gap-1 p-1 bg-black/10 rounded-2xl border-2 border-white/5 backdrop-blur-md">
            <NavItem to="/products" icon={<ShoppingBasket className="w-4 h-4" />} label="Productos" />
            <NavLink
              to="/cart"
              className={({ isActive }) => `
                relative flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase italic tracking-widest text-[10px] transition-all duration-300
                ${isActive ? 'bg-white text-brand shadow-lg scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              <ShoppingCart className="w-4 h-4" />
              Carrito
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </NavLink>
            <NavItem to="/orders" icon={<ClipboardList className="w-4 h-4" />} label="Mis Pedidos" />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-white/70 text-sm font-semibold">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  <LogOut className="w-3 h-3" />
                  Salir
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200"
              >
                <User className="w-3 h-3" />
                Ingresar
              </NavLink>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase italic tracking-widest text-[10px] transition-all duration-300
      ${isActive ? 'bg-white text-brand shadow-lg scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'}
    `}
  >
    {icon}
    {label}
  </NavLink>
);
