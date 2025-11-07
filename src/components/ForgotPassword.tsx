import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';

// Import validation and API
import { forgotPasswordSchema, ForgotPasswordFormData } from '../utils/validationSchemas';
import { authAPI } from '../services/api';

/**
 * Forgot Password Component - Handles password reset requests
 *
 * This component allows users to:
 * 1. Enter their email address
 * 2. Request a password reset OTP
 * 3. Navigate to the reset password page
 * 4. Handle success/error messages from the server
 */

const ForgotPassword: React.FC = () => {
  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);

  // Navigation hook
  const navigate = useNavigate();

  // Form management with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  // Form submission handler
  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async data => {
    console.log('Forgot password form submitted:', data);

    // Clear any existing messages
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Call the forgot password API
      const response = await authAPI.forgotPassword(data);

      if (response.success) {
        setSuccessMessage(response.message || 'Password reset email sent successfully!');
        setEmailSent(true);

        // Auto-navigate to reset password page after 3 seconds
        setTimeout(() => {
          navigate('/reset-password', {
            state: { email: data.email },
          });
        }, 3000);
      } else {
        setApiError(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setApiError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation to reset password page
  const handleGoToReset = (): void => {
    const email = getValues('email');
    navigate('/reset-password', {
      state: { email },
    });
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
          Forgot Password
        </h2>

        <p
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Enter your email address and we'll send you an OTP to reset your password.
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
              disabled={emailSent}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.email ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: emailSent ? '#f8f9fa' : 'white',
              }}
              placeholder='Enter your email address'
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading || emailSent}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading || emailSent ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading || emailSent ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              transition: 'background-color 0.2s',
            }}
          >
            {isLoading ? 'Sending...' : emailSent ? 'Email Sent!' : 'Send Reset Email'}
          </button>
        </form>

        {/* Action Buttons */}
        {emailSent && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleGoToReset}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              Enter OTP & Reset Password
            </button>
          </div>
        )}

        {/* Links */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to='/login'
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            ← Back to Login
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

export default ForgotPassword;
