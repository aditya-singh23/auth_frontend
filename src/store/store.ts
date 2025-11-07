import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import encryptedStorage from './encryptedStorage'; // Encrypted localStorage
import authReducer from './slices/authSlice';

/**
 * Redux Store Configuration - Central state management setup
 *
 * This file configures the Redux store with Redux Toolkit including:
 * - Store configuration with middleware
 * - Redux Persist for localStorage persistence
 * - DevTools integration for development
 */

// ====================================================================
// ROOT REDUCER - Combines all slice reducers
// ====================================================================

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers here as your app grows:
  // users: usersReducer,
  // posts: postsReducer,
  // etc.
});

// Define RootState type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// ====================================================================
// REDUX PERSIST CONFIGURATION
// ====================================================================

const persistConfig: PersistConfig<RootState> = {
  key: 'root', // Key for localStorage
  storage: encryptedStorage, // Use encrypted localStorage
  whitelist: ['auth'], // Only persist auth slice
  blacklist: [], // Don't blacklist anything

  // Transform functions (removed - encryption handled by storage)
  transforms: [],

  // Throttle writes to localStorage (in milliseconds)
  throttle: 100,

  // Serialize/deserialize functions (optional)
  serialize: true,

  // Debug mode (set to false in production)
  debug: process.env.NODE_ENV === 'development',
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ====================================================================
// STORE CONFIGURATION
// ====================================================================

export const store = configureStore({
  reducer: persistedReducer,

  // Middleware configuration
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Redux Persist requires these serialization checks to be disabled
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },

      // Immutability check (helps catch state mutations)
      immutableCheck: {
        warnAfter: 128, // Warn if check takes longer than 128ms
      },

      // Thunk middleware is included by default
      thunk: {
        extraArgument: {
          // You can pass extra arguments to thunks here
          // api: apiService,
          // router: history,
        },
      },
    }),

  // Redux DevTools configuration
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'Basic Auth App', // Name in DevTools
    trace: true, // Enable action stack traces
    traceLimit: 25, // Limit stack trace entries

    // Action sanitizer (hide sensitive data in DevTools)
    actionSanitizer: (action: any) => {
      // Hide password data in DevTools
      if (action.type.includes('auth/') && action.payload) {
        const sanitized = { ...action };
        if (sanitized.payload.password) {
          sanitized.payload = {
            ...sanitized.payload,
            password: '***HIDDEN***',
          };
        }
        if (sanitized.payload.confirmPassword) {
          sanitized.payload = {
            ...sanitized.payload,
            confirmPassword: '***HIDDEN***',
          };
        }
        return sanitized;
      }
      return action;
    },

    // State sanitizer (hide sensitive data in DevTools)
    stateSanitizer: (state: any) => {
      // Hide token in DevTools for security
      if (state.auth && state.auth.token) {
        return {
          ...state,
          auth: {
            ...state.auth,
            token: '***HIDDEN***',
          },
        };
      }
      return state;
    },
  },

  // Preloaded state (optional)
  preloadedState: undefined,

  // Enhancers (optional)
  enhancers: defaultEnhancers => defaultEnhancers,
});

// ====================================================================
// REDUX PERSIST STORE
// ====================================================================

export const persistor = persistStore(store);

// ====================================================================
// TYPESCRIPT TYPES
// ====================================================================

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;

// ====================================================================
// STORE UTILITIES
// ====================================================================

// Function to reset the entire store (useful for logout)
export const resetStore = (): void => {
  persistor.purge(); // Clear persisted state
  // You can dispatch additional reset actions here if needed
};

// Function to get current state (useful for debugging)
export const getCurrentState = (): RootState => store.getState();

// Function to check if store is rehydrated (useful for app initialization)
export const isStoreRehydrated = (): boolean => {
  const state = store.getState() as any;
  return state._persist && state._persist.rehydrated;
};

// ====================================================================
// DEVELOPMENT HELPERS
// ====================================================================

if (process.env.NODE_ENV === 'development') {
  // Make store available globally for debugging
  (window as any).__REDUX_STORE__ = store;

  // Log store state changes (disabled to reduce console noise)
  // store.subscribe(() => {
  //   console.log('🔄 Redux State Updated:', store.getState());
  // });
}

export default store;
