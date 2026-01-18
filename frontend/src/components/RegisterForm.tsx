import { useState, FormEvent } from 'react';
import { validateEmail, validatePassword, getPasswordStrength } from '../utils/validation';

interface RegisterFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const errors = [...emailValidation.errors, ...passwordValidation.errors];

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
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

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
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
        <label htmlFor="confirmPassword">Confirm Password</label>
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
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}
