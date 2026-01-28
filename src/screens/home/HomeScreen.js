import React, {useState, useCallback, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native'; // ✅ Import this
import {useAuth} from '../../contexts/AuthContext';
import {useUser} from '../../contexts/UserContext';
import {useVehicles} from '../../contexts/VehicleContext';
import {useNotifications} from '../../contexts/NotificationContext';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BoltIcon, WarningIcon} from '../../assets/icons';
import Spinner from '../../components/common/Loading/Spinner';

const HomeScreen = ({navigation}) => {
  const {user} = useAuth();
  const {getUserHome, userStats, isLoading, isRefreshing} = useUser();
  const {vehicles} = useVehicles();
  const {t, theme} = useTheme();

  const {colors, typography, spacing, layout} = theme;

  const callBalance = userStats?.callBalance ?? user?.callBalance ?? 0;
  const isBalanceLow = callBalance < 5;

  const lastRefreshRef = useRef(0);
  const MIN_REFRESH_INTERVAL = 3000;

  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshRef.current;

      if (timeSinceLastRefresh > MIN_REFRESH_INTERVAL) {
        console.log('🏠 Home screen focused - refreshing data');
        lastRefreshRef.current = now;
        getUserHome();
      } else {
        console.log(
          '⏭️ Skip refresh (called',
          Math.round(timeSinceLastRefresh / 1000),
          's ago)',
        );
      }
    }, [getUserHome]),
  );

  const userName = user?.fullName || user?.displayName || 'User';

  const memberSince =
    userStats?.memberSince || user?.memberSince || user?.createdAt
      ? new Date(
          userStats?.memberSince || user?.memberSince || user?.createdAt,
        ).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : 'Recently';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning') || 'Good Morning';
    if (hour < 17) return t('home.greeting.afternoon') || 'Good Afternoon';
    return t('home.greeting.evening') || 'Good Evening';
  };

  const handleRefresh = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    await getUserHome(true);
  }, [getUserHome]);

  // ✅ FIXED: Show loading skeleton only on FIRST load with no data at all
  const hasAnyData = userStats || user?.vehicleRegistered !== undefined;
  const showLoadingSkeleton = isLoading && !hasAnyData;

  // ✅ FIXED: If first load is taking too long, still show UI with defaults
  const [showDefaultUI, setShowDefaultUI] = useState(false);

  useEffect(() => {
    // ✅ After 2 seconds of loading, show UI anyway
    if (isLoading && !hasAnyData) {
      const timeout = setTimeout(() => {
        console.log('⏱️ Loading timeout - showing default UI');
        setShowDefaultUI(true);
      }, 2000); // Show UI after 2 seconds even if API hasn't responded

      return () => clearTimeout(timeout);
    }
  }, [isLoading, hasAnyData]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('common.appName') || 'QR Parking'}
        rightIcon={
          <Icon
            name="notifications-none"
            size={26}
            color={colors.textPrimary}
          />
        }
        onRightPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: layout.screenPadding},
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        {/* Greeting Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text style={[typography.h1, {marginBottom: spacing.xs}]}>
            {getGreeting()}, {userName}
          </Text>
          <Text style={typography.caption}>
            {t('home.subtitle') || 'Welcome back to QR Parking'}
          </Text>
        </View>

        {/* Balance Card - Always show */}
        <Card
          style={[
            styles.balanceCard,
            {backgroundColor: colors.primary, marginBottom: spacing.base},
          ]}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceLeft}>
              <Text style={[styles.balanceLabel, {color: colors.white}]}>
                {t('home.balance.title') || 'Your Balance'}
              </Text>
              <Text
                style={[
                  styles.balanceValue,
                  {color: colors.white, marginTop: spacing.xs},
                ]}>
                {callBalance} {t('home.balance.calls') || 'calls'}
              </Text>
              <Text
                style={[
                  styles.balanceHelper,
                  {color: colors.white, marginTop: spacing.xs},
                ]}>
                {t('home.balance.helper') || '1 call = 1 vehicle contact'}
              </Text>
            </View>
            <BoltIcon width={48} height={48} fill={colors.white} />
          </View>

          {isBalanceLow && (
            <View style={[styles.lowBalanceWarning, {marginTop: spacing.base}]}>
              <WarningIcon width={20} height={20} fill={colors.warning} />
              <Text
                style={[
                  styles.warningText,
                  {color: colors.white, marginLeft: spacing.sm},
                ]}>
                {t('home.balance.lowBalance') || 'Low balance. Top up now!'}
              </Text>
            </View>
          )}
        </Card>

        {/* Your Activity Stats */}
        <View style={{marginBottom: spacing.lg}}>
          <Text style={[typography.h2, {marginBottom: spacing.sm}]}>
            {t('home.activity.title') || 'Your Activity'}
          </Text>

          {/* ✅ FIXED: Show loading only if no data AND timeout hasn't occurred */}
          {showLoadingSkeleton && !showDefaultUI ? (
            <View style={{padding: spacing.xl, alignItems: 'center'}}>
              <Spinner size="large" color={colors.primary} />
              <Text
                style={[
                  typography.caption,
                  {marginTop: spacing.md, color: colors.textSecondary},
                ]}>
                {t('common.loading') || 'Loading...'}
              </Text>
            </View>
          ) : (
            <View style={[styles.statsGrid, {gap: spacing.sm}]}>
              <Card style={styles.statCard}>
                <Text style={[styles.statValue, {color: colors.primary}]}>
                  {userStats?.vehicleRegistered ?? user?.vehicleRegistered ?? 0}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {textAlign: 'center', marginTop: spacing.xs},
                  ]}>
                  {t('home.activity.vehiclesRegistered') || 'Vehicles'}
                </Text>
              </Card>

              <Card style={styles.statCard}>
                <Text style={[styles.statValue, {color: colors.primary}]}>
                  {userStats?.vehicleSearched ?? user?.vehicleSearched ?? 0}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {textAlign: 'center', marginTop: spacing.xs},
                  ]}>
                  {t('home.activity.vehicleSearches') || 'Searches'}
                </Text>
              </Card>

              <Card style={styles.statCard}>
                <Text style={[styles.statValue, {color: colors.primary}]}>
                  {userStats?.timesContacted ?? user?.timesContacted ?? 0}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {textAlign: 'center', marginTop: spacing.xs},
                  ]}>
                  {t('home.activity.peopleContacted') || 'Contacted'}
                </Text>
              </Card>

              <Card style={styles.statCard}>
                <Text style={[styles.statValue, {color: colors.primary}]}>
                  {memberSince}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {textAlign: 'center', marginTop: spacing.xs},
                  ]}>
                  {t('home.activity.memberSince') || 'Member Since'}
                </Text>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  balanceCard: {
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.9,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  balanceHelper: {
    fontSize: 12,
    opacity: 0.8,
  },
  lowBalanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
});

export default HomeScreen;
