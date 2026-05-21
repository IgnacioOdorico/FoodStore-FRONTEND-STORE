import { useAuthStore } from '../../../store/useAuthStore';
import { User } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="pt-20 pb-16 max-w-[480px] mx-auto px-4">
        <div className="bg-white rounded-xl border border-[#e5beb5]/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)] p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-[#ffe9e4] flex items-center justify-center">
            <User className="w-10 h-10 text-[#b22300]/60" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#281814]">{user.nombre}</h1>
            <p className="text-[#5c403a] text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {user.roles.map((r) => (
              <span
                key={r}
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#ffe9e4] text-[#b22300] border border-[#e5beb5]"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
