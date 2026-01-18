import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { authService } from '../services/auth';

export function RegisterPage() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    setError(undefined);
    try {
      await authService.register(email, password);
      navigate('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Start managing your tasks today</p>
        <RegisterForm onSubmit={handleSubmit} error={error} />
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
