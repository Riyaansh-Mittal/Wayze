import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {NotificationService} from '../services/api';
import {useToast} from '../components/common/Toast/ToastProvider';
import {useAuth} from './AuthContext';
import { useTheme } from './ThemeContext';

const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
  const {user, isAuthenticated} = useAuth();
  const {showSuccess, showError} = useToast();

  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalData: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {t} = useTheme();

  const hasLoadedRef = useRef(false);
  const pollingIntervalRef = useRef(null);

  /**
   * Calculate unread count from notifications list
   */
  const unreadCount = notifications.filter(n => !n.isRead).length;

  /**
   * Load notifications (with pagination)
   */
  const loadNotifications = useCallback(
    async (page = 1, showLoader = true, append = false) => {
      if (!user) {
        console.log('⏭️ No user, skipping notification load');
        return {success: false, error: 'Not authenticated'};
      }

      try {
        if (showLoader) {
          if (append) {
            setIsLoadingMore(true);
          } else {
            setIsLoading(true);
          }
        }

        console.log('🔔 Loading notifications - page:', page);
        const response = await NotificationService.getAll(page, 20);

        if (response.success && response.data) {
          const {
            notifications: newNotifs,
            totalData,
            hasNext,
            hasPrevious,
          } = response.data;

          console.log('✅ Notifications loaded:', newNotifs.length);

          // Append or replace notifications
          if (append) {
            setNotifications(prev => [...prev, ...newNotifs]);
          } else {
            setNotifications(newNotifs);
          }

          // Update pagination
          setPagination({
            page,
            limit: 20,
            totalData,
            hasNext,
            hasPrevious,
          });

          return {success: true, data: newNotifs};
        }

        return {success: false};
      } catch (error) {
        console.error('❌ Failed to load notifications:', error);
        if (!append) {
          showError('Failed to load notifications');
        }
        return {success: false, error: error.message};
      } finally {
        if (showLoader) {
          if (append) {
            setIsLoadingMore(false);
          } else {
            setIsLoading(false);
          }
        }
      }
    },
    [user, showError],
  );

  /**
   * Load next page of notifications
   */
  const loadMore = useCallback(async () => {
    if (!pagination.hasNext || isLoadingMore) {
      console.log('⏭️ No more notifications to load');
      return;
    }

    const nextPage = pagination.page + 1;
    await loadNotifications(nextPage, true, true);
  }, [pagination, isLoadingMore, loadNotifications]);

  /**
   * Start polling for new notifications (every 60 seconds)
   */
  const startPolling = useCallback(() => {
    console.log('🔄 Starting notification polling (60s interval)...');

    // Poll every 60 seconds
    pollingIntervalRef.current = setInterval(() => {
      console.log('🔔 Polling notifications...');
      loadNotifications(1, false, false);
    }, 60000); // 60 seconds
  }, [loadNotifications]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('⏹️ Stopping notification polling');
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  /**
   * Load notifications when authenticated and start polling
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!hasLoadedRef.current || hasLoadedRef.current !== user._id) {
        console.log('🔄 Initial notification load for:', user._id);
        hasLoadedRef.current = user._id;
        loadNotifications(1, true, false);
        startPolling();
      }
    } else {
      console.log('🧹 Clearing notifications (logged out)');
      setNotifications([]);
      setPagination({
        page: 1,
        limit: 20,
        totalData: 0,
        hasNext: false,
        hasPrevious: false,
      });
      stopPolling();
      hasLoadedRef.current = false;
    }

    // Cleanup polling on unmount
    return () => stopPolling();
  }, [
    isAuthenticated,
    user?._id,
    loadNotifications,
    startPolling,
    stopPolling,
    user,
  ]);

  /**
   * Refresh notifications
   */
  const refreshNotifications = useCallback(async () => {
    console.log('🔄 Refreshing notifications...');
    setIsRefreshing(true);
    await loadNotifications(1, false, false);
    setIsRefreshing(false);
  }, [loadNotifications]);

  /**
   * Mark notification as read (and acknowledge if alert)
   */
  const markAsRead = useCallback(
    async notificationId => {
      if (!user) return {success: false, error: 'Not authenticated'};

      try {
        console.log('👁️ Marking notification as read:', notificationId);
        const result = await NotificationService.markAsRead(notificationId);

        if (result.success) {
          // Update local state
          setNotifications(prev =>
            prev.map(n =>
              n._id === notificationId ? {...n, isRead: true} : n,
            ),
          );

          // Check if this was an alert that got acknowledged
          const notification = notifications.find(
            n => n._id === notificationId,
          );
          if (
            notification?.type === 'ALERT_HIGH' ||
            notification?.type === 'ALERT_LOW'
          ) {
            showSuccess(t('toast.notification.acknowledged') || 'Alert acknowledged');
          }
        }

        return result;
      } catch (error) {
        console.error('❌ Error marking as read:', error);
        showError(t('toast.notification.markReadFailed') || 'Failed to mark notification as read');
        return {success: false, error: error.message};
      }
    },
    [user, notifications, showSuccess, showError, t],
  );

  /**
   * Get unread notifications
   */
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.isRead);
  }, [notifications]);

  /**
   * Get notifications by type
   */
  const getNotificationsByType = useCallback(
    type => {
      return notifications.filter(n => n.type === type);
    },
    [notifications],
  );

  /**
   * Group notifications by date
   */
  const groupNotificationsByDate = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      today: [],
      yesterday: [],
      older: [],
    };

    notifications.forEach(notif => {
      const notifDate = new Date(notif.createdAt);
      const notifDay = new Date(
        notifDate.getFullYear(),
        notifDate.getMonth(),
        notifDate.getDate(),
      );

      if (notifDay.getTime() === today.getTime()) {
        groups.today.push(notif);
      } else if (notifDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notif);
      } else {
        groups.older.push(notif);
      }
    });

    return groups;
  }, [notifications]);

  const value = {
    // State
    notifications,
    unreadCount, // ✅ Calculated from notifications, not from API
    pagination,
    isLoading,
    isRefreshing,
    isLoadingMore,

    // Actions
    loadNotifications,
    loadMore,
    refreshNotifications,
    markAsRead,

    // Getters
    getUnreadNotifications,
    getNotificationsByType,
    groupNotificationsByDate,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationProvider',
    );
  }
  return context;
};

export default NotificationContext;
