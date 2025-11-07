import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { googleOAuthSuccess } from '../store/slices/authSlice';
import { User } from '../types';

/**
 * OAuth Callback Component - Handles OAuth redirect and token processing
 *
 * This component processes the OAuth callback from Google and handles
 * the token exchange and user authentication.
 */

type CallbackStatus = 'processing' | 'success' | 'error';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('processing');

  useEffect(() => {
    const handleOAuthCallback = async (): Promise<void> => {
      try {
        // Get token and user data from URL parameters
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');

        // Check for OAuth errors
        if (error) {
          console.error('OAuth Error:', error);
          setStatus('error');

          // Redirect to login with error message after delay
          setTimeout(() => {
            navigate(
              '/login?error=' + encodeURIComponent('Google OAuth failed. Please try again.')
            );
          }, 3000);
          return;
        }

        // Check if we have required data
        if (!token || !userParam) {
          console.error('Missing OAuth data:', { token: !!token, user: !!userParam });
          setStatus('error');

          // Redirect to login with error message after delay
          setTimeout(() => {
            navigate(
              '/login?error=' +
                encodeURIComponent('OAuth callback failed. Missing authentication data.')
            );
          }, 3000);
          return;
        }

        // Parse user data
        let user: User;
        try {
          user = JSON.parse(decodeURIComponent(userParam)) as User;
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          setStatus('error');

          setTimeout(() => {
            navigate(
              '/login?error=' + encodeURIComponent('OAuth callback failed. Invalid user data.')
            );
          }, 3000);
          return;
        }

        console.log('✅ OAuth Callback Success:', { user: user.email, provider: user.provider });

        // Dispatch Redux action to store authentication data
        const result = await dispatch(googleOAuthSuccess({ token, user }));

        if (googleOAuthSuccess.fulfilled.match(result)) {
          setStatus('success');

          // Redirect to dashboard after success
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error('Failed to process OAuth success');
        }
      } catch (error) {
        console.error('OAuth Callback Error:', error);
        setStatus('error');

        // Redirect to login with error message after delay
        setTimeout(() => {
          navigate(
            '/login?error=' + encodeURIComponent('Authentication failed. Please try again.')
          );
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, dispatch, navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        {status === 'processing' && (
          <>
            {/* Loading Spinner */}
            <div
              style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem',
              }}
            ></div>

            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Processing Authentication</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Please wait while we complete your Google sign-in...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            {/* Success Icon */}
            <div
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#28a745',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <svg width='24' height='24' fill='white' viewBox='0 0 24 24'>
                <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
              </svg>
            </div>

            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Authentication Successful!</h2>
            <p style={{ color: '#666', margin: 0 }}>Redirecting to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            {/* Error Icon */}
            <div
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#dc3545',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <svg width='24' height='24' fill='white' viewBox='0 0 24 24'>
                <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
              </svg>
            </div>

            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Authentication Failed</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Something went wrong. Redirecting to login page...
            </p>
          </>
        )}

        {/* CSS Animation for Spinner */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default OAuthCallback;
