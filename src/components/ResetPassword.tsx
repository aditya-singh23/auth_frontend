import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Import validation and API
import { resetPasswordSchema, ResetPasswordFormData } from '../utils/validationSchemas';
import { NetworkError } from '../types';
import { authAPI } from '../services/api';

/**
 * Reset Password Component - Handles password reset with OTP
 *
 * This component allows users to:
 * 1. Enter their email address
 * 2. Enter the OTP they received via email
 * 3. Set a new password
 * 4. Confirm the new password
 */

interface LocationState {
  email?: string;
}

const ResetPassword: React.FC = () => {
  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  // Pre-fill email if passed from forgot password page
  useEffect(() => {
    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  }, [location.state, setValue]);

  // Form submission handler
  const onSubmit: SubmitHandler<ResetPasswordFormData> = async data => {
    console.log('Reset password form submitted:', { email: data.email, otp: data.otp });

    // Clear any existing messages
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Call the reset password API
      const response = await authAPI.resetPassword(data);

      if (response.success) {
        setSuccessMessage('Password reset successfully! Redirecting to login...');

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Password reset successfully! Please log in with your new password.',
            },
          });
        }, 2000);
      } else {
        setApiError(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setApiError((error as NetworkError).message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clearing error message
  const handleClearError = (): void => {
    setApiError('');
  };

  // Handle clearing success message
  const handleClearSuccess = (): void => {
    setSuccessMessage('');
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
            marginBottom: '10px',
            color: '#333',
            fontSize: '28px',
          }}
        >
          Reset Password
        </h2>

        <p
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Enter the OTP sent to your email and your new password.
        </p>

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
        {apiError && (
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
            {apiError}
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

        {/* Form */}
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
              Email Address:
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
              placeholder='Enter your email address'
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* OTP Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              OTP Code:
            </label>
            <input
              type='text'
              {...register('otp')}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.otp ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
                textAlign: 'center',
                letterSpacing: '2px',
              }}
              placeholder='Enter 6-digit OTP'
              maxLength={6}
            />
            {errors.otp && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              New Password:
            </label>
            <input
              type='password'
              {...register('newPassword')}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.newPassword ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder='Enter your new password'
            />
            {errors.newPassword && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Confirm New Password:
            </label>
            <input
              type='password'
              {...register('confirmNewPassword')}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.confirmNewPassword ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder='Confirm your new password'
            />
            {errors.confirmNewPassword && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.confirmNewPassword.message}
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
              backgroundColor: isLoading ? '#6c757d' : '#28a745',
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
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        {/* Links */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to='/forgot-password'
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            ← Back to Forgot Password
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link
            to='/login'
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
