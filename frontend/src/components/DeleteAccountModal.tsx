import { useState, FormEvent } from 'react';
import { api } from '../services/api';
import { authService } from '../services/auth';

interface DeleteAccountModalProps {
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteAccountModal({ onClose, onDeleted }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    try {
      await api.delete('/account', { password });
      await authService.logout();
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Account</h2>
        <p>
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        <p>Please enter your password to confirm:</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="btn-danger"
            >
              {isLoading ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
