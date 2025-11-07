import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Redux Hooks - Custom hooks for Redux with TypeScript support
 *
 * This file provides typed hooks for Redux that make it easier to use
 * Redux in components with better IDE support and type safety
 */

// ====================================================================
// TYPED HOOKS
// ====================================================================

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ====================================================================
// AUTH-SPECIFIC HOOKS
// ====================================================================

/**
 * Hook to get current user authentication state
 */
export const useAuth = () => {
  return useAppSelector(state => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
  }));
};

/**
 * Hook to get current user data
 */
export const useCurrentUser = () => {
  return useAppSelector(state => state.auth.user);
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useAppSelector(state => state.auth.isAuthenticated);
};

/**
 * Hook to get authentication loading state
 */
export const useAuthLoading = () => {
  return useAppSelector(state => state.auth.isLoading);
};

/**
 * Hook to get authentication error state
 */
export const useAuthError = () => {
  return useAppSelector(state => state.auth.error);
};

/**
 * Hook to get forgot password message
 */
export const useForgotPasswordMessage = () => {
  return useAppSelector(state => state.auth.forgotPasswordMessage);
};

/**
 * Hook to get reset password message
 */
export const useResetPasswordMessage = () => {
  return useAppSelector(state => state.auth.resetPasswordMessage);
};

/**
 * Hook to get all users (for admin/testing purposes)
 */
export const useUsers = () => {
  return useAppSelector(state => state.auth.users);
};

// ====================================================================
// COMPOUND HOOKS
// ====================================================================

/**
 * Hook that provides complete auth state and dispatch
 * This is a convenience hook that gives you everything you need for auth
 */
export const useAuthState = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const forgotPasswordMessage = useForgotPasswordMessage();
  const resetPasswordMessage = useResetPasswordMessage();
  const users = useUsers();

  return {
    // State
    ...auth,
    forgotPasswordMessage,
    resetPasswordMessage,
    users,

    // Actions
    dispatch,
  };
};

/**
 * Hook for login form components
 * Provides login-specific state and loading/error states
 */
export const useLoginState = () => {
  return useAppSelector(state => ({
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  }));
};

/**
 * Hook for signup form components
 * Provides signup-specific state and loading/error states
 */
export const useSignupState = () => {
  return useAppSelector(state => ({
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  }));
};

/**
 * Hook for forgot password form components
 * Provides forgot password-specific state
 */
export const useForgotPasswordState = () => {
  return useAppSelector(state => ({
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    message: state.auth.forgotPasswordMessage,
  }));
};

/**
 * Hook for reset password form components
 * Provides reset password-specific state
 */
export const useResetPasswordState = () => {
  return useAppSelector(state => ({
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    message: state.auth.resetPasswordMessage,
  }));
};

// ====================================================================
// UTILITY HOOKS
// ====================================================================

/**
 * Hook that provides a function to check if any auth operation is loading
 */
export const useIsAnyAuthLoading = () => {
  return useAppSelector(state => state.auth.isLoading);
};

/**
 * Hook for getting auth selector functions
 * Useful for components that need to access multiple auth properties
 */
export const useAuthSelectors = () => {
  return {
    selectUser: (state: RootState) => state.auth.user,
    selectIsAuthenticated: (state: RootState) => state.auth.isAuthenticated,
    selectToken: (state: RootState) => state.auth.token,
    selectIsLoading: (state: RootState) => state.auth.isLoading,
    selectError: (state: RootState) => state.auth.error,
    selectUsers: (state: RootState) => state.auth.users,
    selectForgotPasswordMessage: (state: RootState) => state.auth.forgotPasswordMessage,
    selectResetPasswordMessage: (state: RootState) => state.auth.resetPasswordMessage,
  };
};

/**
 * Hook for dashboard components that need user management data
 */
export const useDashboardData = () => {
  return useAppSelector(state => ({
    currentUser: state.auth.user,
    users: state.auth.users,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
  }));
};

/**
 * Hook for protected route components
 */
export const useProtectedRoute = () => {
  return useAppSelector(state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    isLoading: state.auth.isLoading,
  }));
};

/**
 * Hook for navigation components that need auth status
 */
export const useNavigation = () => {
  return useAppSelector(state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  }));
};
