/**
 * Activity History Screen
 * Timeline of user's vehicle and search activity
 * UPDATED: Integrated with UserContext API + All Activity & Notification Types
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import {useUser} from '../../contexts/UserContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Spinner from '../../components/common/Loading/Spinner';
import {
  CallIcon,
  CarIcon,
  SearchIcon,
  TrashIcon,
  BellIcon,
  WarningIcon,
} from '../../assets/icons';

// ✅ Activity type mapping (matches backend API exactly)
const FILTER_TYPES = {
  ALL: 'ALL',
  CALLS: 'CALL', // CALL, RECEIVED_CALL, FAILED_CALL
  SEARCHES: 'VEHICLE_SEARCHED',
  ALERTS: 'ALERT', // Currently empty
};

const ActivityHistoryScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {
    getActivities,
    loadMoreActivities,
    activities,
    activityPagination,
    isLoading,
  } = useUser();
  const {colors, spacing, layout} = theme;
  console.log(activities);

  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.ALL);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Load activities with filter
  const loadActivity = useCallback(async () => {
    await getActivities({type: activeFilter, page: 1, limit: 20});
  }, [activeFilter, getActivities]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  // ✅ Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadActivity();
    setIsRefreshing(false);
  }, [loadActivity]);

  // ✅ Handle load more
  const handleLoadMore = useCallback(async () => {
    if (!activityPagination.hasNext || isLoading) return;
    await loadMoreActivities(activeFilter);
  }, [activeFilter, activityPagination.hasNext, isLoading, loadMoreActivities]);

  // ✅ Handle filter change
  const handleFilterChange = useCallback(filter => {
    setActiveFilter(filter);
  }, []);

  const groupedActivities = groupByDate(activities);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('profile.activity.title') || 'Activity'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Compact Filter Chips */}
      <View
        style={[
          styles.filtersContainer,
          {
            backgroundColor: colors.white,
            borderBottomColor: colors.neutralBorder,
          },
        ]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}>
          <FilterChip
            label={t('profile.activity.filters.all') || 'All'}
            active={activeFilter === FILTER_TYPES.ALL}
            onPress={() => handleFilterChange(FILTER_TYPES.ALL)}
            theme={theme}
          />
          <FilterChip
            label={t('profile.activity.filters.vehicles') || 'Vehicles'}
            active={activeFilter === FILTER_TYPES.CALLS}
            onPress={() => handleFilterChange(FILTER_TYPES.CALLS)}
            theme={theme}
          />
          <FilterChip
            label={t('profile.activity.filters.searches') || 'Searches'}
            active={activeFilter === FILTER_TYPES.SEARCHES}
            onPress={() => handleFilterChange(FILTER_TYPES.SEARCHES)}
            theme={theme}
          />
          <FilterChip
            label={t('profile.activity.filters.alerts') || 'Alerts'}
            active={activeFilter === FILTER_TYPES.ALERTS}
            onPress={() => handleFilterChange(FILTER_TYPES.ALERTS)}
            theme={theme}
          />
        </ScrollView>
      </View>

      {/* Loading state for initial load */}
      {isLoading && activities.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner size="large" color={colors.primary} />
          <Text style={{color: colors.textSecondary, marginTop: spacing.md}}>
            {t('common.loading') || 'Loading...'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }>
          {activities.length === 0 ? (
            <View style={{paddingHorizontal: layout.screenPadding}}>
              <EmptyState
                icon="📜"
                title={t('profile.activity.empty') || 'No Activity Yet'}
                message={
                  t('profile.activity.emptyMessage') ||
                  'Your search and vehicle activity will appear here'
                }
              />
            </View>
          ) : (
            <View style={{paddingHorizontal: layout.screenPadding}}>
              {Object.entries(groupedActivities).map(([dateLabel, items]) => (
                <View key={dateLabel} style={{marginBottom: spacing.lg}}>
                  {/* Date Header */}
                  <View style={[styles.dateHeader, {marginBottom: spacing.sm}]}>
                    <View
                      style={[
                        styles.dateBadge,
                        {backgroundColor: colors.primaryLight},
                      ]}>
                      <Text style={[styles.dateText, {color: colors.primary}]}>
                        {dateLabel}
                      </Text>
                    </View>
                  </View>

                  {/* Activity Cards */}
                  <View style={styles.activitiesGroup}>
                    {items.map((item, index) => (
                      <TimelineItem
                        key={`${item._id}-${index}`}
                        item={item}
                        isLast={index === items.length - 1}
                        t={t}
                        theme={theme}
                      />
                    ))}
                  </View>
                </View>
              ))}

              {/* Load More Button */}
              {activityPagination.hasNext && (
                <View style={styles.loadMoreContainer}>
                  <SecondaryButton
                    title={t('profile.activity.loadMore') || 'Load More'}
                    onPress={handleLoadMore}
                    loading={isLoading}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// Compact Filter Chip Component
const FilterChip = ({label, active, onPress, theme}) => {
  const {colors} = theme;
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor: active ? colors.primary : 'transparent',
          borderWidth: active ? 0 : 1,
          borderColor: colors.neutralBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.filterChipText,
          {color: active ? colors.white : colors.textSecondary},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Enhanced Timeline Item Component with Card
const TimelineItem = ({item, isLast, t, theme}) => {
  const {colors, spacing} = theme;

  // ✅ Get icon based on ALL backend types (Activity + Notification)
  const getActivityIcon = type => {
    switch (type) {
      // ═══ ACTIVITY TYPES (userActivityModel) ═══
      case 'VEHICLE_ADDED':
        return <CarIcon width={30} height={30} fill={colors.success} />;
      case 'VEHICLE_REMOVED':
        return <TrashIcon width={30} height={30} fill={colors.error} />;
      case 'VEHICLE_SEARCHED':
        return <SearchIcon width={30} height={30} fill={colors.primary} />;
      case 'CALL':
        return <CallIcon width={30} height={30} fill={colors.success} />;
      case 'RECEIVED_CALL':
        return <CallIcon width={30} height={30} fill={colors.primary} />;
      case 'FAILED_CALL':
        return <CallIcon width={30} height={30} fill={colors.error} />;

      // ═══ NOTIFICATION TYPES (NotificationModel) ═══
      case 'VEHICLE_SEARCHED': // Notification: Your vehicle was searched
        return <SearchIcon width={30} height={30} fill={colors.info} />;
      case 'ALERT_HIGH':
        return <WarningIcon width={30} height={30} fill={colors.error} />;
      case 'ALERT_LOW':
        return <BellIcon width={30} height={30} fill={colors.warning} />;
      case 'ALERT_ACKNOWLEDGED':
        return <Text style={{fontSize: 30}}>✅</Text>;
      case 'CALL': // Notification: Missed call
        return <CallIcon width={30} height={30} fill={colors.warning} />;

      // ═══ FUTURE TYPES ═══
      case 'LOGIN':
        return <Text style={{fontSize: 30}}>🔐</Text>;
      case 'LOGOUT':
        return <Text style={{fontSize: 30}}>👋</Text>;
      case 'DELETE_ACCOUNT':
        return <WarningIcon width={30} height={30} fill={colors.error} />;

      default:
        return <Text style={{fontSize: 30}}>•</Text>;
    }
  };

  // ✅ Get icon background color based on type
  const getIconBackgroundColor = type => {
    switch (type) {
      // Success states
      case 'VEHICLE_ADDED':
      case 'CALL':
      case 'ALERT_ACKNOWLEDGED':
        return colors.successLight;

      // Error states
      case 'VEHICLE_REMOVED':
      case 'FAILED_CALL':
      case 'ALERT_HIGH':
      case 'DELETE_ACCOUNT':
        return colors.errorLight;

      // Primary/Info states
      case 'VEHICLE_SEARCHED':
      case 'RECEIVED_CALL':
        return colors.primaryLight;

      // Warning states
      case 'ALERT_LOW':
        return colors.warningLight;

      // Neutral
      default:
        return colors.neutralLight;
    }
  };

  // ✅ Get activity text - prioritize API title
  const getActivityText = item => {
    // Use title from API (always present)
    if (item.title) {
      return item.title;
    }

    // Fallback translations (should rarely be used)
    switch (item.type) {
      // Activity types
      case 'VEHICLE_ADDED':
        return 'You have added a new vehicle';
      case 'VEHICLE_REMOVED':
        return 'You have removed a vehicle';
      case 'VEHICLE_SEARCHED':
        return `You have searched ${item.registrationNumber || 'a vehicle'}`;
      case 'CALL':
        return 'Calling activity recorded';
      case 'RECEIVED_CALL':
        return 'Incoming call received';
      case 'FAILED_CALL':
        return 'Missed call';

      // Notification types
      case 'ALERT_HIGH':
        return 'High Priority Alert';
      case 'ALERT_LOW':
        return 'Low Priority Alert';
      case 'ALERT_ACKNOWLEDGED':
        return 'Your alert has been acknowledged';

      default:
        return 'Activity';
    }
  };

  const getActivityTime = timestamp => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View
      style={[
        styles.timelineItemWrapper,
        {marginBottom: isLast ? 0 : spacing.sm},
      ]}>
      <Card style={styles.activityCard}>
        <View style={styles.cardContent}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: getIconBackgroundColor(item.type)},
            ]}>
            <Text style={styles.activityIcon}>
              {getActivityIcon(item.type)}
            </Text>
          </View>

          {/* Content */}
          <View style={styles.textContent}>
            <Text
              style={[styles.activityText, {color: colors.textPrimary}]}
              numberOfLines={2}>
              {getActivityText(item)}
            </Text>
            <View style={styles.metaRow}>
              <Text
                style={[styles.activityTime, {color: colors.textSecondary}]}>
                {getActivityTime(item.createdAt)}
              </Text>
              {item.registrationNumber && (
                <>
                  <Text style={[styles.metaDot, {color: colors.textSecondary}]}>
                    •
                  </Text>
                  <Text
                    style={[
                      styles.activityDetail,
                      {color: colors.textSecondary},
                    ]}
                    numberOfLines={1}>
                    {item.registrationNumber}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

// Helper functions
const groupByDate = activities => {
  const groups = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  activities.forEach(activity => {
    const timestamp = activity.createdAt;
    if (!timestamp) {
      return;
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return;
    }

    date.setHours(0, 0, 0, 0);

    let label;

    if (date.getTime() === today.getTime()) {
      label = 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      label = 'Yesterday';
    } else if (isWithinLastWeek(date)) {
      label = 'Last Week';
    } else {
      label = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(activity);
  });

  return groups;
};

const isWithinLastWeek = date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return date >= lastWeek && date < today;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activitiesGroup: {},
  timelineItemWrapper: {},
  activityCard: {
    marginHorizontal: 0,
    padding: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // was 12 — slightly tighter
  },
  iconContainer: {
    width: 40, // was 44 — harmonises with 30px icon better
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 22, // was 22 — keep, but remove the <Text> wrapper in JSX
  },
  activityText: {
    fontSize: 14, // was 15 — less visual weight in a dense list
    fontWeight: '400', // was '500' — let content breathe; bold only for alerts
    marginBottom: 2, // was 4 — tighter
  },
  textContent: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2, // ← ADD THIS — prevents time text touching title baseline
  },
  activityTime: {
    fontSize: 12, // was 13
  },
  metaDot: {
    marginHorizontal: 4, // was 6 — less gap around bullet
    fontSize: 12,
  },
  activityDetail: {
    fontSize: 12, // was 13
    flex: 1,
  },
  loadMoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
});

export default ActivityHistoryScreen;
