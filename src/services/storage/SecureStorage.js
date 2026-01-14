/**
 * Secure Storage Wrapper
 * For storing sensitive data like tokens
 * Uses AsyncStorage (can be upgraded to react-native-keychain for production)
 */

import AsyncStorage from './AsyncStorage';
import {STORAGE_KEYS} from '../../config/constants';

/**
 * Save auth token
 */
export const saveAuthToken = async token => {
  return await AsyncStorage.save(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Get auth token
 */
export const getAuthToken = async () => {
  return await AsyncStorage.get(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Save refresh token
 */
export const saveRefreshToken = async token => {
  return await AsyncStorage.save(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Get refresh token
 */
export const getRefreshToken = async () => {
  return await AsyncStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Save both tokens
 */
export const saveTokens = async (authToken, refreshToken) => {
  return await AsyncStorage.saveMultiple([
    [STORAGE_KEYS.AUTH_TOKEN, authToken],
    [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
  ]);
};

/**
 * Get both tokens
 */
export const getTokens = async () => {
  const result = await AsyncStorage.getMultiple([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
  ]);

  return {
    authToken: result[STORAGE_KEYS.AUTH_TOKEN],
    refreshToken: result[STORAGE_KEYS.REFRESH_TOKEN],
  };
};

/**
 * Clear all auth data
 */
export const clearAuth = async () => {
  return await AsyncStorage.removeMultiple([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.USER_DATA,
  ]);
};

// ✅ NEW: Clear ALL app data (complete logout)
/**
 * Clear all app data (tokens, user data, cache, etc.)
 * Use this on logout to prevent data leaking between accounts
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ All storage cleared');
    return {success: true};
  } catch (error) {
    console.error('❌ Error clearing all storage:', error);
    return {success: false, error};
  }
};

/**
 * Save user data
 */
export const saveUserData = async userData => {
  return await AsyncStorage.save(STORAGE_KEYS.USER_DATA, userData);
};

/**
 * Get user data
 */
export const getUserData = async () => {
  return await AsyncStorage.get(STORAGE_KEYS.USER_DATA);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return !!token;
};

// For production, consider using react-native-keychain:
// import * as Keychain from 'react-native-keychain';
//
// export const saveTokens = async (authToken, refreshToken) => {
//   await Keychain.setGenericPassword('auth', authToken);
//   await Keychain.setGenericPassword('refresh', refreshToken);
// };

export default {
  saveAuthToken,
  getAuthToken,
  saveRefreshToken,
  getRefreshToken,
  saveTokens,
  getTokens,
  clearAuth,
  clearAllData, // ✅ NEW: Export this
  saveUserData,
  getUserData,
  isAuthenticated,
};
