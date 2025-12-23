/**
 * Profile Home Screen
 * Simplified profile with referral and settings menu only
 * FULLY THEME-AWARE
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuth} from '../../contexts/AuthContext';
import {useBalance} from '../../contexts/BalanceContext';
import {useTheme} from '../../contexts/ThemeContext';
import {useToast} from '../../components/common/Toast/ToastProvider';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import {
  GiftIcon,
  HistoryIcon,
  SettingsIcon,
  InfoIcon,
  SosIcon,
  LogoutIcon,
  TrashIcon,
} from '../../assets/icons';

const ProfileHomeScreen = ({navigation}) => {
  const {user, logout} = useAuth();
  const {referralStats, getReferralStats, getReferralCode} = useBalance();
  const {t, theme} = useTheme();
  const {showSuccess, showError} = useToast();

  const {colors, typography, spacing, layout} = theme;
  const referralCode = getReferralCode();

  useEffect(() => {
    getReferralStats();
  }, [getReferralStats]);

  const handleCopyCode = () => {
    if (referralCode) {
      Clipboard.setString(referralCode);
      showSuccess(t('profile.referral.copiedToast'));
    }
  };

  const handleShareCode = async () => {
    try {
      const message = `Join QR Parking using my referral code ${referralCode} and get 10 free calls! Download now: https://qrparking.com/refer/${referralCode}`;
      await Share.share({message, title: t('common.share')});
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(t('auth.logout.title'), t('auth.logout.message'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('auth.logout.button'),
        style: 'destructive',
        onPress: async () => {
          const result = await logout();
          if (!result.success) {
            showError('Logout failed. Please try again.');
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    navigation.navigate('DeleteAccountStep1');
  };

  const userName = user?.fullName || user?.displayName || 'User';
  const userEmail = user?.email || '';
  const userPhone = user?.phone ? `+91 *****${user.phone.slice(-4)}` : '';

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar title={t('profile.title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: layout.screenPadding},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
            <Text style={[styles.avatarText, {color: colors.white}]}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={[typography.h2, {marginBottom: spacing.xs}]}>
            {userName}
          </Text>
          <Text style={[typography.caption, {marginBottom: spacing.xs}]}>
            {userEmail}
          </Text>
          {userPhone && (
            <Text style={[typography.caption, {marginBottom: spacing.sm}]}>
              {userPhone}
            </Text>
          )}

          {/* Verification Badges */}
          <View
            style={[styles.badges, {gap: spacing.sm, marginTop: spacing.sm}]}>
            {user?.verification?.email && (
              <View style={[styles.badge, {backgroundColor: colors.success}]}>
                <Text style={[styles.badgeText, {color: colors.white}]}>
                  {t('profile.verified.email')}
                </Text>
              </View>
            )}
            {user?.verification?.phone && (
              <View style={[styles.badge, {backgroundColor: colors.success}]}>
                <Text style={[styles.badgeText, {color: colors.white}]}>
                  {t('profile.verified.phone')}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Referral Card */}
        <Card
          style={[
            styles.referralCard,
            {
              borderColor: colors.primary,
              backgroundColor: colors.primaryLight,
              marginBottom: spacing.base,
            },
          ]}>
          <View style={[styles.referralHeader, {marginBottom: spacing.sm}]}>
            <GiftIcon width={28} height={28} fill={colors.primary} />
            <Text style={[typography.h2, {marginLeft: spacing.sm}]}>
              {t('profile.referral.title')}
            </Text>
          </View>

          <Text style={[typography.caption, {marginBottom: spacing.base}]}>
            {t('profile.referral.message', {give: 10, get: 10})}
          </Text>

          <View style={{marginBottom: spacing.base}}>
            <Text style={[typography.caption, {marginBottom: spacing.xs}]}>
              {t('profile.referral.yourCode')}
            </Text>
            <View
              style={[
                styles.codeBox,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.primary,
                  padding: spacing.sm,
                },
              ]}>
              <Text style={[styles.codeText, {color: colors.primary}]}>
                {referralCode}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.referralActions,
              {gap: spacing.sm, marginBottom: spacing.sm},
            ]}>
            <SecondaryButton
              title={t('profile.referral.copyButton')}
              onPress={handleCopyCode}
              icon={<Text style={{fontSize: 20}}>📋</Text>}
              style={{flex: 1}}
            />
            <PrimaryButton
              title={t('profile.referral.shareButton')}
              onPress={handleShareCode}
              icon={<Text style={{color: colors.white, fontSize: 20}}>📤</Text>}
              style={{flex: 1}}
            />
          </View>

          <Text style={[typography.small, {textAlign: 'center'}]}>
            {t('profile.referral.stats', {
              count: referralStats?.totalReferrals || 0,
              earned: referralStats?.totalEarned || 0,
            })}
          </Text>
        </Card>

        {/* Settings Menu */}
        <View style={{marginBottom: spacing.lg}}>
          <Text style={[typography.h2, {marginBottom: spacing.sm}]}>
            {t('profile.menu.settings')}
          </Text>
          <Card>
            <MenuItem
              icon={
                <HistoryIcon width={24} height={24} fill={colors.primary} />
              }
              label={t('profile.menu.activity')}
              onPress={() => navigation.navigate('ActivityHistory')}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon={
                <SettingsIcon width={24} height={24} fill={colors.primary} />
              }
              label={t('profile.menu.settingsItem')}
              onPress={() => navigation.navigate('Settings')}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon={
                <SosIcon width={24} height={24} fill={colors.textPrimary} />
              }
              label={t('profile.menu.help')}
              onPress={() => navigation.navigate('HelpSupport')}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon={<InfoIcon width={24} height={24} fill={colors.primary} />}
              label={t('profile.menu.about')}
              onPress={() => navigation.navigate('About')}
              theme={theme}
            />
          </Card>
        </View>

        {/* Account Actions */}
        <View style={{marginTop: spacing.base}}>
          <SecondaryButton
            icon={<LogoutIcon width={20} height={20} fill={colors.primary} />}
            title={`${t('profile.menu.logout')}`}
            onPress={handleLogout}
            fullWidth
          />

          <SecondaryButton
            icon={<TrashIcon width={20} height={20} fill={colors.error} />}
            title={t('profile.menu.deleteAccount')}
            onPress={handleDeleteAccount}
            fullWidth
            style={{
              marginTop: spacing.md,
              borderColor: colors.error,
            }}
            textStyle={{
              color: colors.error,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Menu Item Component
const MenuItem = ({icon, label, onPress, theme}) => {
  const {colors, typography, spacing} = theme;
  return (
    <TouchableOpacity
      style={[styles.menuItem, {padding: spacing.base}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[typography.body, {flex: 1, marginLeft: spacing.base}]}>
        {label}
      </Text>
      <Text style={[styles.menuChevron, {color: colors.textSecondary}]}>›</Text>
    </TouchableOpacity>
  );
};

// Divider Component
const Divider = ({color}) => (
  <View style={[styles.divider, {backgroundColor: color}]} />
);

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
  userCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  referralCard: {
    borderWidth: 2,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeBox: {
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 20,
    fontWeight: '700',
  },
  referralActions: {
    flexDirection: 'row',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
  },
  menuChevron: {
    fontSize: 20,
  },
  divider: {
    height: 1,
  },
});

export default ProfileHomeScreen;
