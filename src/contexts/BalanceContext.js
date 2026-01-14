import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {BalanceService, ReferralService} from '../services/api';
import {useToast} from '../components/common/Toast/ToastProvider';
import {useAuth} from './AuthContext';

const BalanceContext = createContext();

export const BalanceProvider = ({children}) => {
  const {user, isAuthenticated, updateUserData} = useAuth();
  const {showSuccess, showError} = useToast();

  const [balance, setBalance] = useState(0);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Track if data has been loaded for this user
  const hasLoadedBalanceRef = useRef(false);
  const hasLoadedReferralRef = useRef(false);
  const currentUserIdRef = useRef(null);

  /**
   * Load balance when authenticated
   * ✅ FIXED: Only load once per user session
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      const userBalance = user.callBalance || 0;
      setBalance(userBalance);
      console.log('💰 Balance initialized from user:', userBalance);

      if (currentUserIdRef.current !== user._id) {
        console.log('🔄 User changed, resetting load flags');
        hasLoadedBalanceRef.current = false;
        hasLoadedReferralRef.current = false;
        currentUserIdRef.current = user._id;
      }
    } else {
      console.log('🧹 Clearing balance data (logged out)');
      setBalance(0);
      setBalanceHistory([]);
      setReferralStats(null);
      hasLoadedBalanceRef.current = false;
      hasLoadedReferralRef.current = false;
      currentUserIdRef.current = null;
    }
  }, [isAuthenticated, user?._id, user?.callBalance, loadBalance, user]);

  /**
   * Get current balance
   * ✅ Manual load only
   */
  const loadBalance = useCallback(async () => {
    if (!user) {
      console.log('⏭️ No user, skipping balance load');
      return {success: false, error: 'Not authenticated'};
    }

    try {
      console.log('💰 Loading balance from API...');

      const response = await BalanceService.get();

      if (response.success) {
        const newBalance =
          response.data.balance || response.data.callBalance || 0;
        console.log('✅ Balance loaded from API:', newBalance);

        setBalance(newBalance);
        hasLoadedBalanceRef.current = true;

        if (updateUserData) {
          await updateUserData({callBalance: newBalance});
        }

        return {success: true, data: response.data};
      }

      return {success: false};
    } catch (error) {
      console.error('❌ Failed to load balance:', error);
      return {success: false, error: error.message};
    }
  }, [user, updateUserData]);

  /**
   * Get balance history
   */
  const getBalanceHistory = useCallback(
    async (limit = 20) => {
      if (!user) {
        return {success: false, error: 'Not authenticated'};
      }

      try {
        setIsLoading(true);
        console.log('📜 Loading balance history...');

        const response = await BalanceService.history(limit);

        if (response.success) {
          console.log('✅ Balance history loaded:', response.data?.length || 0);
          setBalanceHistory(response.data || []);
          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        console.error('❌ Failed to load balance history:', error);
        // Don't show toast - let caller handle
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  /**
   * Deduct balance (for calls/contacts)
   */
  const deductBalance = useCallback(
    async amount => {
      if (balance < amount) {
        showError('Insufficient balance');
        return {success: false, error: 'Insufficient balance'};
      }

      const newBalance = balance - amount;
      console.log(`💸 Deducting ${amount} credits. New balance: ${newBalance}`);

      setBalance(newBalance);

      if (updateUserData) {
        await updateUserData({callBalance: newBalance});
      }

      return {success: true, balance: newBalance};
    },
    [balance, updateUserData, showError],
  );

  /**
   * Add balance (for rewards/purchases)
   */
  const addBalance = useCallback(
    async amount => {
      const newBalance = balance + amount;
      console.log(`💰 Adding ${amount} credits. New balance: ${newBalance}`);

      setBalance(newBalance);

      if (updateUserData) {
        await updateUserData({callBalance: newBalance});
      }

      showSuccess(`+${amount} calls added to your balance!`);

      return {success: true, balance: newBalance};
    },
    [balance, updateUserData, showSuccess],
  );

  /**
   * Validate referral code
   */
  const validateReferralCode = useCallback(
    async code => {
      try {
        console.log('🔍 Validating referral code:', code);
        const response = await ReferralService.validate(code);

        if (response.success && response.data.valid) {
          console.log('✅ Referral code valid');
          return {
            success: true,
            data: response.data,
          };
        }

        throw new Error('Invalid referral code');
      } catch (error) {
        console.error('❌ Invalid referral code:', error);
        showError(error.message || 'Invalid referral code');
        return {success: false, error: error.message};
      }
    },
    [showError],
  );

  /**
   * Apply referral code
   */
  const applyReferralCode = useCallback(
    async code => {
      if (!user) {
        return {success: false, error: 'Not authenticated'};
      }

      try {
        setIsLoading(true);
        console.log('🎁 Applying referral code:', code);

        const response = await ReferralService.apply(code);

        if (response.success) {
          const {reward, newBalance} = response.data;
          console.log('✅ Referral applied! Reward:', reward);

          setBalance(newBalance);

          if (updateUserData) {
            await updateUserData({
              callBalance: newBalance,
              referredBy: response.data.referrerId,
            });
          }

          showSuccess(`🎉 ${reward} free calls added to your account!`);

          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        console.error('❌ Failed to apply referral:', error);
        showError(error.message || 'Failed to apply referral code');
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [user, updateUserData, showSuccess, showError],
  );

  /**
   * Get referral stats
   * ✅ FIXED: Added debounce protection
   */
  const getReferralStats = useCallback(async () => {
    if (!user) {
      console.log('⏭️ No user, skipping referral stats load');
      return {success: false, error: 'Not authenticated'};
    }

    // ✅ Prevent duplicate calls
    if (hasLoadedReferralRef.current) {
      console.log('⏭️ Referral stats already loaded, using cached data');
      return {success: true, data: referralStats};
    }

    try {
      setIsLoading(true);
      console.log('📊 Loading referral stats...');

      const response = await ReferralService.getStats();

      if (response.success) {
        console.log('✅ Referral stats loaded');
        setReferralStats(response.data);
        hasLoadedReferralRef.current = true;
        return {success: true, data: response.data};
      }

      return {success: false};
    } catch (error) {
      console.error('❌ Failed to load referral stats:', error);
      // Don't show toast - let caller handle
      return {success: false, error: error.message};
    } finally {
      setIsLoading(false);
    }
  }, [user, referralStats]);

  /**
   * Get user's referral code
   */
  const getReferralCode = useCallback(() => {
    return user?.referralCode || null;
  }, [user]);

  /**
   * Check if user can make a contact (has at least 1 credit)
   */
  const canMakeContact = useCallback(() => {
    return balance >= 1;
  }, [balance]);

  /**
   * Check if balance is low
   */
  const isBalanceLow = useCallback(() => {
    return balance < 5;
  }, [balance]);

  const value = {
    // State
    balance,
    balanceHistory,
    referralStats,
    isLoading,

    // Methods
    loadBalance,
    getBalanceHistory,
    deductBalance,
    addBalance,
    validateReferralCode,
    applyReferralCode,
    getReferralStats,
    getReferralCode,
    canMakeContact,
    isBalanceLow,
  };

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within BalanceProvider');
  }
  return context;
};

export default BalanceContext;
