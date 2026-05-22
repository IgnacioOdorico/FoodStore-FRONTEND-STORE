import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-[50vh]">
    <Loader2 className="w-10 h-10 text-[#b22300] animate-spin" />
    <p className="text-[#5c403a] text-xs font-bold uppercase tracking-widest">
      Cargando...
    </p>
  </div>
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'No se pudo conectar con el servidor.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-[50vh]">
    <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center">
      <AlertCircle className="w-8 h-8 text-[#ba1a1a]" />
    </div>
    <div className="text-center">
      <h3 className="font-black text-[#281814] text-lg mb-1">Algo salió mal</h3>
      <p className="text-[#5c403a] text-sm">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-[#ba1a1a] text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-all"
      >
        Reintentar
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-[30vh] rounded-xl border-2 border-dashed border-[#e5beb5] bg-[#fff0ed]/40">
    <Inbox className="w-12 h-12 text-[#b22300]/20" />
    <p className="text-[#5c403a] text-xs font-bold uppercase tracking-widest">{message}</p>
  </div>
);
