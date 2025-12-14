/**
 * User Context
 * Manages user profile and preferences
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserService } from '../services/api';
import { useToast } from '../components/common/Toast/ToastProvider';
import { useAuth } from './AuthContext';
import AsyncStorage from '../services/storage/AsyncStorage';
import { STORAGE_KEYS } from '../config/constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Get user profile
   */
  const getProfile = useCallback(async () => {
    if (!user) {return { success: false, error: 'Not authenticated' };}

    try {
      setIsLoading(true);
      const response = await UserService.getProfile(user._id);

      if (response.success) {
        await updateAuthUser(response.data);
        return { success: true, data: response.data };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to load profile');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateAuthUser, showError]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates) => {
    if (!user) {return { success: false, error: 'Not authenticated' };}

    try {
      setIsLoading(true);
      const response = await UserService.updateProfile(user._id, updates);

      if (response.success) {
        await updateAuthUser(response.data);
        showSuccess('Profile updated successfully');
        return { success: true, data: response.data };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to update profile');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateAuthUser, showSuccess, showError]);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(async (preferences) => {
    if (!user) {return { success: false, error: 'Not authenticated' };}

    try {
      setIsLoading(true);
      const response = await UserService.updatePreferences(user._id, preferences);

      if (response.success) {
        const updatedUser = {
          ...user,
          preferences: { ...user.preferences, ...preferences },
        };
        await updateAuthUser(updatedUser);
        showSuccess('Preferences updated');
        return { success: true, data: response.data };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to update preferences');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateAuthUser, showSuccess, showError]);

  /**
   * Change language
   */
  const changeLanguage = useCallback(async (languageCode) => {
    try {
      await AsyncStorage.save(STORAGE_KEYS.LANGUAGE, languageCode);
      await updatePreferences({ language: languageCode });
      return { success: true };
    } catch (error) {
      console.error('Failed to change language:', error);
      return { success: false, error: error.message };
    }
  }, [updatePreferences]);

  /**
   * Toggle notification settings
   */
  const toggleNotifications = useCallback(async (enabled) => {
    try {
      await updatePreferences({ notifications: enabled });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [updatePreferences]);

  /**
   * Update profile visibility
   */
  const updateProfileVisibility = useCallback(async (visibility) => {
    try {
      await updatePreferences({ profileVisibility: visibility });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [updatePreferences]);

  /**
   * Delete account
   */
  const deleteAccount = useCallback(async () => {
    if (!user) {return { success: false, error: 'Not authenticated' };}

    try {
      setIsLoading(true);
      const response = await UserService.deleteAccount(user._id);

      if (response.success) {
        showSuccess('Account deleted successfully');
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      showError('Failed to delete account');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user, showSuccess, showError]);

  const value = {
    // State
    user,
    isLoading,

    // Methods
    getProfile,
    updateProfile,
    updatePreferences,
    changeLanguage,
    toggleNotifications,
    updateProfileVisibility,
    deleteAccount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserContext;
