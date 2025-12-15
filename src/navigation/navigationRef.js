/**
 * Navigation Reference
 * Allows navigation outside of React components
 */

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigate to a screen
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

/**
 * Go back
 */
export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

/**
 * Reset navigation state
 */
export function reset(state) {
  if (navigationRef.isReady()) {
    navigationRef.reset(state);
  }
}

/**
 * Get current route name
 */
export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
}
