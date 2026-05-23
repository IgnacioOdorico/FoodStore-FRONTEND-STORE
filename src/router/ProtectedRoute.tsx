import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { IRole } from '../shared/types/auth.types';
import { LoadingState } from '../shared/ui/States';

type Props = {
  allowedRoles: IRole[];
};

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, hasRole, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(...allowedRoles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};
