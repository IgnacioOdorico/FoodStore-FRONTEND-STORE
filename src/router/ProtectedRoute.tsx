import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { IRole } from '../shared/types/auth.types';

type Props = {
  allowedRoles: IRole[];
};

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, hasRole } = useAuthStore();

  // Si no inició sesión -> al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si no tiene ninguno de los roles requeridos -> forbidden
  if (!hasRole(...allowedRoles)) {
    return <Navigate to="/forbidden" replace />;
  }

  // Cumple con autenticación y permisos -> renderiza la ruta hija
  return <Outlet />;
};
