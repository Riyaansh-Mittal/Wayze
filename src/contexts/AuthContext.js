/**
 * Auth Context
 * Manages authentication state and operations
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/api';
import SecureStorage from '../services/storage/SecureStorage';
import { useToast } from '../components/common/Toast/ToastProvider';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const { showSuccess, showError } = useToast();

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

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
      // Clear potentially corrupted data
      await SecureStorage.clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Social login (Google/Apple)
   */
  const socialLogin = useCallback(async (loginData) => {
    try {
      setIsLoading(true);

      const response = await AuthService.socialLogin(loginData);

      if (response.success) {
        const { user: userData, token, refreshToken, isFirstTime } = response.data;

        // Save to storage
        await SecureStorage.saveTokens(token, refreshToken);
        await SecureStorage.saveUserData(userData);

        // Update state
        setUser(userData);
        setAuthToken(token);
        setIsAuthenticated(true);

        showSuccess(isFirstTime ? 'Account created successfully!' : 'Welcome back!');

        return { success: true, isFirstTime, user: userData };
      }

      return { success: false };
    } catch (error) {
      showError(error.message || 'Login failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Call logout API
      await AuthService.logout();

      // Clear storage
      await SecureStorage.clearAuth();

      // Clear state
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);

      showSuccess('Logged out successfully');

      return { success: true };
    } catch (error) {
      showError('Logout failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

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
          response.data.refreshToken
        );
        setAuthToken(response.data.token);
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Force logout on refresh failure
      await logout();
      return { success: false, error: error.message };
    }
  }, [logout]);

  /**
   * Update user data locally
   */
  const updateUser = useCallback(async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await SecureStorage.saveUserData(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Failed to update user:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

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
      await updateUser({ isFirstTime: false });
    }
  }, [user, updateUser]);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    authToken,

    // Methods
    socialLogin,
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
