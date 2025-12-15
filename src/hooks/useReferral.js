/**
 * useReferral Hook
 * Helper for referral operations
 */

import { useBalance } from '../contexts/BalanceContext';
import { useAuth } from '../contexts/AuthContext';

export const useReferral = () => {
  const {
    referralStats,
    validateReferralCode,
    applyReferralCode,
    getReferralStats,
    getReferralCode,
    isLoading,
  } = useBalance();

  const { user } = useAuth();

  /**
   * Check if user was referred
   */
  const wasReferred = () => {
    return !!user?.referredBy;
  };

  /**
   * Check if user can apply referral code
   */
  const canApplyReferral = () => {
    return !wasReferred();
  };

  return {
    // State
    referralStats,
    referralCode: getReferralCode(),
    isLoading,

    // Methods
    validateReferralCode,
    applyReferralCode,
    getReferralStats,
    wasReferred,
    canApplyReferral,
  };
};

export default useReferral;
