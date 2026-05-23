import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';

export const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [celular, setCelular] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim()) {
      setError('Por favor completá los campos obligatorios');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await register({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        password,
        celular: celular.trim() || undefined
      });
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Error al registrar cuenta');
    } finally {
      setIsLoading(false);
    }
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

      <main className="flex-grow flex items-center justify-center pt-24 px-4 pb-10">
        <div
          className="w-full max-w-[500px] rounded-xl shadow-lg border border-white/20 p-8 sm:p-10"
          style={{
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255,248,246,0.88)',
          }}
        >
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#281814] mb-1">
              Crear cuenta
            </h1>
            <p className="text-sm text-[#5c403a]">Únete para realizar tus pedidos más rápido</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] px-1">
                  Nombre
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#907068] group-focus-within:text-[#b22300] transition-colors" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setNombre(e.target.value); setError(''); }}
                    placeholder="Tu nombre"
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-3 bg-white border border-[#e5beb5] rounded-lg text-sm text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 focus:border-[#b22300] transition-all"
                  />
                </div>
              </div>

              {/* Apellido */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] px-1">
                  Apellido
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#907068] group-focus-within:text-[#b22300] transition-colors" />
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setApellido(e.target.value); setError(''); }}
                    placeholder="Tu apellido"
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-3 bg-white border border-[#e5beb5] rounded-lg text-sm text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 focus:border-[#b22300] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] px-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#907068] group-focus-within:text-[#b22300] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(''); }}
                  placeholder="ejemplo@foodstore.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 focus:border-[#b22300] transition-all"
                />
              </div>
            </div>

            {/* El numero de telefono - opc */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] px-1">
                Celular (Opcional)
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#907068] group-focus-within:text-[#b22300] transition-colors" />
                <input
                  type="tel"
                  value={celular}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setCelular(e.target.value); setError(''); }}
                  placeholder="+54 9 11..."
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 focus:border-[#b22300] transition-all"
                />
              </div>
            </div>

            {/* Clave */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a] px-1">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#907068] group-focus-within:text-[#b22300] transition-colors" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[#e5beb5] rounded-lg text-base text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 focus:ring-[#b22300]/30 focus:border-[#b22300] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#907068] hover:text-[#b22300] transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[#ba1a1a] text-sm font-bold">{error}</p>
            )}

            {/* Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-[#b22300] text-white font-semibold text-lg rounded-lg shadow-md hover:bg-[#da3711] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Creando cuenta...
                </span>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>

          {/* Vuelta al login  */}
          <div className="mt-8 text-center pt-6 border-t border-[#e5beb5]">
            <p className="text-sm text-[#5c403a]">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#b22300] font-bold hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
