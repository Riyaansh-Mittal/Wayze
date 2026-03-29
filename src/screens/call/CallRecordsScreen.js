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
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import {CallIcon} from '../../assets/icons';

// ── Dummy Data ────────────────────────────────────────────────────────────────
const DUMMY_CALLS = [
  {
    _id: '1',
    direction: 'outgoing',
    registrationNumber: 'MH12AB1234',
    ownerName: 'Rahul Mehta',
    startedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    canReport: false,
  },
  {
    _id: '2',
    direction: 'incoming',
    registrationNumber: 'UP15AZ0860',
    ownerName: null,
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15m ago
    canReport: true,
  },
  {
    _id: '3',
    direction: 'outgoing',
    registrationNumber: 'DL01XY9999',
    ownerName: 'Suresh Kumar',
    startedAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      d.setHours(11, 20, 0, 0);
      return d.toISOString();
    })(),
    canReport: false,
  },
  {
    _id: '4',
    direction: 'incoming',
    registrationNumber: 'UP15AZ0860',
    ownerName: null,
    startedAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 5);
      d.setHours(9, 15, 0, 0);
      return d.toISOString();
    })(),
    canReport: true,
  },
  {
    _id: '5',
    direction: 'outgoing',
    registrationNumber: 'KA03MN5678',
    ownerName: 'Anita Sharma',
    startedAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 5);
      d.setHours(14, 30, 0, 0);
      return d.toISOString();
    })(),
    canReport: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString('en-IN', {day: '2-digit', month: 'short'});
}

function formatStartTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getInitials(name) {
  if (!name) return null;
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

function groupCallsByDate(calls) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {};
  calls.forEach(call => {
    const d = new Date(call.startedAt);
    d.setHours(0, 0, 0, 0);
    let label;
    if (d.getTime() === today.getTime()) label = 'TODAY';
    else if (d.getTime() === yesterday.getTime()) label = 'YESTERDAY';
    else
      label = new Date(call.startedAt)
        .toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        })
        .toUpperCase();

    if (!groups[label]) groups[label] = [];
    groups[label].push(call);
  });
  return groups;
}

// ── Call Record Card ──────────────────────────────────────────────────────────
const CallRecordItem = ({call, onReport, colors}) => {
  const isOutgoing = call.direction === 'outgoing';
  const initials = getInitials(call.ownerName);
  const timeAgo = getTimeAgo(call.startedAt);
  const startTime = formatStartTime(call.startedAt);

  // Left border + avatar bg colour based on direction
  const borderColor = isOutgoing ? colors.primary : colors.success;
  const avatarBg = isOutgoing ? colors.primaryLight : colors.successLight;
  const avatarColor = isOutgoing ? colors.primary : colors.success;
  const directionColor = isOutgoing ? colors.primary : colors.success;

  return (
    <View
      style={[
        styles.callItem,
        {
          backgroundColor: colors.white,
          borderLeftColor: borderColor,
        },
      ]}>
      {/* ── Avatar: initials OR CallIcon ── */}
      <View style={[styles.avatar, {backgroundColor: avatarBg}]}>
        {initials ? (
          <Text style={[styles.avatarText, {color: avatarColor}]}>
            {initials}
          </Text>
        ) : (
          <CallIcon width={22} height={22} fill={avatarColor} />
        )}
      </View>

      {/* ── Content ── */}
      <View style={styles.callContent}>
        {/* Direction label + time ago */}
        <View style={styles.callTopRow}>
          <View style={styles.directionRow}>
            <Text style={[styles.directionLabel, {color: directionColor}]}>
              {isOutgoing ? '↗ Outgoing' : '↙ Incoming'}
            </Text>
          </View>
          <Text style={[styles.timeAgo, {color: colors.textSecondary}]}>
            {timeAgo}
          </Text>
        </View>

        {/* Plate number */}
        <Text style={[styles.plateNumber, {color: colors.textPrimary}]}>
          {call.registrationNumber}
        </Text>

        {/* Started at + optional Report button */}
        <View style={styles.callBottomRow}>
          <Text style={[styles.startedAt, {color: colors.textSecondary}]}>
            Started {startTime}
          </Text>
          {call.canReport && (
            <TouchableOpacity
              style={[styles.reportBtn, {borderColor: colors.error}]}
              onPress={() => onReport(call)}
              activeOpacity={0.7}>
              <Text style={[styles.reportBtnText, {color: colors.error}]}>
                🚩 Report
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const CallRecordsScreen = ({navigation}) => {
  const {theme, t} = useTheme();
  const {colors, spacing, layout} = theme;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'made' | 'received'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [calls, setCalls] = useState(DUMMY_CALLS);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // TODO: replace with real API call
    await new Promise(r => setTimeout(r, 1000));
    setIsRefreshing(false);
  }, []);

  const handleReport = useCallback(call => {
    console.log('Report pressed for:', call.registrationNumber);
    // TODO: open report modal / navigate to report screen
  }, []);

  // Filter by tab
  const filteredCalls = calls.filter(c => {
    if (activeTab === 'made') return c.direction === 'outgoing';
    if (activeTab === 'received') return c.direction === 'incoming';
    return true;
  });

  const madeCount = calls.filter(c => c.direction === 'outgoing').length;
  const receivedCount = calls.filter(c => c.direction === 'incoming').length;

  // Build FlatList data with date-group headers
  const grouped = groupCallsByDate(filteredCalls);
  const flatListData = [];
  Object.entries(grouped).forEach(([label, items]) => {
    flatListData.push({type: 'header', label});
    items.forEach(item => flatListData.push({type: 'item', data: item}));
  });

  const renderItem = ({item}) => {
    if (item.type === 'header') {
      return (
        <Text style={[styles.dateHeader, {color: colors.textSecondary}]}>
          {item.label}
        </Text>
      );
    }
    return (
      <CallRecordItem
        call={item.data}
        onReport={handleReport}
        colors={colors}
      />
    );
  };

  const TABS = [
    {key: 'all', label: `All (${calls.length})`},
    {key: 'made', label: `Made (${madeCount})`},
    {key: 'received', label: `Received (${receivedCount})`},
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('callRecords.title') || 'Call Records'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* ── Tabs ── */}
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: colors.white,
            borderBottomColor: colors.neutralBorder,
          },
        ]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && [
                styles.activeTab,
                {borderBottomColor: colors.primary},
              ],
            ]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabText,
                {color: colors.textSecondary},
                activeTab === tab.key && [
                  styles.activeTabText,
                  {color: colors.primary},
                ],
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── List ── */}
      {filteredCalls.length === 0 ? (
        <View style={styles.emptyState}>
          <CallIcon width={56} height={56} fill={colors.textDisabled} />
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            {t('callRecords.empty') || 'No call records yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={flatListData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `hdr-${index}` : item.data._id
          }
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            {paddingHorizontal: layout.screenPadding},
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {flex: 1},

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 13,
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

  // List
  listContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 16,
    marginBottom: 8,
  },

  // Call card — mirrors NotificationItem structure with left border
  callItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    // shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  // Avatar circle — shows initials or CallIcon
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },

  // Card content
  callContent: {
    flex: 1,
  },
  callTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
  },
  plateNumber: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  callBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  startedAt: {
    fontSize: 12,
  },

  // Report button — outline style matching screenshot
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  reportBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
  },
});

export default CallRecordsScreen;
