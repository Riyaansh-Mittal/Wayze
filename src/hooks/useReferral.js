/**
 * useReferral Hook
 * Convenient hook for referral operations
 */

import { useBalance } from '../contexts/BalanceContext';
import { useAuth } from '../contexts/AuthContext';
import { Share } from 'react-native';

/**
 * Referral hook with helper methods
 */
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
   * Get referral URL
   */
  const getReferralUrl = () => {
    const code = getReferralCode();
    if (!code) {return null;}
    return `https://qrparking.com/refer/${code}`;
  };

  /**
   * Share referral code
   */
  const shareReferralCode = async () => {
    try {
      const code = getReferralCode();
      if (!code) {return { success: false, error: 'No referral code available' };}

      const message = `Join QR Parking using my referral code ${code} and get 10 free calls! Download now: https://qrparking.com/refer/${code}`;

      const result = await Share.share({
        message,
        title: 'Join QR Parking',
      });

      if (result.action === Share.sharedAction) {
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('Failed to share:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Copy referral code to clipboard
   */
  const copyReferralCode = async () => {
    try {
      const code = getReferralCode();
      if (!code) {return { success: false, error: 'No referral code available' };}

      // Use Clipboard API
      const Clipboard = require('@react-native-clipboard/clipboard').default;
      Clipboard.setString(code);

      return { success: true, code };
    } catch (error) {
      console.error('Failed to copy:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Get total earnings from referrals
   */
  const getTotalEarnings = () => {
    return referralStats?.totalEarned || 0;
  };

  /**
   * Get total referral count
   */
  const getTotalReferrals = () => {
    return referralStats?.totalReferrals || 0;
  };

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
    isLoading,

    // Methods
    validateReferralCode,
    applyReferralCode,
    getReferralStats,
    getReferralCode,
    getReferralUrl,
    shareReferralCode,
    copyReferralCode,
    getTotalEarnings,
    getTotalReferrals,
    wasReferred,
    canApplyReferral,
  };
};

export default useReferral;
