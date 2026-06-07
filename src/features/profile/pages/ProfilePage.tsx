import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/services/auth';
import {
  User, Mail, Phone, ShieldCheck, ChevronRight,
  LogOut, Clock, Lock, Eye, EyeOff, X,
} from 'lucide-react';
import { SeccionDirecciones } from '../components/SeccionDirecciones';

/* ── Modal de cambio de contraseña ── */
interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const [actual,    setActual]    = useState('');
  const [nuevo,     setNuevo]     = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNuevo,  setShowNuevo]  = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [error,  setError]  = useState('');

  const validate = (): string | null => {
    if (!actual.trim())      return 'Ingresá tu contraseña actual.';
    if (nuevo.length < 8)    return 'La nueva contraseña debe tener al menos 8 caracteres.';
    if (nuevo !== confirmar) return 'Las contraseñas no coinciden.';
    if (nuevo === actual)    return 'La nueva contraseña debe ser distinta a la actual.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError('');
    setStatus('saving');
    try {
      await authService.changePassword(actual, nuevo);
      setStatus('ok');
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'No se pudo cambiar la contraseña.');
      setStatus('error');
    }
  };

  const PasswordInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggleShow: () => void;
    autoComplete?: string;
  }> = ({ id, label, value, onChange, show, onToggleShow, autoComplete }) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#907068]" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => { onChange(e.target.value); setError(''); setStatus('idle'); }}
          autoComplete={autoComplete}
          className="w-full h-12 pl-10 pr-11 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#907068] hover:text-[#b22300] transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#281814]/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#b22300]/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#b22300]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#281814]">Cambiar Contraseña</h2>
              <p className="text-xs text-[#5c403a]">Ingresá tu contraseña actual para confirmar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5c403a] hover:bg-[#ffe9e4] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Éxito */}
        {status === 'ok' ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="font-bold text-[#281814] text-lg">¡Contraseña actualizada!</p>
            <p className="text-sm text-[#5c403a]">Tu contraseña fue cambiada correctamente.</p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#b22300] text-white font-bold rounded-lg hover:bg-[#da3711] transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordInput
              id="pwd-actual"
              label="Contraseña actual"
              value={actual}
              onChange={setActual}
              show={showActual}
              onToggleShow={() => setShowActual((v) => !v)}
              autoComplete="current-password"
            />
            <PasswordInput
              id="pwd-nuevo"
              label="Nueva contraseña"
              value={nuevo}
              onChange={setNuevo}
              show={showNuevo}
              onToggleShow={() => setShowNuevo((v) => !v)}
              autoComplete="new-password"
            />
            <PasswordInput
              id="pwd-confirmar"
              label="Confirmá la nueva contraseña"
              value={confirmar}
              onChange={setConfirmar}
              show={showConf}
              onToggleShow={() => setShowConf((v) => !v)}
              autoComplete="new-password"
            />

            {/* Reglas */}
            <p className="text-[11px] text-[#907068]">
              Mínimo 8 caracteres. Debe ser distinta a la contraseña actual.
            </p>

            {/* Error */}
            {error && (
              <p className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Acciones */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-[#907068] text-[#281814] font-semibold rounded-lg hover:bg-[#fff0ed] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={status === 'saving'}
                className="flex-1 py-3 bg-[#b22300] text-white font-bold rounded-lg hover:bg-[#da3711] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'saving' ? 'Guardando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ── ProfilePage ── */
export const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [nombre,   setNombre]   = useState(user?.nombre   ?? '');
  const [apellido, setApellido] = useState(user?.apellido ?? '');
  const [celular,  setCelular]  = useState(user?.celular  ?? '');

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');
  const [showPwdModal, setShowPwdModal] = useState(false);

  if (!user) return null;

  const fullName = `${nombre || user.nombre} ${apellido || user.apellido || ''}`.trim();
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setSaveState('saving');
    setSaveError('');
    try {
      await updateUser({
        nombre:   nombre.trim()   || undefined,
        apellido: apellido.trim() || undefined,
        celular:  celular.trim()  || undefined,
      });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (e: any) {
      setSaveError(e?.response?.data?.detail ?? 'No se pudieron guardar los cambios');
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      {showPwdModal && <ChangePasswordModal onClose={() => setShowPwdModal(false)} />}

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
          <div className="flex flex-col items-end gap-2">
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
                    : saveState === 'error'
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#b22300] text-white hover:bg-[#da3711]'
                }`}
              >
                {saveState === 'saving'
                  ? 'Guardando...'
                  : saveState === 'saved'
                    ? '¡Guardado!'
                    : saveState === 'error'
                      ? 'Error al guardar'
                      : 'Guardar Cambios'}
              </button>
            </div>
            {saveState === 'error' && saveError && (
              <p className="text-xs text-[#ba1a1a] font-semibold">{saveError}</p>
            )}
          </div>
        </header>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-12 gap-4">

          {/* ── Avatar card ── */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-6 border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)] flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-6">
              <div className="w-36 h-36 rounded-full bg-[#b22300] flex items-center justify-center border-4 border-[#ffdad2] shadow-lg shadow-[#b22300]/15">
                <span className="text-white font-black text-4xl tracking-tight select-none">
                  {initials}
                </span>
              </div>
              <div className="absolute inset-0 bg-[#281814]/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#281814] mb-1">{fullName}</h2>
            <p className="text-sm text-[#5c403a] mb-6">{user.email}</p>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 text-[#ba1a1a] font-semibold text-sm rounded-lg hover:bg-[#ffdad6] transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* ── Personal info card ── */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-6 border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e5beb5]">
              <User className="w-5 h-5 text-[#b22300]" />
              <h3 className="text-lg font-semibold text-[#281814]">Información Personal</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#907068]" />
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full h-12 pl-10 pr-10 bg-[#fadcd5]/40 border border-[#e5beb5] rounded-lg text-base text-[#5c403a] cursor-not-allowed"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#907068]/50" />
                </div>
                <p className="text-[11px] text-[#907068] italic mt-0.5">
                  El email no puede modificarse. Contactá al administrador si necesitás cambiarlo.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">
                  Celular
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#907068]" />
                  <input
                    type="tel"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="+54 11 1234-5678"
                    className="w-full h-12 pl-10 pr-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Security tile ── */}
          <button
            type="button"
            onClick={() => setShowPwdModal(true)}
            className="col-span-12 md:col-span-6 bg-[#ffe9e4] rounded-xl p-6 border border-[#e5beb5] shadow-sm flex items-center justify-between hover:bg-[#ffdad2] transition-colors text-left w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#b22300]/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#b22300]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#281814]">Seguridad de la cuenta</h4>
                <p className="text-sm text-[#5c403a]">Cambiá tu contraseña cuando quieras</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#5c403a] flex-shrink-0" />
          </button>

          {/* ── Recent activity tile ── */}
          <div className="col-span-12 md:col-span-6 bg-[#cce5ff] rounded-xl p-6 border border-[#e5beb5] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#006192]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#006192]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#001e31]">Actividad reciente</h4>
                <p className="text-sm text-[#004b72]">Último acceso: hoy</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#004b72]" />
          </div>
        </div>

        {/* ── Address section ── */}
        <SeccionDirecciones />
      </main>
    </div>
  );
};
