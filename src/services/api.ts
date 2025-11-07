import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  User,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  NetworkError,
  ApiError,
} from '../types';

/**
 * API Service for handling HTTP requests to the backend
 * Provides authentication and user management functionality
 */

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  // Base URL for all API requests
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token to requests if available
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // Handle unauthorized responses
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  /**
   * User signup/registration
   */
  signup: async (userData: SignupRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', userData);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * User login/authentication
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Get all users (for testing/admin purposes)
   */
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await api.get<ApiResponse<User[]>>('/auth/users');
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Request password reset (sends OTP to email)
   */
  forgotPassword: async (emailData: ForgotPasswordRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/auth/forgot-password', emailData);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (resetData: ResetPasswordRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/profile');
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Check OAuth configuration status
   */
  getOAuthStatus: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>('/auth/oauth/status');
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Handle Google OAuth success
   */
  googleOAuthSuccess: async (googleToken: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/google/success', {
        googleToken,
      });
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },
};

// Utility functions for token management
export const tokenUtils = {
  /**
   * Get token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Set token in localStorage
   */
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  /**
   * Remove token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },
};

// User data management utilities
export const userUtils = {
  /**
   * Get user data from localStorage
   */
  getUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Set user data in localStorage
   */
  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Remove user data from localStorage
   */
  removeUser: (): void => {
    localStorage.removeItem('user');
  },

  /**
   * Clear all authentication data
   */
  clearAuthData: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default api;
