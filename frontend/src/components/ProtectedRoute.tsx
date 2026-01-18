import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService, AuthState } from '../services/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());
  const location = useLocation();

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  if (authState.isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
