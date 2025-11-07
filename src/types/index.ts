// Common types for the frontend application

// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  provider: 'local' | 'google';
  profilePicture?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  passwordUpdatedAt?: string;
}

// API Response types
export interface ApiResponse<T = Record<string, string | number | boolean> | string | number> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Redux Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  users: User[];
  forgotPasswordMessage: string | null;
  resetPasswordMessage: string | null;
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string;
}

// Google OAuth types
export interface GoogleOAuthResponse {
  credential: string;
  select_by: string;
}

// Error types for better error handling
export interface ApiErrorResponse {
  message: string;
  errors?: string[];
  status?: number;
  statusText?: string;
}

export interface NetworkError extends Error {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
    statusText?: string;
  };
}

export interface ValidationErrorDetails {
  field: string;
  message: string;
  value?: string | number | boolean;
}

// Component Props types
export interface FormProps {
  onSubmit: (data: Record<string, string | number | boolean>) => void;
  isLoading?: boolean;
  error?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Route types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

// OAuth callback types
export interface OAuthCallbackParams {
  token?: string;
  user?: string;
  error?: string;
}

// Dashboard types
export interface DashboardData {
  users: User[];
  totalUsers: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'login' | 'signup' | 'password_reset';
  user: string;
  timestamp: string;
  details?: string;
}
