import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, ShieldCheck, Bell, ChevronRight, LogOut, Clock, Lock,
} from 'lucide-react';

const ROLE_STYLE: Record<string, string> = {
  ADMIN:    'bg-[#ffdad2] text-[#8b1900]',
  STOCK:    'bg-[#dae2fd] text-[#3f465c]',
  PEDIDOS:  'bg-[#cce5ff] text-[#004b72]',
  CLIENT:   'bg-[#d1fae5] text-[#065f46]',
};

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 ${
      checked ? 'bg-[#b22300]' : 'bg-[#e5beb5]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Preferences state
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifPedidos, setNotifPedidos] = useState(true);
  const [dataShare,    setDataShare]    = useState(false);

  // Save feedback state
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  if (!user) return null;

  const initials = user.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = () => {
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    }, 800);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="pt-20 pb-16 max-w-[1280px] mx-auto px-4 md:px-10">

        {/* ── Page header ── */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#281814]">
              Mi Perfil
            </h1>
            <p className="text-base text-[#5c403a] mt-1">
              Gestioná tu cuenta y preferencias personales.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 h-10 border border-[#907068] text-[#281814] font-semibold text-sm rounded-lg hover:bg-[#fff0ed] transition-colors active:scale-95"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className={`px-6 h-10 font-semibold text-sm rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-60 ${
                saveState === 'saved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#b22300] text-white hover:bg-[#da3711]'
              }`}
            >
              {saveState === 'saving' ? 'Guardando...' : saveState === 'saved' ? 'Guardado!' : 'Guardar Cambios'}
            </button>
          </div>
        </header>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-12 gap-4">

          {/* ── Avatar card (4 cols) ── */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-6 border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)] flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="relative group cursor-pointer mb-6">
              <div className="w-36 h-36 rounded-full bg-[#b22300] flex items-center justify-center border-4 border-[#ffdad2] shadow-lg shadow-[#b22300]/15">
                <span className="text-white font-black text-4xl tracking-tight select-none">
                  {initials}
                </span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#281814]/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Name + email */}
            <h2 className="text-2xl font-bold text-[#281814] mb-1">{user.nombre}</h2>
            <p className="text-sm text-[#5c403a] mb-4">{user.email}</p>

            {/* Role badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {user.roles.map((r) => (
                <span
                  key={r}
                  className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${ROLE_STYLE[r] ?? 'bg-[#ffe9e4] text-[#b22300]'}`}
                >
                  {r}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                className="w-full py-2.5 bg-[#ffdad2] text-[#8b1900] font-semibold text-sm rounded-lg hover:bg-[#ffb4a3] transition-colors"
              >
                Cambiar foto
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 text-[#ba1a1a] font-semibold text-sm rounded-lg hover:bg-[#ffdad6] transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesion
              </button>
            </div>
          </div>

          {/* ── Personal info card (8 cols) ── */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-6 border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)]">

            {/* Section header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e5beb5]">
              <User className="w-5 h-5 text-[#b22300]" />
              <h3 className="text-lg font-semibold text-[#281814]">Informacion Personal</h3>
            </div>

            <div className="space-y-6">
              {/* Nombre + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    defaultValue={user.nombre}
                    className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                    Correo electronico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#907068]" />
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full h-12 pl-10 pr-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Roles (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                  Roles asignados
                </label>
                <div className="w-full h-12 px-4 bg-[#fadcd5]/40 border border-[#e5beb5] rounded-lg flex items-center justify-between">
                  <span className="text-[#5c403a] text-base">
                    {user.roles.join(', ')}
                  </span>
                  <Lock className="w-4 h-4 text-[#907068]/50" />
                </div>
                <p className="text-[11px] text-[#907068] italic mt-0.5">
                  Campo de solo lectura. Contacta al administrador para modificar tus roles.
                </p>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                  Sobre mi
                </label>
                <textarea
                  rows={3}
                  placeholder="Contanos algo sobre vos..."
                  className="w-full p-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Security tile (6 cols) ── */}
          <div className="col-span-12 md:col-span-6 bg-[#ffe9e4] rounded-xl p-6 border border-[#e5beb5] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#b22300]/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#b22300]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#281814]">Seguridad de la cuenta</h4>
                <p className="text-sm text-[#5c403a]">Cambia tu contrasena cuando quieras</p>
              </div>
            </div>
            <button className="p-2 hover:bg-white rounded-full transition-colors flex-shrink-0">
              <ChevronRight className="w-5 h-5 text-[#5c403a]" />
            </button>
          </div>

          {/* ── Recent activity tile (6 cols) ── */}
          <div className="col-span-12 md:col-span-6 bg-[#cce5ff] rounded-xl p-6 border border-[#e5beb5] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#006192]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#006192]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#001e31]">Actividad reciente</h4>
                <p className="text-sm text-[#004b72]">Ultimo acceso: hoy</p>
              </div>
            </div>
            <button className="p-2 hover:bg-white rounded-full transition-colors flex-shrink-0">
              <ChevronRight className="w-5 h-5 text-[#004b72]" />
            </button>
          </div>
        </div>

        {/* ── Preferences section ── */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold text-[#281814] mb-4">Preferencias</h3>

          <div className="bg-white rounded-xl border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)] divide-y divide-[#e5beb5]/60">

            {/* Notificaciones email */}
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <Bell className="w-5 h-5 text-[#b22300] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#281814]">Notificaciones por email</p>
                  <p className="text-sm text-[#5c403a] mt-0.5">
                    Recibe actualizaciones sobre el estado de tus pedidos.
                  </p>
                </div>
              </div>
              <Toggle checked={notifEmail} onChange={() => setNotifEmail((v) => !v)} />
            </div>

            {/* Notificaciones pedidos */}
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <Bell className="w-5 h-5 text-[#b22300] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#281814]">Alertas de pedidos</p>
                  <p className="text-sm text-[#5c403a] mt-0.5">
                    Te avisamos cuando tu pedido cambia de estado.
                  </p>
                </div>
              </div>
              <Toggle checked={notifPedidos} onChange={() => setNotifPedidos((v) => !v)} />
            </div>

            {/* Datos anonimos */}
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[#b22300] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#281814]">Datos de uso anonimos</p>
                  <p className="text-sm text-[#5c403a] mt-0.5">
                    Compartir estadisticas anonimas para mejorar la experiencia.
                  </p>
                </div>
              </div>
              <Toggle checked={dataShare} onChange={() => setDataShare((v) => !v)} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
