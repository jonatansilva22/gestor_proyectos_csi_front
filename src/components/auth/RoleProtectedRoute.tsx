import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[]; // 1: admin, 2: superadmin, 3: colaborador
  redirectTo?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (user.role && !allowedRoles.includes(user.role)) {
    // If redirectTo is "/404", show not found page for unauthorized access
    if (redirectTo === "/404") {
      return <Navigate to="/404" replace />;
    }
    
    // Si es colaborador (role 3), redirigir a projects en lugar de dashboard
    const redirectPath = user.role === 3 ? "/projects" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};