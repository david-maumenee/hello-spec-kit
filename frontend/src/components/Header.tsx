import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, AuthState } from '../services/auth';

export function Header() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <Link to="/tasks">ToDo List</Link>
      </div>
      <nav className="header-nav">
        {authState.user && (
          <>
            <span className="user-email">{authState.user.email}</span>
            <Link to="/settings" className="nav-link">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="btn-logout"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
