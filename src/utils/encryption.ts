/**
 * Encryption Utilities for localStorage
 *
 * Provides encryption/decryption functions for sensitive data stored in localStorage.
 * Uses AES encryption with CryptoJS for client-side data protection.
 */

import CryptoJS from 'crypto-js';

/**
 * Generate a secret key based on browser fingerprint and app-specific salt
 * This creates a unique key per browser/device
 */
const generateSecretKey = (): string => {
  // Create a browser fingerprint using available browser information
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    window.screen.width,
    window.screen.height,
    new Date().getTimezoneOffset(),
    // Add app-specific salt
    'BasicAuthApp_2024_SecretSalt_v1',
  ].join('|');

  // Generate a consistent key from the fingerprint
  return CryptoJS.SHA256(fingerprint).toString();
};

// Get the encryption key
const ENCRYPTION_KEY = generateSecretKey();

/**
 * Encrypt data for localStorage storage
 */
export const encryptData = (data: any): string => {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);

    // Encrypt the JSON string
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();

    // Add a prefix to identify encrypted data
    return `encrypted:${encrypted}`;
  } catch (error) {
    console.error('❌ Encryption failed:', error);
    // Fallback to unencrypted data in case of error
    return JSON.stringify(data);
  }
};

/**
 * Decrypt data from localStorage
 */
export const decryptData = (encryptedData: string): any => {
  try {
    // Check if data is encrypted
    if (!encryptedData.startsWith('encrypted:')) {
      // Data is not encrypted, parse as regular JSON
      return JSON.parse(encryptedData);
    }

    // Remove the prefix
    const encryptedString = encryptedData.replace('encrypted:', '');

    // Decrypt the data
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, ENCRYPTION_KEY);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // Parse the decrypted JSON
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('❌ Decryption failed:', error);
    // Return null if decryption fails
    return null;
  }
};

/**
 * Secure localStorage wrapper with encryption
 */
export const secureLocalStorage = {
  /**
   * Set encrypted item in localStorage
   */
  setItem: (key: string, value: any): void => {
    try {
      const encryptedValue = encryptData(value);
      localStorage.setItem(key, encryptedValue);
      console.log(`🔐 Encrypted data stored for key: ${key}`);
    } catch (error) {
      console.error('❌ Failed to store encrypted data:', error);
    }
  },

  /**
   * Get and decrypt item from localStorage
   */
  getItem: (key: string): any => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      const decryptedValue = decryptData(encryptedValue);
      console.log(`🔓 Decrypted data retrieved for key: ${key}`);
      return decryptedValue;
    } catch (error) {
      console.error('❌ Failed to retrieve encrypted data:', error);
      return null;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
    console.log(`🗑️ Encrypted data removed for key: ${key}`);
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    localStorage.clear();
    console.log('🗑️ All encrypted localStorage data cleared');
  },
};

/**
 * Test encryption/decryption functionality
 */
export const testEncryption = (): boolean => {
  try {
    const testData = {
      user: { name: 'Test User', email: 'test@example.com' },
      token: 'test-jwt-token',
      timestamp: Date.now(),
    };

    // Test encryption
    const encrypted = encryptData(testData);
    console.log('🔐 Encrypted test data:', encrypted.substring(0, 50) + '...');

    // Test decryption
    const decrypted = decryptData(encrypted);
    console.log('🔓 Decrypted test data:', decrypted);

    // Verify data integrity
    const isValid = JSON.stringify(testData) === JSON.stringify(decrypted);
    console.log('✅ Encryption test result:', isValid ? 'PASSED' : 'FAILED');

    return isValid;
  } catch (error) {
    console.error('❌ Encryption test failed:', error);
    return false;
  }
};

/**
 * Development helper: Make encryption utilities available in console
 */
if (process.env.NODE_ENV === 'development') {
  (window as any).testEncryption = testEncryption;
  (window as any).secureLocalStorage = secureLocalStorage;

  console.log('🔐 Encryption utilities available:');
  console.log('  - window.testEncryption()');
  console.log('  - window.secureLocalStorage');
}

export default secureLocalStorage;
