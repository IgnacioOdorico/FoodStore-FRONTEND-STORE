import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/products', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          backgroundColor: 'var(--color-surface-container-high)',
          boxShadow: '0 -4px 12px rgba(130,81,58,0.08)',
        }}
      >
        <h1
          className="text-3xl font-black italic uppercase tracking-tighter text-center mb-1"
          style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-primary)' }}
        >
          FOODSTORE
        </h1>
        <p className="text-center text-sm font-semibold mb-8" style={{ color: 'var(--color-outline)' }}>
          Iniciá sesión para continuar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wide" style={{ color: 'var(--color-on-surface-variant)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-colors"
              style={{
                backgroundColor: 'var(--color-surface-container-highest)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wide" style={{ color: 'var(--color-on-surface-variant)' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-colors"
              style={{
                backgroundColor: 'var(--color-surface-container-highest)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-center" style={{ color: 'var(--color-error)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-extrabold text-sm uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-xs text-center mt-2" style={{ color: 'var(--color-outline)' }}>
            Usuario demo: juan@ejemplo.com / Juan1234!
          </p>
        </form>
      </div>
    </div>
  );
};
