/**
 * User Context
 * Manages user profile, settings, and activity
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import {UserService} from '../services/api';
import {useToast} from '../components/common/Toast/ToastProvider';
import {useAuth} from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const {user, syncUserData} = useAuth();
  const {showSuccess, showError} = useToast();

  const [isLoading, setIsLoading] = useState(false); // ✅ Only true on first load
  const [isRefreshing, setIsRefreshing] = useState(false); // ✅ True on background refresh
  const [userStats, setUserStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityPagination, setActivityPagination] = useState({
    page: 1,
    limit: 20,
    totalData: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [settings, setSettings] = useState(null);

  // ✅ Track if home data has been loaded
  const hasLoadedHomeRef = useRef(false);
  const currentUserIdRef = useRef(null);

  /**
   * Reset loaded flags when user changes
   */
  React.useEffect(() => {
    if (user?._id && currentUserIdRef.current !== user._id) {
      console.log('🔄 User changed in UserContext, resetting flags');
      hasLoadedHomeRef.current = false;
      currentUserIdRef.current = user._id;

      // ✅ Initialize stats from user object immediately
      if (user.vehicleRegistered !== undefined) {
        setUserStats({
          vehicleSearched: user.vehicleSearched || 0,
          timesContacted: user.timesContacted || 0,
          vehicleRegistered: user.vehicleRegistered || 0,
          memberSince: user.memberSince || user.createdAt,
        });
      }
    } else if (!user) {
      hasLoadedHomeRef.current = false;
      currentUserIdRef.current = null;
      setUserStats(null);
    }
  }, [user?._id, user]);

  /**
   * Get User Home Dashboard (profile + stats)
   * ✅ OPTIMIZED: Stale-while-revalidate pattern
   */
  const getUserHome = useCallback(
    async (force = false) => {
      if (!user) {
        console.log('⏭️ No user, skipping home data load');
        return {success: false, error: 'Not authenticated'};
      }

      const hasExistingData = hasLoadedHomeRef.current;
      const isBackgroundRefresh = hasExistingData && !force;

      if (isBackgroundRefresh) {
        console.log('🔄 Background refresh (silent)...');
        setIsRefreshing(true);
      } else if (!hasExistingData) {
        console.log('🏠 First load (show skeleton)...');
        setIsLoading(true);
      } else {
        console.log('🔄 Force refresh (show pull indicator)...');
        setIsRefreshing(true);
      }

      try {
        const response = await UserService.getHome();

        if (response.success) {
          const homeData = response.data;
          console.log('✅ Home data updated:', {
            callBalance: homeData.callBalance,
            vehicleSearched: homeData.vehicleSearched,
            vehicleRegistered: homeData.vehicleRegistered,
          });

          // ✅ DON'T call syncUserData - causes infinite loop
          // Just store stats locally
          setUserStats({
            vehicleSearched: homeData.vehicleSearched,
            timesContacted: homeData.timesContacted,
            vehicleRegistered: homeData.vehicleRegistered,
            memberSince: homeData.memberSince,
            callBalance: homeData.callBalance,
            alertBalance: homeData.alertBalance,
          });

          hasLoadedHomeRef.current = true;

          return {success: true, data: homeData};
        }

        return {success: false};
      } catch (error) {
        console.error('❌ Failed to load user home:', error);
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user],
  ); // ✅ Only depend on user (which is stable from AuthContext)

  /**
   * Get User Activity History
   * GET /api/user/activity?type=<type>&page=<page>&limit=<limit>
   */
  const getActivities = useCallback(
    async (filters = {}) => {
      if (!user) {
        return {success: false, error: 'Not authenticated'};
      }

      try {
        setIsLoading(true);

        const queryParams = {
          type: filters.type || 'ALL',
          page: filters.page || 1,
          limit: filters.limit || 20,
        };

        console.log('📋 Loading activities with filters:', queryParams);

        const response = await UserService.getActivities(queryParams);

        if (response.success) {
          const {activity, totalData, page, limit, hasNext, hasPrevious} =
            response.data;

          console.log('✅ Activities loaded:', activity?.length || 0);

          // If first page, replace. Otherwise append (infinite scroll)
          if (queryParams.page === 1) {
            setActivities(activity);
          } else {
            setActivities(prev => [...prev, ...activity]);
          }

          setActivityPagination({
            page,
            limit,
            totalData,
            hasNext,
            hasPrevious,
          });

          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        console.error('❌ Failed to load activities:', error);
        // Don't show error toast - let caller handle
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  /**
   * Load more activities (pagination)
   */
  const loadMoreActivities = useCallback(
    async (type = 'ALL') => {
      if (!activityPagination.hasNext) {
        return {success: false, message: 'No more data'};
      }

      return getActivities({
        type,
        page: activityPagination.page + 1,
        limit: activityPagination.limit,
      });
    },
    [activityPagination, getActivities],
  );

  /**
   * Get User Settings
   * GET /api/user/settings
   */
  const getSettings = useCallback(async () => {
    if (!user) {
      return {success: false, error: 'Not authenticated'};
    }

    try {
      setIsLoading(true);
      console.log('⚙️ Loading settings...');

      const response = await UserService.getSettings();

      if (response.success) {
        console.log('✅ Settings loaded');
        setSettings(response.data);
        return {success: true, data: response.data};
      }

      return {success: false};
    } catch (error) {
      console.error('❌ Failed to load settings:', error);
      showError('Failed to load settings');
      return {success: false, error: error.message};
    } finally {
      setIsLoading(false);
    }
  }, [user, showError]);

  /**
   * Update User Settings
   * POST /api/user/settings
   */
  const updateSettings = useCallback(
    async updates => {
      if (!user) {
        return {success: false, error: 'Not authenticated'};
      }

      try {
        setIsLoading(true);
        console.log('⚙️ Updating settings:', updates);

        const response = await UserService.updateSettings(updates);

        if (response.success) {
          console.log('✅ Settings updated');
          setSettings(response.data);
          showSuccess('Settings updated successfully');
          return {success: true, data: response.data};
        }

        return {success: false};
      } catch (error) {
        console.error('❌ Failed to update settings:', error);
        showError('Failed to update settings');
        return {success: false, error: error.message};
      } finally {
        setIsLoading(false);
      }
    },
    [user, showSuccess, showError],
  );

  /**
   * Toggle Notifications
   */
  const toggleNotifications = useCallback(
    async enabled => {
      return updateSettings({notifications: enabled});
    },
    [updateSettings],
  );

  /**
   * Toggle Email Alerts
   */
  const toggleEmailAlerts = useCallback(
    async enabled => {
      return updateSettings({emailAlerts: enabled});
    },
    [updateSettings],
  );

  /**
   * Toggle SMS Alerts
   */
  const toggleSmsAlerts = useCallback(
    async enabled => {
      return updateSettings({smsAlerts: enabled});
    },
    [updateSettings],
  );

  /**
   * Update Profile Visibility
   */
  const updateProfileVisibility = useCallback(
    async visible => {
      return updateSettings({profileVisibility: visible});
    },
    [updateSettings],
  );

  const value = {
    // State
    user,
    isLoading, // ✅ Only true on first load with no cached data
    isRefreshing, // ✅ True on background refresh
    userStats,
    activities,
    activityPagination,
    settings,

    // Methods
    getUserHome,
    getActivities,
    loadMoreActivities,
    getSettings,
    updateSettings,
    toggleNotifications,
    toggleEmailAlerts,
    toggleSmsAlerts,
    updateProfileVisibility,
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
