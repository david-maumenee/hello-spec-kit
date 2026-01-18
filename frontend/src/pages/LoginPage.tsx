import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { authService } from '../services/auth';

export function LoginPage() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string, rememberMe: boolean) => {
    setError(undefined);
    try {
      await authService.login(email, password, rememberMe);
      navigate('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Sign In</h1>
        <p className="auth-subtitle">Welcome back!</p>
        <LoginForm onSubmit={handleSubmit} error={error} />
        <p className="auth-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
