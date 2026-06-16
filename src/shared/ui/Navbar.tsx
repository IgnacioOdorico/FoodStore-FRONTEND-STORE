import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../features/cart/store/useCartStore';

export const Navbar: React.FC = () => {
  const itemCount = useCartStore(state =>
    state.items.reduce((acc, i) => acc + i.cantidad, 0)
  );
  const navigate = useNavigate();

  return (
    <>
      <header
        className="flex justify-between items-center px-5 h-16 w-full fixed top-0 z-50 shadow-sm transition-all duration-200"
        style={{ backgroundColor: '#b22300' }}
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/products')}>
          <span
            className="text-2xl font-black italic uppercase tracking-tighter text-white"
          >
            FOODSTORE
          </span>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 rounded-t-xl md:hidden"
        style={{
          backgroundColor: '#ffe9e4',
          boxShadow: '0 -4px 12px rgba(130,81,58,0.08)',
        }}
      >
        <BottomNavItem to="/products" icon="restaurant_menu" label="Menú" />
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-full px-8 py-1.5 transition-all duration-150 ${
              isActive ? 'scale-95' : ''
            }`
          }
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#ffe9e4' : 'transparent',
            color: isActive ? '#281814' : '#907068',
          })}
        >
          <div className="relative">
            <span className="material-symbols-outlined fill-icon text-2xl mb-1">shopping_cart</span>
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-2 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#ba1a1a', color: '#ffffff' }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-[12px] font-extrabold tracking-wide uppercase leading-none">Carrito</span>
        </NavLink>
        <BottomNavItem to="/orders" icon="history" label="Mis Pedidos" />
      </nav>
    </>
  );
};

const BottomNavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center rounded-full px-4 py-2 transition-all duration-150 ${isActive ? 'scale-95' : ''}`
    }
    style={({ isActive }) => ({
      backgroundColor: isActive ? '#ffe9e4' : 'transparent',
      color: isActive ? '#281814' : '#907068',
      paddingLeft: isActive ? '2rem' : '1rem',
      paddingRight: isActive ? '2rem' : '1rem',
    })}
  >
    {({ isActive }) => (
      <>
        <span className={`material-symbols-outlined text-2xl mb-1 ${isActive ? 'fill-icon' : ''}`}>{icon}</span>
        <span className="text-[12px] font-extrabold tracking-wide uppercase leading-none">{label}</span>
      </>
    )}
  </NavLink>
);

