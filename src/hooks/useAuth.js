/**
 * useAuth Hook
 * Convenient hook for auth operations
 * Re-exports AuthContext hook for consistency
 */

import { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * Auth hook with additional helper methods
 */
export const useAuth = () => {
  const auth = useAuthContext();

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission) => {
    // Add permission logic here when needed
    return true;
  };

  /**
   * Get user's full name
   */
  const getUserName = () => {
    return auth.user?.fullName || 'User';
  };

  /**
   * Get user's email
   */
  const getUserEmail = () => {
    return auth.user?.email || '';
  };

  /**
   * Check if email is verified
   */
  const isEmailVerified = () => {
    return auth.user?.verification?.email || false;
  };

  /**
   * Check if phone is verified
   */
  const isPhoneVerified = () => {
    return auth.user?.verification?.phone || false;
  };

  return {
    ...auth,
    hasPermission,
    getUserName,
    getUserEmail,
    isEmailVerified,
    isPhoneVerified,
  };
};

export default useAuth;
