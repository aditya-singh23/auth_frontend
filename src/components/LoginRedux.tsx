import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginSchema, LoginFormData } from '../utils/validationSchemas';

// Import Redux hooks and actions
import { useAppDispatch } from '../store/hooks';
import { useLoginState } from '../store/hooks';
import { loginUser, clearErrors, clearSuccessFlags } from '../store/slices/authSlice';

// Import Google OAuth Button
import GoogleOAuthButton from './GoogleOAuthButton';

/**
 * Login Component with Redux - User authentication form with Redux state management
 *
 * This component handles user login using Redux for state management.
 * It replaces the original Login component with centralized state.
 */

interface LocationState {
  message?: string;
}

const Login: React.FC = () => {
  // Local state for success messages (non-Redux state that's component-specific)
  const [successMessage, setSuccessMessage] = useState<string>('');

  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  // Redux hooks
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useLoginState();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  // Check for success message from password reset (from React Router state)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors when component unmounts or when starting fresh
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
      dispatch(clearSuccessFlags());
    };
  }, [dispatch]);

  // Form submission handler
  const onSubmit: SubmitHandler<LoginFormData> = async data => {
    console.log('Login form submitted:', { email: data.email });

    try {
      // Clear any existing success messages
      setSuccessMessage('');

      // Dispatch login action
      const result = await dispatch(loginUser(data));

      if (loginUser.fulfilled.match(result)) {
        console.log('Login successful:', result.payload);
        reset(); // Clear form
        navigate('/dashboard');
      } else {
        console.error('Login failed:', result.payload);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle clearing success message
  const handleClearSuccess = (): void => {
    setSuccessMessage('');
  };

  // Handle clearing error message
  const handleClearError = (): void => {
    dispatch(clearErrors());
  };

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
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Header */}
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#333',
            fontSize: '28px',
          }}
        >
          Welcome Back
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div
            style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              border: '1px solid #c3e6cb',
              position: 'relative',
            }}
          >
            {successMessage}
            <button
              onClick={handleClearSuccess}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#155724',
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb',
              position: 'relative',
            }}
          >
            {error}
            <button
              onClick={handleClearError}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#721c24',
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Email:
            </label>
            <input
              type='email'
              {...register('email')}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.email ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder='Enter your email'
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Password:
            </label>
            <input
              type='password'
              {...register('password')}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.password ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder='Enter your password'
            />
            {errors.password && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              transition: 'background-color 0.2s',
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Google OAuth Button */}
        <GoogleOAuthButton />

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            to='/forgot-password'
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Don't have an account? </span>
          <Link
            to='/signup'
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
