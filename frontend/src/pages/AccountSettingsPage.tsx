import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { authService, AuthState } from '../services/auth';

export function AccountSettingsPage() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  const handleAccountDeleted = () => {
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <h1>Account Settings</h1>

        <section className="settings-section">
          <h2>Account Information</h2>
          <p>
            <strong>Email:</strong> {authState.user?.email}
          </p>
          <p>
            <strong>Member since:</strong>{' '}
            {authState.user?.createdAt
              ? new Date(authState.user.createdAt).toLocaleDateString()
              : 'N/A'}
          </p>
        </section>

        <section className="settings-section danger-zone">
          <h2>Danger Zone</h2>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button
            className="btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </section>

        {showDeleteModal && (
          <DeleteAccountModal
            onClose={() => setShowDeleteModal(false)}
            onDeleted={handleAccountDeleted}
          />
        )}
      </main>
    </div>
  );
}
