import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Accesos de test - credenciales del seed del backend
const DEMO_USERS = [
  { email: 'admin@nachopizza.com',   pass: 'Admin1234!',    role: 'Admin',   cls: 'bg-[#ffdad2] text-[#8b1900]' },
  { email: 'pedidos@nachopizza.com', pass: 'Pedidos1234!',  role: 'Cajero',  cls: 'bg-[#dae2fd] text-[#3f465c]' },
  { email: 'juan@ejemplo.com',       pass: 'Juan1234!',     role: 'Cliente', cls: 'bg-[#d1fae5] text-[#065f46]' },
];

export const LoginPage = () => {
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate  = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Completá email y contraseña');
      return;
    }
    setError('');
    setIsLoading(true);
    const user = await login(email, password);
    setIsLoading(false);

    if (!user) {
      setError('Credenciales inválidas. Revisá email y contraseña.');
      return;
    }
    navigate('/products');
  };

  const quickLogin = (qEmail: string, qPass: string) => {
    setEmail(qEmail);
    setPassword(qPass);
    setError('');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: [
          'linear-gradient(rgba(40,24,20,0.50), rgba(40,24,20,0.50))',
          'url(https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1920&q=80)',
        ].join(', '),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* TopBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fff8f6]/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-4 h-16 max-w-[1280px] mx-auto">
          <span className="text-2xl font-black text-[#b22300]">FoodStore</span>
        </div>
      </header>

      {/* Centered glass panel */}
      <main className="flex-grow flex items-center justify-center pt-16 px-4 py-10">
        <div
          className="w-full max-w-[480px] rounded-xl shadow-lg border border-white/20 p-10 my-10"
          style={{
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255,248,246,0.88)',
          }}
        >
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#281814] mb-1">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-[#5c403a]">Inicia sesión para descubrir nuevos sabores</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] px-1" htmlFor="login-email">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#907068] group-focus-within:text-[#b22300] transition-colors" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(''); }}
                  placeholder="ejemplo@foodstore.com"
                  disabled={isLoading}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 focus:border-[#b22300] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] px-1" htmlFor="login-password">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#907068] group-focus-within:text-[#b22300] transition-colors" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 focus:border-[#b22300] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#907068] hover:text-[#b22300] transition-colors"
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Recordarme + ¿Olvidaste? */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e5beb5] text-[#b22300] focus:ring-[#b22300]"
                />
                <span className="text-sm text-[#5c403a] group-hover:text-[#281814] transition-colors">
                  Recordarme
                </span>
              </label>
              <button type="button" className="text-sm text-[#b22300] font-bold hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[#ba1a1a] text-sm font-bold">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#b22300] text-white font-semibold text-lg rounded-lg shadow-md hover:bg-[#da3711] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Cargando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative flex items-center my-8">
            <div className="flex-grow border-t border-[#e5beb5]" />
            <span className="flex-shrink mx-4 text-[12px] font-bold uppercase tracking-[0.05em] text-[#907068]">
              Accesos de prueba
            </span>
            <div className="flex-grow border-t border-[#e5beb5]" />
          </div>

          {/* Demo users */}
          <div className="flex flex-col gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => quickLogin(u.email, u.pass)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 ${u.cls}`}
              >
                <span className="font-mono">{u.email}</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                  {u.role}
                </span>
              </button>
            ))}
          </div>

          {/* Crear cuenta */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#5c403a]">
              ¿No tenés una cuenta?{' '}
              <button type="button" className="text-[#b22300] font-bold hover:underline">
                Regístrate gratis
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
