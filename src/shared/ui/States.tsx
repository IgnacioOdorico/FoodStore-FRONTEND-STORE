import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <span className="material-symbols-outlined text-5xl animate-spin" style={{ color: 'var(--color-primary)' }}>
      progress_activity
    </span>
    <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
      Cargando...
    </p>
  </div>
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Hubo un error al conectar con el servidor.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 mx-5 rounded-xl p-6"
    style={{ backgroundColor: 'var(--color-error-container)' }}>
    <span className="material-symbols-outlined text-5xl" style={{ color: 'var(--color-error)' }}>error</span>
    <p className="font-semibold text-center" style={{ color: 'var(--color-on-error-container)' }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 rounded-full font-extrabold text-sm uppercase tracking-wide"
        style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }}
      >
        Reintentar
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <span className="material-symbols-outlined text-6xl" style={{ color: 'var(--color-outline-variant)' }}>
      sentiment_dissatisfied
    </span>
    <p className="text-sm font-extrabold uppercase tracking-widest text-center" style={{ color: 'var(--color-outline)' }}>
      {message}
    </p>
  </div>
);
