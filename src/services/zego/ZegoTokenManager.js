import AsyncStorage from '@react-native-async-storage/async-storage';
import {ContactService} from '../api';

const TOKEN_KEY = 'ZEGO_TOKEN';
const TOKEN_EXPIRY_KEY = 'ZEGO_TOKEN_EXPIRY';
const TOKEN_REFRESH_BUFFER = 24 * 60 * 60 * 1000; // 1 day before expiry

export class ZegoTokenManager {
  static currentToken = null;
  static tokenExpiry = null;

  /**
   * Get stored token from memory or AsyncStorage
   */
  static async getStoredToken() {
    try {
      // Check memory cache first
      if (this.currentToken && this.tokenExpiry) {
        const now = Date.now();
        if (now < this.tokenExpiry - TOKEN_REFRESH_BUFFER) {
          console.log('✅ Using cached token');
          return this.currentToken;
        }
      }

      // Check AsyncStorage
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const expiry = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);

      if (token && expiry) {
        const expiryTime = parseInt(expiry, 10);
        const now = Date.now();

        if (now < expiryTime - TOKEN_REFRESH_BUFFER) {
          console.log('✅ Using stored token');
          this.currentToken = token;
          this.tokenExpiry = expiryTime;
          return token;
        } else {
          console.log('🔑 Token expires within 1 day, needs refresh');
        }
      } else {
        console.log('🔑 No stored token, needs refresh');
      }

      return null;
    } catch (error) {
      console.error('❌ Error reading stored token:', error);
      return null;
    }
  }

  /**
   * Fetch new token from backend using ContactService.initiateCall
   */
  static async fetchToken() {
    try {
      console.log('📞 Fetching Zego token...');

      const response = await ContactService.fetchToken();

      if (response?.success && response?.data?.token) {
        const {token, timestamp} = response.data;

        // Calculate expiry from timestamp (token typically valid for 24 hours)
        const expiry = (timestamp + 86400) * 1000; // timestamp + 24 hours, convert to milliseconds

        // Store token
        await this.storeToken(token, expiry);

        console.log('✅ Zego token fetched successfully');
        return token;
      } else {
        throw new Error('Invalid token response from server');
      }
    } catch (error) {
      console.error('❌ Failed to fetch Zego token:', error);
      throw error;
    }
  }

  /**
   * Store token in memory and AsyncStorage
   */
  static async storeToken(token, expiry) {
    try {
      // Convert expiry to timestamp if it's a number (seconds)
      const expiryTimestamp =
        typeof expiry === 'number' && expiry < 10000000000
          ? expiry * 1000 // Convert seconds to milliseconds
          : expiry;

      this.currentToken = token;
      this.tokenExpiry = expiryTimestamp;

      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTimestamp.toString());

      console.log('✅ Zego token stored successfully');
    } catch (error) {
      console.error('❌ Error storing token:', error);
    }
  }

  /**
   * Ensure valid token is available
   * Returns cached token if valid, otherwise fetches new one
   */
  static async ensureValidToken() {
    try {
      // Try to get stored token first
      const storedToken = await this.getStoredToken();
      if (storedToken) {
        return storedToken;
      }

      // Fetch new token if none available or expired
      return await this.fetchToken();
    } catch (error) {
      console.error('❌ Failed to ensure valid token:', error);
      throw error;
    }
  }

  /**
   * ✅ NEW: Fetch and store token (used in AuthContext)
   */
  static async fetchAndStore() {
    return await this.fetchToken();
  }

  /**
   * ✅ NEW: Check if token needs refresh (used in App.js)
   */
  static async needsRefresh() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const expiry = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);

      if (!token || !expiry) {
        return true;
      }

      const expiryTime = parseInt(expiry, 10);
      const now = Date.now();

      // Return true if token expires within 1 day
      return now >= expiryTime - TOKEN_REFRESH_BUFFER;
    } catch (error) {
      console.error('❌ Error checking token refresh:', error);
      return true; // Refresh on error to be safe
    }
  }

  /**
   * Clear token (on logout)
   */
  static async clearToken() {
    try {
      this.currentToken = null;
      this.tokenExpiry = null;
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(TOKEN_EXPIRY_KEY);
      console.log('✅ Zego token cleared');
    } catch (error) {
      console.error('❌ Error clearing token:', error);
    }
  }

  /**
   * Token provider callback for Zego SDK
   */
  static async getToken() {
    try {
      console.log('🔑 Zego requesting token...');
      const token = await this.ensureValidToken();
      console.log('✅ Zego token provided');
      return token;
    } catch (error) {
      console.error('❌ Failed to provide token:', error);
      throw error;
    }
  }
}
