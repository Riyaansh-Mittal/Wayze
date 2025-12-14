/**
 * useBalance Hook
 * Convenient hook for balance operations
 * Re-exports BalanceContext hook with helpers
 */

import { useBalance as useBalanceContext } from '../contexts/BalanceContext';
import { formatCallBalance } from '../utils/formatters';

/**
 * Balance hook with additional helper methods
 */
export const useBalance = () => {
  const balance = useBalanceContext();

  /**
   * Format balance for display
   */
  const getFormattedBalance = () => {
    return formatCallBalance(balance.balance);
  };

  /**
   * Check if user has enough balance
   */
  const hasEnoughBalance = (required = 1) => {
    return balance.balance >= required;
  };

  /**
   * Get balance percentage (for UI indicators)
   */
  const getBalancePercentage = (max = 50) => {
    return Math.min((balance.balance / max) * 100, 100);
  };

  /**
   * Get balance color based on amount
   */
  const getBalanceColor = () => {
    if (balance.isBalanceLow()) {
      return '#C62828'; // Error red
    }
    if (balance.balance < 10) {
      return '#F57C00'; // Warning orange
    }
    return '#2E7D32'; // Success green
  };

  /**
   * Calculate days of balance left
   */
  const getDaysOfBalanceLeft = (averageCallsPerDay = 2) => {
    if (averageCallsPerDay === 0) {return 0;}
    return Math.floor(balance.balance / averageCallsPerDay);
  };

  /**
   * Get balance status
   */
  const getBalanceStatus = () => {
    if (balance.balance === 0) {return 'empty';}
    if (balance.isBalanceLow()) {return 'low';}
    if (balance.balance < 10) {return 'medium';}
    return 'good';
  };

  /**
   * Get earned vs spent balance
   */
  const getBalanceBreakdown = () => {
    const history = balance.balanceHistory;

    const earned = history
      .filter((item) => item.type === 'earned')
      .reduce((sum, item) => sum + item.amount, 0);

    const spent = history
      .filter((item) => item.type === 'spent')
      .reduce((sum, item) => sum + Math.abs(item.amount), 0);

    return { earned, spent };
  };

  return {
    ...balance,
    getFormattedBalance,
    hasEnoughBalance,
    getBalancePercentage,
    getBalanceColor,
    getDaysOfBalanceLeft,
    getBalanceStatus,
    getBalanceBreakdown,
  };
};

export default useBalance;
