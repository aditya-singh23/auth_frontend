import * as yup from 'yup';

/**
 * Validation Schemas - Form validation rules for all authentication forms
 *
 * This file contains all the validation rules for our authentication system.
 *
 * What is validation?
 * Validation is checking if user input meets certain requirements before processing it.
 * For example: checking if an email has @ symbol, or if a password is long enough.
 *
 * Why do we validate?
 * 1. SECURITY: Prevent malicious or incorrect data from entering our system
 * 2. USER EXPERIENCE: Give users helpful error messages to fix their input
 * 3. DATA QUALITY: Ensure all data in our database follows consistent formats
 */

// Signup validation schema - defines rules for the registration form
export const signupSchema = yup.object().shape({
  // Name field validation
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  // Email field validation
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase(),

  // Password field validation with strength requirements
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  // Confirm password field validation
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Login validation schema - simpler than signup
export const loginSchema = yup.object().shape({
  // Email field validation
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase(),

  // Password field validation (no strength requirements for login)
  password: yup.string().required('Password is required').min(1, 'Password is required'),
});

// Forgot password validation schema - only email needed
export const forgotPasswordSchema = yup.object().shape({
  // Email field validation
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase(),
});

// Reset password validation schema - email, OTP, and new password
export const resetPasswordSchema = yup.object().shape({
  // Email field validation
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase(),

  // OTP field validation - 6-digit code
  otp: yup
    .string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^[0-9]+$/, 'OTP must contain only numbers'),

  // New password field validation with strength requirements
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  // Confirm new password field validation
  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

// Additional validation schemas for other forms

// Profile update validation schema
export const profileUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase(),
});

// Change password validation schema (for authenticated users)
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),

  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

// Contact form validation schema
export const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase(),

  subject: yup
    .string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must not exceed 100 characters'),

  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters'),
});

// Export all schemas as a named object for convenience
const validationSchemas = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
  changePasswordSchema,
  contactSchema,
};

export default validationSchemas;

// Type definitions for form data (to be used with react-hook-form)
export type SignupFormData = yup.InferType<typeof signupSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
export type ContactFormData = yup.InferType<typeof contactSchema>;
