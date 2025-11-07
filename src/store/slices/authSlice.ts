import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { secureStorage } from '../../utils/secureStorage';
import {
  User,
  AuthState,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  ApiResponse,
} from '../../types';

/**
 * Auth Slice - Redux Toolkit slice for authentication state management
 *
 * This file contains all authentication-related Redux logic:
 * - User login/logout state
 * - Loading states for async operations
 * - Error handling for authentication
 * - Token management
 */

// ====================================================================
// ASYNC THUNKS - Handle API calls and async operations
// ====================================================================

// Signup async thunk - handles user registration
export const signupUser = createAsyncThunk<
  AuthResponse,
  SignupRequest & { confirmPassword: string },
  { rejectValue: string }
>('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...backendData } = userData;

    // Call the signup API with cleaned data
    const response = await authAPI.signup(backendData);

    // Store token and user data securely for persistence
    if (response.success && response.data?.token) {
      secureStorage.setToken(response.data.token);
      secureStorage.setUser(response.data.user);
    }

    return response.data!;
  } catch (error: any) {
    console.error('Signup error details:', error);

    // Extract error message from different possible error structures
    let errorMessage = 'Signup failed';

    if (error.message) {
      errorMessage = error.message;
    } else if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors.join(', ');
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return rejectWithValue(errorMessage);
  }
});

// Login async thunk - handles user authentication
export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Call the login API
      const response = await authAPI.login(credentials);

      // Store token and user data securely for persistence
      if (response.success && response.data?.token) {
        secureStorage.setToken(response.data.token);
        secureStorage.setUser(response.data.user);
      }

      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Forgot password async thunk - handles password reset request
export const forgotPassword = createAsyncThunk<
  ApiResponse,
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPassword', async (emailData, { rejectWithValue }) => {
  try {
    // Call the forgot password API
    const response = await authAPI.forgotPassword(emailData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to send reset email');
  }
});

// Reset password async thunk - handles password reset with OTP
export const resetPassword = createAsyncThunk<
  ApiResponse<AuthResponse>,
  ResetPasswordRequest,
  { rejectValue: string }
>('auth/resetPassword', async (resetData, { rejectWithValue }) => {
  try {
    // Call the reset password API
    const response = await authAPI.resetPassword(resetData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to reset password');
  }
});

// Get users async thunk - fetches all users (for testing/admin)
export const getUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'auth/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Call the get users API
      const response = await authAPI.getUsers();
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

// Google OAuth async thunk - handles Google OAuth authentication
export const googleOAuth = createAsyncThunk<null, void, { rejectValue: string }>(
  'auth/googleOAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;

      // This thunk doesn't return data since it redirects
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to initiate Google OAuth');
    }
  }
);

// Google OAuth success async thunk - handles OAuth callback success
export const googleOAuthSuccess = createAsyncThunk<
  AuthResponse,
  { token: string; user: User },
  { rejectValue: string }
>('auth/googleOAuthSuccess', async ({ token, user }, { rejectWithValue }) => {
  try {
    // Store token and user data securely for persistence
    if (token && user) {
      secureStorage.setToken(token);
      secureStorage.setUser(user);
    }

    return { token, user };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to process Google OAuth success');
  }
});

// ====================================================================
// INITIAL STATE - Default state when app starts
// ====================================================================

const initialState: AuthState = {
  // User authentication state
  user: null,
  token: null,
  isAuthenticated: false,

  // Loading states for different operations
  isLoading: false,

  // Error states
  error: null,

  // Additional data
  users: [],
  forgotPasswordMessage: null,
  resetPasswordMessage: null,
};

// ====================================================================
// AUTH SLICE - Main Redux slice definition
// ====================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,

  // Regular reducers - synchronous actions
  reducers: {
    // Logout action - clears user session
    logout: state => {
      // Clear secure storage
      secureStorage.removeToken();
      secureStorage.removeUser();

      // Clear localStorage persist data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
        localStorage.removeItem('persist:auth');
      }

      // Reset state to initial values
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.users = [];
      state.forgotPasswordMessage = null;
      state.resetPasswordMessage = null;
    },

    // Clear errors action - resets all error states
    clearErrors: state => {
      state.error = null;
    },

    // Clear success messages
    clearMessages: state => {
      state.forgotPasswordMessage = null;
      state.resetPasswordMessage = null;
    },

    // Clear success flags (for backward compatibility)
    clearSuccessFlags: state => {
      state.forgotPasswordMessage = null;
      state.resetPasswordMessage = null;
    },

    // Load user from storage action - restores user session from secure storage
    loadUserFromStorage: state => {
      const token = secureStorage.getToken();
      const user = secureStorage.getUser();

      if (token && user) {
        try {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          // If data is invalid, clear it
          secureStorage.removeToken();
          secureStorage.removeUser();
        }
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  // Extra reducers - handle async thunk actions
  extraReducers: builder => {
    // ====================================================================
    // SIGNUP CASES
    // ====================================================================
    builder
      .addCase(signupUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Signup failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ====================================================================
      // LOGIN CASES
      // ====================================================================
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ====================================================================
      // FORGOT PASSWORD CASES
      // ====================================================================
      .addCase(forgotPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.forgotPasswordMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.forgotPasswordMessage = action.payload.message;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send reset email';
        state.forgotPasswordMessage = null;
      })

      // ====================================================================
      // RESET PASSWORD CASES
      // ====================================================================
      .addCase(resetPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.resetPasswordMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetPasswordMessage = action.payload.message;
        state.error = null;

        // If reset password returns user data, update auth state
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to reset password';
        state.resetPasswordMessage = null;
      })

      // ====================================================================
      // GET USERS CASES
      // ====================================================================
      .addCase(getUsers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      })

      // ====================================================================
      // GOOGLE OAUTH CASES
      // ====================================================================
      .addCase(googleOAuth.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleOAuth.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(googleOAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to initiate Google OAuth';
      })

      // ====================================================================
      // GOOGLE OAUTH SUCCESS CASES
      // ====================================================================
      .addCase(googleOAuthSuccess.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleOAuthSuccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleOAuthSuccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to process Google OAuth success';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  logout,
  clearErrors,
  clearMessages,
  clearSuccessFlags,
  loadUserFromStorage,
  setLoading,
  setError,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors for easy state access
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectUsers = (state: { auth: AuthState }) => state.auth.users;
