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
      await SecureStorage.clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google Sign-In (NEW METHOD)
   */
  const googleLogin = useCallback(async () => {
    try {
      setIsLoading(true);

      // Step 1: Sign in with Google
      const googleResult = await GoogleSignInService.signIn();

      if (!googleResult.success) {
        if (googleResult.cancelled) {
          // User cancelled - don't show error
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
          phoneNumber: backendData.phoneNumber,
          deviceType: backendData.deviceType,
          fcmToken: Array.isArray(backendData.fcmToken)
            ? backendData.fcmToken
            : [backendData.fcmToken],
          referralCode: backendData.referralCode,
          photo: googleResult.data.photo || null,
          userInfo: backendData.userInfo || null,
          vehicles: backendData.userInfo?.vehicle || [],
          emergencyContact: backendData.userInfo?.emergencyContact || '',
          isFirstTime:
            !backendData.userInfo || backendData.userInfo.vehicle?.length === 0,
        };

        // Save to secure storage
        await SecureStorage.saveTokens(backendData.token, backendData.token); // Backend doesn't return separate refresh token
        await SecureStorage.saveUserData(userData);

        // Update state
        setUser(userData);
        setAuthToken(backendData.token);
        setIsAuthenticated(true);

        showSuccess(
          userData.isFirstTime ? 'Welcome to QR Parking!' : 'Welcome back!',
        );

        return {
          success: true,
          isFirstTime: userData.isFirstTime,
          user: userData,
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
            phoneNumber: backendData.phoneNumber,
            deviceType: backendData.deviceType,
            fcmToken: Array.isArray(backendData.fcmToken)
              ? backendData.fcmToken
              : [backendData.fcmToken],
            referralCode: backendData.referralCode,
            photo: loginData.photo || null,
            userInfo: backendData.userInfo || null,
            vehicles: backendData.userInfo?.vehicle || [],
            emergencyContact: backendData.userInfo?.emergencyContact || '',
            isFirstTime:
              !backendData.userInfo ||
              backendData.userInfo.vehicle?.length === 0,
          };

          await SecureStorage.saveTokens(backendData.token, backendData.token);
          await SecureStorage.saveUserData(userData);

          setUser(userData);
          setAuthToken(backendData.token);
          setIsAuthenticated(true);

          showSuccess(
            userData.isFirstTime
              ? 'Account created successfully!'
              : 'Welcome back!',
          );

          return {
            success: true,
            isFirstTime: userData.isFirstTime,
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
   * Logout (Updated to include Google Sign-Out)
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Call logout API
      await AuthService.logout();

      // Sign out from Google
      await GoogleSignInService.signOut();

      // Clear storage
      await SecureStorage.clearAuth();

      // Clear state
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);

      showSuccess('Logged out successfully');

      return {success: true};
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local state
      await SecureStorage.clearAuth();
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);

      return {success: true}; // Still return success since we cleared locally
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess]);

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const tokens = await SecureStorage.getTokens();

      if (!tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await AuthService.refreshToken(tokens.refreshToken);

      if (response.success) {
        await SecureStorage.saveTokens(
          response.data.token,
          response.data.refreshToken,
        );
        setAuthToken(response.data.token);
        return {success: true};
      }

      return {success: false};
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return {success: false, error: error.message};
    }
  }, [logout]);

  /**
   * Update user data locally
   */
  const updateUser = useCallback(
    async updates => {
      try {
        const updatedUser = {...user, ...updates};
        setUser(updatedUser);
        await SecureStorage.saveUserData(updatedUser);
        return {success: true};
      } catch (error) {
        console.error('Failed to update user:', error);
        return {success: false, error: error.message};
      }
    },
    [user],
  );

  /**
   * Check if user is first time
   */
  const isFirstTimeUser = useCallback(() => {
    return user?.isFirstTime || false;
  }, [user]);

  /**
   * Mark onboarding as complete
   */
  const completeOnboarding = useCallback(async () => {
    if (user) {
      await updateUser({isFirstTime: false});
    }
  }, [user, updateUser]);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    authToken,

    // Methods
    googleLogin, // ✅ NEW: Primary Google login method
    socialLogin, // Generic social login
    logout,
    refreshToken,
    updateUser,
    isFirstTimeUser,
    completeOnboarding,
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
