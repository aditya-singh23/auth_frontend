import SecureLS from 'secure-ls';
import { User } from '../types';

/**
 * Secure Storage Utility - Enhanced security for user data storage
 *
 * This utility uses secure-ls to provide encrypted local storage
 * for sensitive user data like tokens and user information.
 */

// TypeScript interface for secure-ls (removed unused interface)

interface SecureLSInstance {
  set(key: string, data: any): void;
  get(key: string): any;
  remove(key: string): void;
  removeAll(): void;
  clear(): void;
  getAllKeys(): string[];
}

// Configuration for secure storage
const SECURE_LS_CONFIG = {
  encodingType: 'aes', // Use AES encryption
  isCompression: true, // Enable compression
  encryptionSecret: process.env.REACT_APP_ENCRYPTION_SECRET || 'basic-auth-app-secret-key-2024',
  encryptionNamespace: 'BasicAuthApp',
};

// Create secure storage instance
const secureStorageInstance = new SecureLS(SECURE_LS_CONFIG) as SecureLSInstance;

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  PREFERENCES: 'user_preferences',
  SESSION: 'session_data',
} as const;

/**
 * Secure Storage Service
 */
export class SecureStorageService {
  private static instance: SecureStorageService;
  private storage: SecureLSInstance;

  private constructor() {
    this.storage = secureStorageInstance;
  }

  public static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  // Token management
  public setToken(token: string): void {
    try {
      this.storage.set(STORAGE_KEYS.TOKEN, token);
      console.log('🔐 Token stored securely');
    } catch (error) {
      console.error('❌ Failed to store token securely:', error);
      // Fallback to regular localStorage
      localStorage.setItem('token', token);
    }
  }

  public getToken(): string | null {
    try {
      const token = this.storage.get(STORAGE_KEYS.TOKEN);
      return token || null;
    } catch (error) {
      console.error('❌ Failed to retrieve token securely:', error);
      // Fallback to regular localStorage
      return localStorage.getItem('token');
    }
  }

  public removeToken(): void {
    try {
      this.storage.remove(STORAGE_KEYS.TOKEN);
      console.log('🗑️ Token removed securely');
    } catch (error) {
      console.error('❌ Failed to remove token securely:', error);
      // Fallback to regular localStorage
      localStorage.removeItem('token');
    }
  }

  // User data management
  public setUser(user: User): void {
    try {
      this.storage.set(STORAGE_KEYS.USER, user);
      console.log('🔐 User data stored securely');
    } catch (error) {
      console.error('❌ Failed to store user data securely:', error);
      // Fallback to regular localStorage
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  public getUser(): User | null {
    try {
      const user = this.storage.get(STORAGE_KEYS.USER);
      return user || null;
    } catch (error) {
      console.error('❌ Failed to retrieve user data securely:', error);
      // Fallback to regular localStorage
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
  }

  public removeUser(): void {
    try {
      this.storage.remove(STORAGE_KEYS.USER);
      console.log('🗑️ User data removed securely');
    } catch (error) {
      console.error('❌ Failed to remove user data securely:', error);
      // Fallback to regular localStorage
      localStorage.removeItem('user');
    }
  }

  // Session management
  public setSessionData(data: Record<string, any>): void {
    try {
      this.storage.set(STORAGE_KEYS.SESSION, data);
      console.log('🔐 Session data stored securely');
    } catch (error) {
      console.error('❌ Failed to store session data securely:', error);
    }
  }

  public getSessionData(): Record<string, any> | null {
    try {
      const data = this.storage.get(STORAGE_KEYS.SESSION);
      return data || null;
    } catch (error) {
      console.error('❌ Failed to retrieve session data securely:', error);
      return null;
    }
  }

  public removeSessionData(): void {
    try {
      this.storage.remove(STORAGE_KEYS.SESSION);
      console.log('🗑️ Session data removed securely');
    } catch (error) {
      console.error('❌ Failed to remove session data securely:', error);
    }
  }

  // User preferences
  public setPreferences(preferences: Record<string, any>): void {
    try {
      this.storage.set(STORAGE_KEYS.PREFERENCES, preferences);
      console.log('🔐 Preferences stored securely');
    } catch (error) {
      console.error('❌ Failed to store preferences securely:', error);
    }
  }

  public getPreferences(): Record<string, any> | null {
    try {
      const preferences = this.storage.get(STORAGE_KEYS.PREFERENCES);
      return preferences || null;
    } catch (error) {
      console.error('❌ Failed to retrieve preferences securely:', error);
      return null;
    }
  }

  // Clear all secure data
  public clearAll(): void {
    try {
      this.storage.clear();
      console.log('🧹 All secure data cleared');
    } catch (error) {
      console.error('❌ Failed to clear secure data:', error);
      // Fallback to regular localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Get all stored keys (for debugging)
  public getAllKeys(): string[] {
    try {
      return this.storage.getAllKeys();
    } catch (error) {
      console.error('❌ Failed to get all keys:', error);
      return [];
    }
  }

  // Check if secure storage is working
  public isSecureStorageWorking(): boolean {
    try {
      const testKey = '__test__';
      const testValue = 'test';
      this.storage.set(testKey, testValue);
      const retrieved = this.storage.get(testKey);
      this.storage.remove(testKey);
      return retrieved === testValue;
    } catch (error) {
      console.error('❌ Secure storage test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const secureStorageService = SecureStorageService.getInstance();

// Export convenience functions
export const secureStorage = {
  // Token methods
  setToken: (token: string) => secureStorageService.setToken(token),
  getToken: () => secureStorageService.getToken(),
  removeToken: () => secureStorageService.removeToken(),

  // User methods
  setUser: (user: User) => secureStorageService.setUser(user),
  getUser: () => secureStorageService.getUser(),
  removeUser: () => secureStorageService.removeUser(),

  // Session methods
  setSessionData: (data: Record<string, any>) => secureStorageService.setSessionData(data),
  getSessionData: () => secureStorageService.getSessionData(),
  removeSessionData: () => secureStorageService.removeSessionData(),

  // Preferences methods
  setPreferences: (preferences: Record<string, any>) =>
    secureStorageService.setPreferences(preferences),
  getPreferences: () => secureStorageService.getPreferences(),

  // Utility methods
  clearAll: () => secureStorageService.clearAll(),
  getAllKeys: () => secureStorageService.getAllKeys(),
  isWorking: () => secureStorageService.isSecureStorageWorking(),
};

export default secureStorage;
