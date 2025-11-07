/**
 * Storage Cleanup Utilities
 *
 * Utility functions to clear various types of stored data
 * for debugging and development purposes.
 */

/**
 * Clear all Redux Persist data from localStorage
 */
export const clearReduxPersist = (): void => {
  if (typeof window !== 'undefined') {
    // Clear Redux Persist data (encrypted)
    localStorage.removeItem('persist:root');
    localStorage.removeItem('persist:auth');

    console.log('✅ Encrypted Redux Persist data cleared');
  }
};

/**
 * Clear all authentication-related storage
 */
export const clearAuthStorage = (): void => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('persist:root');
    localStorage.removeItem('persist:auth');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    // Clear sessionStorage
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');

    console.log('✅ All authentication storage cleared');
  }
};

/**
 * Clear ALL localStorage data (use with caution)
 */
export const clearAllLocalStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('⚠️ ALL localStorage data cleared');
  }
};

/**
 * List all localStorage keys (for debugging)
 */
export const listStorageKeys = (): void => {
  if (typeof window !== 'undefined') {
    console.log('📋 localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        console.log(`  ${key}: ${value?.substring(0, 100)}...`);
      }
    }
  }
};

/**
 * Development helper: Add to window object for easy access in console
 */
if (process.env.NODE_ENV === 'development') {
  (
    window as unknown as {
      clearReduxPersist: typeof clearReduxPersist;
      clearAuthStorage: typeof clearAuthStorage;
      clearAllLocalStorage: typeof clearAllLocalStorage;
      listStorageKeys: typeof listStorageKeys;
    }
  ).clearReduxPersist = clearReduxPersist;
  (
    window as unknown as {
      clearReduxPersist: typeof clearReduxPersist;
      clearAuthStorage: typeof clearAuthStorage;
      clearAllLocalStorage: typeof clearAllLocalStorage;
      listStorageKeys: typeof listStorageKeys;
    }
  ).clearAuthStorage = clearAuthStorage;
  (
    window as unknown as {
      clearReduxPersist: typeof clearReduxPersist;
      clearAuthStorage: typeof clearAuthStorage;
      clearAllLocalStorage: typeof clearAllLocalStorage;
      listStorageKeys: typeof listStorageKeys;
    }
  ).clearAllLocalStorage = clearAllLocalStorage;
  (
    window as unknown as {
      clearReduxPersist: typeof clearReduxPersist;
      clearAuthStorage: typeof clearAuthStorage;
      clearAllLocalStorage: typeof clearAllLocalStorage;
      listStorageKeys: typeof listStorageKeys;
    }
  ).listStorageKeys = listStorageKeys;

  console.log('🛠️ Storage utilities available:');
  console.log('  - window.clearReduxPersist()');
  console.log('  - window.clearAuthStorage()');
  console.log('  - window.clearAllLocalStorage()');
  console.log('  - window.listStorageKeys()');
}
