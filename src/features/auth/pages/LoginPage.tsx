import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';

export const LoginPage = () => {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
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
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(circle at 0% 0%, #fff0ed 0%, #fff8f6 50%, #fffbff 100%)',
      }}
    >
      <main className="w-full max-w-[440px]">

        {/* ── Brand header ── */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 bg-[#b22300] rounded-xl flex items-center justify-center shadow-lg shadow-[#b22300]/25">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-[#b22300] tracking-tight">FoodStore</h1>
          <p className="text-[#5c403a] text-sm mt-1">Portal de acceso</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-xl border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)] p-10">
          <h2 className="font-bold text-[#281814] text-lg mb-1">Bienvenido de nuevo</h2>
          <p className="text-[#5c403a] text-sm mb-6">Ingresá tus credenciales para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#5c403a]" htmlFor="login-email">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c403a]/50 group-focus-within:text-[#b22300] transition-colors" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(''); }}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                  className="block w-full pl-10 pr-3 py-3 bg-[#fff8f6] border border-[#e5beb5] rounded-lg text-sm text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#5c403a]" htmlFor="login-password">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c403a]/50 group-focus-within:text-[#b22300] transition-colors" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-10 py-3 bg-[#fff8f6] border border-[#e5beb5] rounded-lg text-sm text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c403a]/50 hover:text-[#b22300] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[#ba1a1a] text-xs font-bold">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#b22300] hover:bg-[#da3711] text-white font-bold py-3 rounded-lg shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span className="text-base">Ingresar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* ── Usuarios de demo ── */}
          <div className="mt-8 pt-6 border-t border-[#e5beb5]/60">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5c403a]/50 mb-3">
              Accesos de prueba
            </p>
            <div className="flex flex-col gap-2">
              {[
                { email: 'admin@app.com',  pass: 'admin123',  role: 'Admin',   bg: 'bg-[#ffdad2] text-[#8b1900] border-[#ffdad2]' },
                { email: 'cajero@app.com', pass: 'cajero123', role: 'Cajero',  bg: 'bg-[#dae2fd] text-[#3f465c] border-[#dae2fd]' },
                { email: 'client@app.com', pass: 'client123', role: 'Cliente', bg: 'bg-[#d1fae5] text-[#065f46] border-[#d1fae5]' },
              ].map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => quickLogin(u.email, u.pass)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 ${u.bg}`}
                >
                  <span className="font-mono">{u.email}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{u.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c403a]/60">
              Server: Online
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#5c403a]/40">v2.4.0</span>
        </div>
      </main>

      {/* Elemento decorativo de fondo */}
      <div className="hidden lg:block fixed bottom-0 right-0 w-[35%] h-[55%] -mr-16 -mb-16 opacity-[0.06] pointer-events-none select-none">
        <div className="w-full h-full rounded-full"
             style={{ background: 'radial-gradient(circle, #b22300 0%, transparent 70%)' }} />
      </div>
    </div>
  );
};
