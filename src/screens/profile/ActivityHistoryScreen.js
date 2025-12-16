/**
 * Activity History Screen
 * Timeline of user's vehicle and search activity
 * FULLY THEME-AWARE WITH IMPROVED UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useSearch } from '../../contexts/SearchContext';
import { ACTIVITY_TYPES } from '../../config/constants';
import { getMockActivities } from '../../services/mock/activityData';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { CallIcon, CarIcon, EditIcon, SearchIcon, TrashIcon } from '../../assets/icons';

const FILTER_TYPES = {
  ALL: 'all',
  VEHICLES: 'vehicles',
  SEARCHES: 'searches',
  CONTACTS: 'contacts',
};

const ActivityHistoryScreen = ({ navigation }) => {
  const { t, theme } = useTheme();
  const { searchHistory, getSearchHistory } = useSearch();
  const { colors, spacing, layout } = theme;

  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.ALL);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activities, setActivities] = useState([]);

  // ✅ Load activities (use mock data for now)
  const loadActivity = useCallback(async () => {
    // For development, use mock data
    const mockData = getMockActivities(activeFilter, 20);
    setActivities(mockData);

    // In production, use real data
    // await getSearchHistory(20);
  }, [activeFilter]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadActivity();
    setIsRefreshing(false);
  }, [loadActivity]);

  const groupedActivities = groupByDate(activities);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.neutralLight }]} edges={['top']}>
      <AppBar
        title={t('profile.activity.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Compact Filter Chips */}
      <View style={[styles.filtersContainer, {
        backgroundColor: colors.white,
        borderBottomColor: colors.neutralBorder,
      }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterChip
            label={t('profile.activity.filters.all')}
            active={activeFilter === FILTER_TYPES.ALL}
            onPress={() => setActiveFilter(FILTER_TYPES.ALL)}
            theme={theme}
          />
          <FilterChip
            label={t('profile.activity.filters.vehicles')}
            active={activeFilter === FILTER_TYPES.VEHICLES}
            onPress={() => setActiveFilter(FILTER_TYPES.VEHICLES)}
            theme={theme}
          />
          <FilterChip
            label={t('profile.activity.filters.searches')}
            active={activeFilter === FILTER_TYPES.SEARCHES}
            onPress={() => setActiveFilter(FILTER_TYPES.SEARCHES)}
            theme={theme}
          />
          <FilterChip
            label={t('profile.activity.filters.contacts')}
            active={activeFilter === FILTER_TYPES.CONTACTS}
            onPress={() => setActiveFilter(FILTER_TYPES.CONTACTS)}
            theme={theme}
          />
        </ScrollView>
      </View>

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
        }
      >
        {activities.length === 0 ? (
          <View style={{ paddingHorizontal: layout.screenPadding }}>
            <EmptyState
              icon="📜"
              title={t('profile.activity.empty')}
              description="Your search and vehicle activity will appear here"
            />
          </View>
        ) : (
          <View style={{ paddingHorizontal: layout.screenPadding }}>
            {Object.entries(groupedActivities).map(([dateLabel, items]) => (
              <View key={dateLabel} style={{ marginBottom: spacing.lg }}>
                {/* Date Header */}
                <View style={[styles.dateHeader, { marginBottom: spacing.sm }]}>
                  <View style={[styles.dateBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.dateText, { color: colors.primary }]}>
                      {dateLabel}
                    </Text>
                  </View>
                </View>

                {/* Activity Cards */}
                <View style={styles.activitiesGroup}>
                  {items.map((item, index) => (
                    <TimelineItem
                      key={`${item.id}-${index}`}
                      item={item}
                      isLast={index === items.length - 1}
                      t={t}
                      theme={theme}
                    />
                  ))}
                </View>
              </View>
            ))}

            {activities.length >= 20 && (
              <View style={styles.loadMoreContainer}>
                <SecondaryButton
                  title={t('profile.activity.loadMore')}
                  onPress={loadActivity}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Compact Filter Chip Component
const FilterChip = ({ label, active, onPress, theme }) => {
  const { colors } = theme;
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor: active ? colors.primary : 'transparent',
          borderWidth: active ? 0 : 1,
          borderColor: colors.neutralBorder,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterChipText,
        { color: active ? colors.white : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Enhanced Timeline Item Component with Card
const TimelineItem = ({ item, isLast, t, theme }) => {
  const { colors, spacing } = theme;

  const getActivityIcon = (type) => {
    switch (type) {
      case ACTIVITY_TYPES.VEHICLE_ADDED:
        return { emoji: <CarIcon width={30} height={30} fill={colors.primary}/> };
      case ACTIVITY_TYPES.VEHICLE_EDITED:
        return { emoji: <EditIcon width={30} height={30} fill={colors.warning}/>};
      case ACTIVITY_TYPES.VEHICLE_DELETED:
        return { emoji: <TrashIcon width={30} height={30} fill={colors.error}/>};
      case ACTIVITY_TYPES.VEHICLE_SEARCHED:
        return { emoji: <SearchIcon width={30} height={30} fill={colors.primary}/> };
      case ACTIVITY_TYPES.OWNER_CONTACTED:
        return { emoji: <CallIcon width={30} height={30} fill={colors.primary}/> };
      default:
        return { emoji: '•', bg: colors.neutralLight };
    }
  };

  const getActivityText = (item) => {
    switch (item.type) {
      case ACTIVITY_TYPES.VEHICLE_SEARCHED:
        return t('profile.activity.types.searched', { plate: item.searchQuery });
      case ACTIVITY_TYPES.VEHICLE_ADDED:
        return t('profile.activity.types.added', { plate: item.searchQuery });
      case ACTIVITY_TYPES.VEHICLE_EDITED:
        return t('profile.activity.types.edited', { plate: item.searchQuery });
      case ACTIVITY_TYPES.OWNER_CONTACTED:
        return t('profile.activity.types.called', { plate: item.searchQuery });
      default:
        return item.searchQuery || 'Activity';
    }
  };

  const getActivityTime = (timestamp) => {
    if (!timestamp) {return '';}

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {return '';}

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const iconData = getActivityIcon(item.type);

  return (
    <View style={[styles.timelineItemWrapper, { marginBottom: isLast ? 0 : spacing.sm }]}>
      <Card style={styles.activityCard}>
        <View style={styles.cardContent}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
            <Text style={styles.activityIcon}>{iconData.emoji}</Text>
          </View>

          {/* Content */}
          <View style={styles.textContent}>
            <Text style={[styles.activityText, { color: colors.textPrimary }]} numberOfLines={2}>
              {getActivityText(item)}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                {getActivityTime(item.timestamp)}
              </Text>
              {item.details && (
                <>
                  <Text style={[styles.metaDot, { color: colors.textSecondary }]}>•</Text>
                  <Text style={[styles.activityDetail, { color: colors.textSecondary }]} numberOfLines={1}>
                    {item.details}
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
const groupByDate = (activities) => {
  const groups = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  activities.forEach((activity) => {
    const timestamp = activity.timestamp || activity.createdAt;
    if (!timestamp) {return;}

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {return;}

    date.setHours(0, 0, 0, 0);

    let label;

    if (date.getTime() === today.getTime()) {
      label = 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      label = 'Yesterday';
    } else if (isWithinLastWeek(date)) {
      label = 'Last Week';
    } else {
      label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(activity);
  });

  return groups;
};

const isWithinLastWeek = (date) => {
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
  activitiesGroup: {
    // Container for activities
  },
  timelineItemWrapper: {
    // Wrapper for spacing
  },
  activityCard: {
    marginHorizontal: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 22,
  },
  textContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 13,
  },
  metaDot: {
    marginHorizontal: 6,
    fontSize: 13,
  },
  activityDetail: {
    fontSize: 13,
    flex: 1,
  },
  loadMoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
});

export default ActivityHistoryScreen;
