import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Redux hooks and actions
import { useAppDispatch } from '../store/hooks';
import { useAuth } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

/**
 * Dashboard Component with Redux - User dashboard with Redux state management
 *
 * This component shows user information and provides logout functionality.
 * It uses Redux for state management and authentication checks.
 */

const Dashboard: React.FC = () => {
  // React Router hooks
  const navigate = useNavigate();

  // Redux hooks
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Note: Removed automatic user fetching for security and performance reasons
  // Users list should only be available to admin users in a separate admin panel

  // Handle logout
  const handleLogout = (): void => {
    // Dispatch logout action
    dispatch(logout());

    // Redirect to login page
    navigate('/login');
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#333',
            fontSize: '24px',
          }}
        >
          Dashboard
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Logout
        </button>
      </div>

      {/* User Information Card */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '20px',
            color: '#333',
            fontSize: '20px',
          }}
        >
          Welcome, {user.name}!
        </h2>

        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <strong style={{ color: '#666' }}>Name:</strong>
            <span style={{ marginLeft: '10px', color: '#333' }}>{user.name}</span>
          </div>

          <div>
            <strong style={{ color: '#666' }}>Email:</strong>
            <span style={{ marginLeft: '10px', color: '#333' }}>{user.email}</span>
          </div>

          <div>
            <strong style={{ color: '#666' }}>Provider:</strong>
            <span
              style={{
                marginLeft: '10px',
                color: '#333',
                textTransform: 'capitalize',
              }}
            >
              {user.provider}
            </span>
          </div>

          <div>
            <strong style={{ color: '#666' }}>Email Verified:</strong>
            <span
              style={{
                marginLeft: '10px',
                color: user.emailVerified ? '#28a745' : '#dc3545',
                fontWeight: 'bold',
              }}
            >
              {user.emailVerified ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <strong style={{ color: '#666' }}>Member Since:</strong>
            <span style={{ marginLeft: '10px', color: '#333' }}>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

          {user.profilePicture && (
            <div>
              <strong style={{ color: '#666' }}>Profile Picture:</strong>
              <div style={{ marginTop: '10px' }}>
                <img
                  src={user.profilePicture}
                  alt='Profile'
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid #ddd',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users list removed for security and privacy reasons */}
      {/* Admin users should have a separate admin dashboard for user management */}
    </div>
  );
};

export default Dashboard;
