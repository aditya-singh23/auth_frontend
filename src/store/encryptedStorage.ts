/**
 * Encrypted Storage for Redux Persist
 *
 * Custom storage engine that encrypts data before storing in localStorage
 * and decrypts when retrieving.
 */

import { encryptData, decryptData } from '../utils/encryption';

/**
 * Encrypted localStorage wrapper for Redux Persist
 */
const encryptedStorage = {
  /**
   * Get item from localStorage and decrypt it
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      // If it's already encrypted data, decrypt it
      if (encryptedValue.startsWith('encrypted:')) {
        const decryptedValue = decryptData(encryptedValue);
        return JSON.stringify(decryptedValue);
      }

      // If it's not encrypted (legacy data), return as-is
      return encryptedValue;
    } catch (error) {
      console.error('❌ Failed to decrypt stored data:', error);
      return null;
    }
  },

  /**
   * Encrypt item and store in localStorage
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Parse the value to encrypt it properly
      const parsedValue = JSON.parse(value);
      const encryptedValue = encryptData(parsedValue);

      localStorage.setItem(key, encryptedValue);
      // console.log(`🔐 Encrypted data stored for key: ${key}`); // Reduced logging
    } catch (error) {
      console.error('❌ Failed to encrypt and store data:', error);
      // Fallback to unencrypted storage
      localStorage.setItem(key, value);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    // console.log(`🗑️ Removed encrypted data for key: ${key}`); // Reduced logging
  },
};

export default encryptedStorage;
