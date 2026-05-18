import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingresá un email");
      return;
    }

    setError("");
    setIsLoading(true);
    const user = await login(email);
    setIsLoading(false);

    if (!user) {
      setError("Credenciales inválidas. Usá uno de los emails de prueba.");
      return;
    }

    navigate("/products");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const quickLogin = (quickEmail: string) => {
    setEmail(quickEmail);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-brand-active uppercase italic tracking-tighter leading-none mb-2">
            FoodStore
          </h1>
          <p className="text-cocoa/60 font-bold italic text-sm">
            Ingresá para continuar
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-[10px] font-black uppercase tracking-widest italic text-white/50">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="login-email"
                  value={email}
                  onChange={handleChange}
                  type="email"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                  className="input-field pl-10"
                />
              </div>
              {error && (
                <p className="text-red-400 text-xs font-black italic">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest italic text-white/30 mb-3">
              Usuarios de prueba
            </p>
            <div className="flex flex-col gap-2">
              {[
                { email: "admin@app.com", role: "Admin", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
                { email: "emp@app.com", role: "Empleado", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
                { email: "client@app.com", role: "Cliente", color: "bg-green-500/20 text-green-300 border-green-500/30" },
              ].map(u => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => quickLogin(u.email)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 ${u.color}`}
                >
                  <span className="font-mono">{u.email}</span>
                  <span className="font-black uppercase italic text-[9px] tracking-widest opacity-70">{u.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
