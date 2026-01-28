import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '../../contexts/ThemeContext';
import {useNotifications} from '../../contexts/NotificationContext';
import AppBar from '../../components/navigation/AppBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from '../../components/common/Loading/Spinner';

// ✅ Notification type configurations (matching API docs)
const NOTIFICATION_CONFIGS = {
  VEHICLE_SEARCHED: {
    icon: 'search',
    iconBg: '#E3F2FD',
    iconColor: '#1976D2',
    border: '#2196F3',
  },
  ALERT_HIGH: {
    icon: 'notification-important',
    iconBg: '#FFEBEE',
    iconColor: '#C62828',
    border: '#F44336',
  },
  ALERT_LOW: {
    icon: 'warning',
    iconBg: '#FFF9C4',
    iconColor: '#F57F17',
    border: '#FFEB3B',
  },
  CALL: {
    icon: 'phone-missed',
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
    border: '#FF9800',
  },
  ALERT_ACKNOWLEDGED: {
    icon: 'check-circle',
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
    border: '#4CAF50',
  },
};

const NotificationItem = ({notification, onPress, colors}) => {
  const config =
    NOTIFICATION_CONFIGS[notification.type] ||
    NOTIFICATION_CONFIGS.VEHICLE_SEARCHED;

  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Pressable
      onPress={() => onPress(notification)}
      style={({pressed}) => [
        styles.notificationItem,
        {
          backgroundColor: notification.isRead
            ? colors.neutralBorder
            : colors.white,
          borderLeftColor: config.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      {/* Icon */}
      <View style={[styles.iconContainer, {backgroundColor: config.iconBg}]}>
        <Icon name={config.icon} size={24} color={config.iconColor} />
      </View>

      {/* Content */}
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              {color: colors.textPrimary},
              !notification.isRead && styles.boldText,
            ]}>
            {notification.title}
          </Text>
          <View style={styles.headerRight}>
            <Text style={[styles.timeText, {color: colors.textSecondary}]}>
              {timeAgo}
            </Text>
            {!notification.isRead && (
              <View
                style={[styles.unreadDot, {backgroundColor: colors.primary}]}
              />
            )}
          </View>
        </View>

        <Text
          style={[styles.notificationBody, {color: colors.textSecondary}]}
          numberOfLines={2}>
          {notification.body}
        </Text>

        {/* Show registration number if available */}
        {notification.registrationNumber && (
          <View style={styles.plateContainer}>
            <Text style={[styles.plateNumber, {color: colors.textPrimary}]}>
              {notification.registrationNumber}
            </Text>
          </View>
        )}

        {/* Action button for ALERT_HIGH */}
        {notification.type === 'ALERT_HIGH' && !notification.isRead && (
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: colors.error}]}
            onPress={() => onPress(notification)}>
            <Text style={[styles.actionButtonText, {color: colors.white}]}>
              Acknowledge
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
};

const NotificationsScreen = ({navigation}) => {
  const {theme, t} = useTheme();
  const {colors, typography, spacing, layout} = theme;
  const {
    notifications,
    unreadCount,
    pagination,
    isLoading,
    isRefreshing,
    isLoadingMore,
    refreshNotifications,
    loadMore,
    markAsRead,
    groupNotificationsByDate,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'

  useFocusEffect(
    useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications]),
  );

  const handleNotificationPress = async notification => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    // TODO: Navigate based on notification type
    console.log('Notification pressed:', notification);
  };

  const groupedNotifications = groupNotificationsByDate();
  const filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications;

  // Group filtered notifications
  const displayGroups = {
    today: filteredNotifications.filter(n =>
      groupedNotifications.today.includes(n),
    ),
    yesterday: filteredNotifications.filter(n =>
      groupedNotifications.yesterday.includes(n),
    ),
    older: filteredNotifications.filter(n =>
      groupedNotifications.older.includes(n),
    ),
  };

  const totalCount = filteredNotifications.length;

  // Render section header
  const renderSectionHeader = title => (
    <Text
      style={[
        styles.dateHeader,
        {
          color: colors.textSecondary,
          marginBottom: spacing.sm,
          marginTop: spacing.base,
        },
      ]}>
      {title}
    </Text>
  );

  // Prepare flat list data with section headers
  const flatListData = [];
  if (displayGroups.today.length > 0) {
    flatListData.push({
      type: 'header',
      title: t('notifications.today') || 'TODAY',
    });
    flatListData.push(
      ...displayGroups.today.map(n => ({type: 'item', data: n})),
    );
  }
  if (displayGroups.yesterday.length > 0) {
    flatListData.push({
      type: 'header',
      title: t('notifications.yesterday') || 'YESTERDAY',
    });
    flatListData.push(
      ...displayGroups.yesterday.map(n => ({type: 'item', data: n})),
    );
  }
  if (displayGroups.older.length > 0) {
    flatListData.push({
      type: 'header',
      title: t('notifications.older') || 'OLDER',
    });
    flatListData.push(
      ...displayGroups.older.map(n => ({type: 'item', data: n})),
    );
  }

  const renderItem = ({item}) => {
    if (item.type === 'header') {
      return renderSectionHeader(item.title);
    }
    return (
      <NotificationItem
        notification={item.data}
        onPress={handleNotificationPress}
        colors={colors}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('notifications.title') || 'Notifications'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Tabs */}
      <View style={[styles.tabContainer, {backgroundColor: colors.white}]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && [
              styles.activeTab,
              {borderBottomColor: colors.primary},
            ],
          ]}
          onPress={() => setActiveTab('all')}>
          <Text
            style={[
              styles.tabText,
              {color: colors.textSecondary},
              activeTab === 'all' && [
                styles.activeTabText,
                {color: colors.primary},
              ],
            ]}>
            {t('notifications.tabs.all') || 'All'} ({notifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'unread' && [
              styles.activeTab,
              {borderBottomColor: colors.primary},
            ],
          ]}
          onPress={() => setActiveTab('unread')}>
          <Text
            style={[
              styles.tabText,
              {color: colors.textSecondary},
              activeTab === 'unread' && [
                styles.activeTabText,
                {color: colors.primary},
              ],
            ]}>
            {t('notifications.tabs.unread') || 'Unread'} ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading && notifications.length === 0 ? (
        <View style={styles.centerContent}>
          <Spinner size="large" color={colors.primary} />
        </View>
      ) : totalCount === 0 ? (
        <View style={styles.emptyState}>
          <Icon
            name="notifications-none"
            size={64}
            color={colors.textDisabled}
          />
          <Text
            style={[
              typography.h3,
              {color: colors.textSecondary, marginTop: spacing.lg},
            ]}>
            {activeTab === 'unread'
              ? t('notifications.empty.unread') || 'No unread notifications'
              : t('notifications.empty.all') || 'No notifications yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={flatListData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${index}` : item.data._id
          }
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            {paddingHorizontal: layout.screenPadding},
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshNotifications}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

// Helper function to calculate time ago
function getTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return then.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  listContent: {
    paddingVertical: 16,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  plateContainer: {
    marginTop: 8,
  },
  plateNumber: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default NotificationsScreen;
