/**
 * Auth Context
 * Manages authentication state and operations
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {AuthService} from '../services/api';
import SecureStorage from '../services/storage/SecureStorage';
import GoogleSignInService from '../services/auth/GoogleSignInService';
import {useToast} from '../components/common/Toast/ToastProvider';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const {showSuccess, showError} = useToast();

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Configure Google Sign-In
      GoogleSignInService.configure();

      // Check for stored tokens
      const tokens = await SecureStorage.getTokens();
      const storedUser = await SecureStorage.getUserData();

      if (tokens.authToken && storedUser) {
        setAuthToken(tokens.authToken);
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // ✅ CHANGED: Use clearAllData instead of clearAuth
      await SecureStorage.clearAllData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google Sign-In (Primary Method)
   */
  const googleLogin = useCallback(async () => {
    try {
      setIsLoading(true);

      // Step 1: Sign in with Google
      const googleResult = await GoogleSignInService.signIn();

      if (!googleResult.success) {
        if (googleResult.cancelled) {
          return {success: false, cancelled: true};
        }
        throw new Error(googleResult.error);
      }

      // Step 2: Send to backend
      const response = await AuthService.socialLogin(googleResult.data);

      if (response.success) {
        const backendData = response.data;
        console.log('✅ Google login successful:', backendData);

        // Map backend response to app structure
        const userData = {
          _id: backendData._id,
          userId: backendData._id,
          firstName: backendData.firstName,
          lastName: backendData.lastName,
          fullName: backendData.fullName,
          email: backendData.email,
          phoneNumber: backendData.phoneNumber || '',
          deviceType: backendData.deviceType,
          fcmToken: Array.isArray(backendData.fcmToken)
            ? backendData.fcmToken
            : [backendData.fcmToken],
          referralCode: backendData.referralCode,
          callBalance: backendData.callBalance || 0,
          alertBalance: backendData.alertBalance || 0,
          photo: googleResult.data.photo || null,
          // Statistics (will be fetched from /user/home later)
          vehicleSearched: 0,
          timesContacted: 0,
          vehicleRegistered: 0,
        };

        // Save to secure storage (backend returns single 'token', no separate refresh token)
        await SecureStorage.saveTokens(backendData.token, backendData.token);
        await SecureStorage.saveUserData(userData);

        // Update state
        setUser(userData);
        setAuthToken(backendData.token);
        setIsAuthenticated(true);

        showSuccess('Welcome to QR Parking!');

        return {
          success: true,
          user: userData,
          isFirstTime: backendData.isFirstTime || false, // ✅ Add this for referral screen
        };
      }

      throw new Error('Backend login failed');
    } catch (error) {
      console.error('❌ Google login error:', error);
      showError(error.message || 'Login failed. Please try again.');
      return {success: false, error: error.message};
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  /**
   * Social login (Generic method - kept for compatibility)
   */
  const socialLogin = useCallback(
    async loginData => {
      try {
        setIsLoading(true);

        const response = await AuthService.socialLogin(loginData);

        if (response.success) {
          const backendData = response.data;

          const userData = {
            _id: backendData._id,
            userId: backendData._id,
            firstName: backendData.firstName,
            lastName: backendData.lastName,
            fullName: backendData.fullName,
            email: backendData.email,
            phoneNumber: backendData.phoneNumber || '',
            deviceType: backendData.deviceType,
            fcmToken: Array.isArray(backendData.fcmToken)
              ? backendData.fcmToken
              : [backendData.fcmToken],
            referralCode: backendData.referralCode,
            callBalance: backendData.callBalance || 0,
            alertBalance: backendData.alertBalance || 0,
            photo: loginData.photo || null,
            vehicleSearched: 0,
            timesContacted: 0,
            vehicleRegistered: 0,
          };

          await SecureStorage.saveTokens(backendData.token, backendData.token);
          await SecureStorage.saveUserData(userData);

          setUser(userData);
          setAuthToken(backendData.token);
          setIsAuthenticated(true);

          showSuccess('Welcome!');

          return {
            success: true,
            user: userData,
          };
        }

        return {success: false};
      } catch (error) {
        showError(error.message || 'Login failed. Please try again.');
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess, showError],
  );

  /**
   * Logout (No backend API - local cleanup only)
   * ✅ UPDATED: Complete cleanup to prevent data leaking between accounts
   */
  const logout = useCallback(async () => {
    try {
      console.log('🚪 Logging out...');

      // ✅ 1. Clear state FIRST (immediate UI update)
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);

      // ✅ 2. Sign out from Google (don't block on this)
      try {
        await GoogleSignInService.signOut();
        console.log('✅ Signed out from Google');
      } catch (googleError) {
        console.error('⚠️ Google sign-out error (non-critical):', googleError);
      }

      // ✅ 3. Clear ALL storage (complete wipe)
      await SecureStorage.clearAllData();
      console.log('✅ All storage cleared');

      return {success: true};
    } catch (error) {
      console.error('❌ Logout error:', error);

      // ✅ Even if something fails, still clear everything
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);

      // Force clear storage
      try {
        await SecureStorage.clearAllData();
      } catch (clearError) {
        console.error('Failed to clear storage:', clearError);
      }

      return {success: true}; // Still return success
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user data in local state and storage
   * Used by UserContext after fetching fresh data
   */
  const syncUserData = useCallback(async userData => {
    try {
      setUser(userData);
      await SecureStorage.saveUserData(userData);
      return {success: true};
    } catch (error) {
      console.error('Failed to sync user data:', error);
      return {success: false, error: error.message};
    }
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    authToken,

    // Methods
    googleLogin, // Primary login method
    socialLogin, // Generic social login
    logout,
    syncUserData, // ✅ Used by UserContext to update user data
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
