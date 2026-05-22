import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

export const ForbiddenPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff8f6] flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 rounded-full bg-[#ffdad6] flex items-center justify-center">
        <ShieldOff className="w-10 h-10 text-[#ba1a1a]" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-black text-[#281814] mb-2">403 — Sin acceso</h1>
        {user && (
          <p className="text-[#5c403a] text-sm">
            Tus roles <strong>({user.roles.join(', ')})</strong> no tienen permisos para esta sección.
          </p>
        )}
      </div>
      <button
        onClick={() => navigate(-1 as any)}
        className="flex items-center gap-2 px-6 py-3 border border-[#907068] text-[#281814] font-semibold rounded-lg hover:bg-[#fff0ed] transition-all text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>
    </div>
  );
};
