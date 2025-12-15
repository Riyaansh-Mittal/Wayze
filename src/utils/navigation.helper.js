/**
 * Navigation Utilities
 * Helper functions for navigation
 */

import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../navigation/navigationRef';

/**
 * Navigate and reset to a specific screen
 */
export const resetToScreen = (screenName, params = {}) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screenName, params }],
    })
  );
};

/**
 * Navigate to nested screen in tab navigator
 */
export const navigateToTab = (tabName, screenName, params = {}) => {
  navigationRef.navigate(tabName, {
    screen: screenName,
    params,
  });
};

/**
 * Navigate to Home tab
 */
export const navigateToHome = () => {
  navigationRef.navigate('Home');
};

/**
 * Navigate to Search tab
 */
export const navigateToSearch = (screenName = 'FindVehicle', params = {}) => {
  navigateToTab('Search', screenName, params);
};

/**
 * Navigate to Vehicles tab
 */
export const navigateToVehicles = (screenName = 'VehiclesList', params = {}) => {
  navigateToTab('Vehicles', screenName, params);
};

/**
 * Navigate to Profile tab
 */
export const navigateToProfile = (screenName = 'ProfileHome', params = {}) => {
  navigateToTab('Profile', screenName, params);
};

/**
 * Navigate to login
 */
export const navigateToLogin = () => {
  resetToScreen('Auth', { screen: 'Login' });
};

/**
 * Navigate to main app after login
 */
export const navigateToMain = () => {
  resetToScreen('Main');
};

/**
 * Check if can go back
 */
export const canGoBack = () => {
  return navigationRef.isReady() && navigationRef.canGoBack();
};

/**
 * Get current tab name
 */
export const getCurrentTab = () => {
  const route = navigationRef.getCurrentRoute();
  return route?.name;
};

/**
 * Get navigation params
 */
export const getNavigationParams = () => {
  const route = navigationRef.getCurrentRoute();
  return route?.params || {};
};
