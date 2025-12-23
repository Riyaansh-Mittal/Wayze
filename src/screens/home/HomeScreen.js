/**
 * Home Screen
 * Main dashboard with balance, activity stats, and quick actions
 * FULLY THEME-AWARE
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../contexts/AuthContext';
import {useBalance} from '../../contexts/BalanceContext';
import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  BoltIcon,
  WarningIcon,
} from '../../assets/icons';

const HomeScreen = ({navigation}) => {
  const {user} = useAuth();
  const {balance} = useBalance();
  const {vehicles} = useVehicles();
  const {t, theme} = useTheme();

  const {colors, typography, spacing, layout} = theme;
  const isBalanceLow = balance < 5;

  const userName = user?.fullName || user?.displayName || 'User';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'June 2024';

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning');
    if (hour < 17) return t('home.greeting.afternoon');
    return t('home.greeting.evening');
  };

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
        onRightPress={() =>
          navigation.navigate('Profile', {screen: 'Notifications'})
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: layout.screenPadding},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text style={[typography.h1, {marginBottom: spacing.xs}]}>
            {getGreeting()}, {userName}
          </Text>
          <Text style={typography.caption}>
            {t('home.subtitle')}
          </Text>
        </View>

        {/* Balance Card */}
        <Card
          style={[
            styles.balanceCard,
            {backgroundColor: colors.primary, marginBottom: spacing.base},
          ]}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceLeft}>
              <Text style={[styles.balanceLabel, {color: colors.white}]}>
                {t('home.balance.title')}
              </Text>
              <Text
                style={[
                  styles.balanceValue,
                  {color: colors.white, marginTop: spacing.xs},
                ]}>
                {t('home.balance.calls', {count: balance})}
              </Text>
              <Text
                style={[
                  styles.balanceHelper,
                  {color: colors.white, marginTop: spacing.xs},
                ]}>
                {t('home.balance.helper')}
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
                {t('home.balance.lowBalance')}
              </Text>
            </View>
          )}
        </Card>

        {/* Your Activity Stats */}
        <View style={{marginBottom: spacing.lg}}>
          <Text style={[typography.h2, {marginBottom: spacing.sm}]}>
            {t('home.activity.title')}
          </Text>
          <View style={[styles.statsGrid, {gap: spacing.sm}]}>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, {color: colors.primary}]}>
                {vehicles.length}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {textAlign: 'center', marginTop: spacing.xs},
                ]}>
                {t('home.activity.vehiclesRegistered')}
              </Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={[styles.statValue, {color: colors.primary}]}>
                12
              </Text>
              <Text
                style={[
                  typography.caption,
                  {textAlign: 'center', marginTop: spacing.xs},
                ]}>
                {t('home.activity.vehicleSearches')}
              </Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={[styles.statValue, {color: colors.primary}]}>
                3
              </Text>
              <Text
                style={[
                  typography.caption,
                  {textAlign: 'center', marginTop: spacing.xs},
                ]}>
                {t('home.activity.peopleContacted')}
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
                {t('home.activity.memberSince')}
              </Text>
            </Card>
          </View>
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
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});

export default HomeScreen;
