/**
 * Balance Context
 * Manages call balance and referral data
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {BalanceService, ReferralService} from '../services/api';
import {useToast} from '../components/common/Toast/ToastProvider';
import {useAuth} from './AuthContext';

const BalanceContext = createContext();

export const BalanceProvider = ({children}) => {
  const {user, isAuthenticated, updateUser} = useAuth();
  const {showSuccess, showError} = useToast();

  const [balance, setBalance] = useState(0);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load balance when authenticated
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      setBalance(user.callBalance || 0);
      loadBalance();
    } else {
      setBalance(0);
      setBalanceHistory([]);
      setReferralStats(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  /**
   * Get current balance
   */
  const loadBalance = useCallback(async () => {
    if (!user || !user._id) {
      return {success: false, error: 'Not authenticated'};
    }

    try {
      const response = await BalanceService.get(user._id);

      if (response.success) {
        setBalance(response.data.balance);
        await updateUser({callBalance: response.data.balance});
        return {success: true, data: response.data};
      }

      return {success: false};
    } catch (error) {
      console.error('Failed to load balance:', error);
      return {success: false, error: error.message};
    }
  }, [user, updateUser]);

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
        const response = await BalanceService.history(user._id, limit);

        if (response.success) {
          setBalanceHistory(response.data);
          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        showError('Failed to load balance history');
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [user, showError],
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
      setBalance(newBalance);
      await updateUser({callBalance: newBalance});

      return {success: true, balance: newBalance};
    },
    [balance, updateUser, showError],
  );

  /**
   * Add balance (for rewards/purchases)
   */
  const addBalance = useCallback(
    async amount => {
      const newBalance = balance + amount;
      setBalance(newBalance);
      await updateUser({callBalance: newBalance});

      showSuccess(`+${amount} calls added to your balance!`);

      return {success: true, balance: newBalance};
    },
    [balance, updateUser, showSuccess],
  );

  /**
   * Validate referral code
   */
  const validateReferralCode = useCallback(
    async code => {
      try {
        const response = await ReferralService.validate(code);

        if (response.success && response.data.valid) {
          return {
            success: true,
            data: response.data,
          };
        }

        throw new Error('Invalid referral code');
      } catch (error) {
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
        const response = await ReferralService.apply(user._id, code);

        if (response.success) {
          const {reward, newBalance} = response.data;

          setBalance(newBalance);
          await updateUser({
            callBalance: newBalance,
            referredBy: response.data.referrerId,
          });

          showSuccess(`🎉 ${reward} free calls added to your account!`);

          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        showError(error.message || 'Failed to apply referral code');
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [user, updateUser, showSuccess, showError],
  );

  /**
   * Get referral stats
   */
  const getReferralStats = useCallback(async () => {
    if (!user) {
      return {success: false, error: 'Not authenticated'};
    }

    try {
      setIsLoading(true);
      const response = await ReferralService.getStats(user._id);

      if (response.success) {
        setReferralStats(response.data);
        return {success: true, data: response.data};
      }

      return {success: false};
    } catch (error) {
      showError('Failed to load referral stats');
      return {success: false, error: error.message};
    } finally {
      setIsLoading(false);
    }
  }, [user, showError]);

  /**
   * Get user's referral code
   */
  const getReferralCode = useCallback(() => {
    return user?.referralCode || null;
  }, [user]);

  /**
   * Check if balance is low
   */
  const isBalanceLow = useCallback(() => {
    return balance < 5; // LOW_BALANCE_THRESHOLD
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
