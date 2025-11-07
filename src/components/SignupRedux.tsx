import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { signupSchema, SignupFormData } from '../utils/validationSchemas';

// Import Redux hooks and actions
import { useAppDispatch } from '../store/hooks';
import { useSignupState } from '../store/hooks';
import { signupUser, clearErrors, clearSuccessFlags } from '../store/slices/authSlice';

// Import Google OAuth Button
import GoogleOAuthButton from './GoogleOAuthButton';

/**
 * Signup Component with Redux - User registration form with Redux state management
 *
 * This component handles user registration using Redux for state management.
 * It replaces the original Signup component with centralized state.
 */

const Signup: React.FC = () => {
  // React Router hooks
  const navigate = useNavigate();

  // Redux hooks
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useSignupState();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: 'onChange',
  });

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Clear Redux errors when component mounts
  useEffect(() => {
    dispatch(clearErrors());
    dispatch(clearSuccessFlags());
  }, [dispatch]);

  // Form submission handler
  const onSubmit: SubmitHandler<SignupFormData> = async data => {
    console.log('Signup form submitted:', {
      name: data.name,
      email: data.email,
    });

    try {
      // Dispatch signup action
      const result = await dispatch(signupUser(data));

      if (signupUser.fulfilled.match(result)) {
        console.log('Signup successful:', result.payload);
        reset(); // Clear form
        navigate('/dashboard');
      } else {
        console.error('Signup failed:', result.payload);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
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
          Create Account
        </h2>

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

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Full Name:
            </label>
            <input
              type='text'
              {...register('name')}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.name ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder='Enter your full name'
            />
            {errors.name && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.name.message}
              </p>
            )}
          </div>

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

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Confirm Password:
            </label>
            <input
              type='password'
              {...register('confirmPassword')}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.confirmPassword ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder='Confirm your password'
            />
            {errors.confirmPassword && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.confirmPassword.message}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Google OAuth Button */}
        <GoogleOAuthButton />

        {/* Link to Login */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Already have an account? </span>
          <Link
            to='/login'
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
