import { useState, FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { validatePassword, getPasswordStrength } from '../utils/validation';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const passwordStrength = getPasswordStrength(password);

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h1>Invalid Link</h1>
          <p>This password reset link is invalid or has expired.</p>
          <p className="auth-link">
            <Link to="/forgot-password">Request a new link</Link>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setValidationErrors([]);

    const passwordValidation = validatePassword(password);
    const errors = [...passwordValidation.errors];

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      navigate('/login', { state: { message: 'Password reset successfully. Please sign in.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Enter your new password</p>

        {error && <div className="error-message">{error}</div>}
        {validationErrors.length > 0 && (
          <div className="error-message">
            <ul>
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              disabled={isLoading}
            />
            {password && (
              <div className="password-strength">
                <div
                  className="strength-bar"
                  style={{
                    width: `${(passwordStrength.score / 6) * 100}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                />
                <span style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
