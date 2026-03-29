/**
 * Profile Home Screen
 * Simplified profile with referral and settings menu only
 * FULLY THEME-AWARE
 * UPDATED: Settings controls (notifications, email alerts, profile visibility, data policy) integrated
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Share,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuth} from '../../contexts/AuthContext';
import {useBalance} from '../../contexts/BalanceContext';
import {useUser} from '../../contexts/UserContext';
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
  BellIcon,
} from '../../assets/icons';

const ProfileHomeScreen = ({navigation}) => {
  const {user, logout} = useAuth();
  const {referralStats, getReferralStats, getReferralCode} = useBalance();
  const {getSettings, updateSettings: updateUserSettings, settings} = useUser();
  const {t, theme} = useTheme();
  const {showSuccess, showError} = useToast();

  const {colors, typography, spacing, layout} = theme;
  const referralCode = getReferralCode();

  // ── Settings local state ──────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  // ✅ Track if we've already loaded stats
  const hasLoadedStatsRef = useRef(false);

  /**
   * ✅ FIXED: Only load stats once on mount
   */
  useEffect(() => {
    const loadStats = async () => {
      if (hasLoadedStatsRef.current) {
        console.log('⏭️ Referral stats already loaded, skipping');
        return;
      }
      console.log('📊 Loading referral stats...');
      const result = await getReferralStats();
      if (result.success) {
        hasLoadedStatsRef.current = true;
      } else if (result.error && result.error !== 'Not authenticated') {
        console.error('Failed to load referral stats:', result.error);
      }
    };
    loadStats();
  }, [getReferralStats]);

  // ── Load settings on mount ────────────────────────────────────────────────
  useEffect(() => {
    const loadSettings = async () => {
      console.log('⚙️ Loading user settings...');
      const result = await getSettings();
      if (result.success) {
        console.log('✅ Settings loaded:', result.data);
      } else {
        console.log('⚠️ No settings found, using defaults');
      }
    };
    loadSettings();
  }, [getSettings]);

  // ── Sync local state when settings change ────────────────────────────────
  useEffect(() => {
    if (settings) {
      console.log('🔄 Syncing settings state:', settings);
      setNotifications(settings.notifications ?? true);
      setEmailAlerts(settings.emailAlerts ?? true);
      setProfileVisibility(settings.profileVisibility ?? true);
    }
  }, [settings]);

  // ── Handle toggle with optimistic update ─────────────────────────────────
  const handleToggle = useCallback(
    async (key, value, setter) => {
      setter(value);
      console.log(`⚙️ Updating ${key} to ${value}...`);
      const result = await updateUserSettings({[key]: value});
      if (!result.success) {
        console.error(`❌ Failed to update ${key}`);
        setter(!value);
        showError(t('toast.settings.updateFailed'));
      } else {
        console.log(`✅ ${key} updated successfully`);
      }
    },
    [updateUserSettings, showError, t],
  );

  // const handleCopyCode = useCallback(() => {
  //   if (referralCode) {
  //     Clipboard.setString(referralCode);
  //     showSuccess(t('profile.referral.copiedToast') || 'Referral code copied!');
  //   }
  // }, [referralCode, showSuccess, t]);

  // const handleShareCode = useCallback(async () => {
  //   try {
  //     const message = `Join QR Parking using my referral code ${referralCode} and get 10 free calls! Download now: https://qrparking.com/refer/${referralCode}`;
  //     await Share.share({message, title: t('common.share') || 'Share'});
  //   } catch (error) {
  //     console.error('Share failed:', error);
  //   }
  // }, [referralCode, t]);

  const handleDeleteAccount = useCallback(() => {
    navigation.navigate('DeleteAccountStep1');
  }, [navigation]);

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
        {/* ── User Card ── */}
        <Card style={styles.userCard}>
          {/* ✅ Avatar centred via alignItems: 'center' on userCard */}
          <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
            <Text style={[styles.avatarText, {color: colors.white}]}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text
            style={[
              typography.h2,
              {marginBottom: spacing.xs, textAlign: 'center'},
            ]}>
            {userName}
          </Text>
          <Text
            style={[
              typography.caption,
              {marginBottom: spacing.xs, textAlign: 'center'},
            ]}>
            {userEmail}
          </Text>
          {userPhone && (
            <Text
              style={[
                typography.caption,
                {marginBottom: spacing.sm, textAlign: 'center'},
              ]}>
              {userPhone}
            </Text>
          )}

          {/* Verification Badges */}
          {/* <View
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
          </View> */}
        </Card>

        {/* Referral Card */}
        {/* <Card
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
            }) ||
              `${referralStats?.totalReferrals || 0} referrals • ${
                referralStats?.totalEarned || 0
              } calls earned`}
          </Text>
        </Card> */}

        {/* ── Settings Menu ── */}
        <View style={{marginBottom: spacing.md}}>
          <Text style={[typography.h2, {marginBottom: spacing.sm}]}>
            {t('profile.menu.settings')}
          </Text>
          <Card style={{padding: 0}}>
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

        {/* ── Notifications ── */}
        <View style={{marginBottom: spacing.md}}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.textPrimary, marginBottom: spacing.sm},
            ]}>
            {t('profile.settings.notifications.title') || 'Notifications'}
          </Text>
          <Card style={{padding: 0}}>
            <ToggleItem
              icon={<BellIcon width={22} height={22} fill={colors.warning} />}
              label={
                t('profile.settings.notifications.push') || 'Push Notifications'
              }
              value={notifications}
              onValueChange={value =>
                handleToggle('notifications', value, setNotifications)
              }
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <ToggleItem
              icon={<Text style={styles.emojiIcon}>📧</Text>}
              label={
                t('profile.settings.notifications.email') || 'Email Alerts'
              }
              value={emailAlerts}
              onValueChange={value =>
                handleToggle('emailAlerts', value, setEmailAlerts)
              }
              theme={theme}
            />
          </Card>
        </View>

        {/* ── Privacy ── */}
        <View style={{marginBottom: spacing.md}}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.textPrimary, marginBottom: spacing.sm},
            ]}>
            {t('profile.settings.privacy.title') || 'Privacy'}
          </Text>
          <Card style={{padding: 0}}>
            <ToggleItem
              icon={<Text style={styles.emojiIcon}>👁️</Text>}
              label={
                t('profile.settings.privacy.visibility') || 'Profile Visibility'
              }
              value={profileVisibility}
              onValueChange={value =>
                handleToggle('profileVisibility', value, setProfileVisibility)
              }
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon={<Text style={styles.emojiIcon}>📜</Text>}
              label={t('profile.settings.privacy.dataPolicy') || 'Data Policy'}
              onPress={() =>
                showSuccess(t('common.comingSoon') || 'Coming Soon')
              }
              theme={theme}
            />
          </Card>
        </View>

        {/* ── Account Actions ── */}
        <View style={{marginTop: spacing.sm}}>
          <SecondaryButton
            icon={<TrashIcon width={20} height={20} fill={colors.error} />}
            title={t('profile.menu.deleteAccount')}
            onPress={handleDeleteAccount}
            fullWidth
            style={{
              marginTop: spacing.md,
              borderColor: colors.error,
            }}
            textStyle={{color: colors.error}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Toggle Item ───────────────────────────────────────────────────────────────
const ToggleItem = ({icon, label, value, onValueChange, theme}) => {
  const {colors, spacing} = theme;
  return (
    <View style={[styles.toggleItem, {padding: spacing.base}]}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text
        style={[
          styles.itemLabel,
          {color: colors.textPrimary, flex: 1, marginLeft: spacing.base},
        ]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: colors.neutralBorder, true: colors.primary}}
        thumbColor={colors.white}
        ios_backgroundColor={colors.neutralBorder}
      />
    </View>
  );
};

// ── Menu Item ─────────────────────────────────────────────────────────────────
const MenuItem = ({icon, label, onPress, theme}) => {
  const {colors, typography, spacing} = theme;
  return (
    <TouchableOpacity
      style={[styles.menuItem, {padding: spacing.base}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={[typography.body, {flex: 1, marginLeft: spacing.base}]}>
        {label}
      </Text>
      <Text style={[styles.menuChevron, {color: colors.textSecondary}]}>›</Text>
    </TouchableOpacity>
  );
};

// ── Divider ───────────────────────────────────────────────────────────────────
const Divider = ({color}) => (
  <View style={[styles.divider, {backgroundColor: color}]} />
);

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},
  scrollContent: {paddingTop: 24, paddingBottom: 48},

  // ✅ Avatar centred — alignItems: 'center' on userCard + paddingTop/Bottom
  userCard: {
    alignItems: 'center', // ← centres avatar + text horizontally
    marginBottom: 16,
    padding: 0
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center', // ← belt-and-braces centre
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
  },

  badges: {flexDirection: 'row'},
  badge: {paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6},
  badgeText: {fontSize: 12, fontWeight: '500'},

  referralCard: {borderWidth: 2},
  referralHeader: {flexDirection: 'row', alignItems: 'center'},
  codeBox: {
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  codeText: {fontSize: 20, fontWeight: '700'},
  referralActions: {flexDirection: 'row'},

  // Shared row icon wrapper — ensures SVG and emoji align identically
  rowIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {fontSize: 22},

  menuItem: {flexDirection: 'row', alignItems: 'center'},
  menuChevron: {fontSize: 20},

  // ToggleItem uses same row layout as MenuItem
  toggleItem: {flexDirection: 'row', alignItems: 'center'},

  itemLabel: {fontSize: 16},

  sectionTitle: {fontSize: 16, fontWeight: '600'},

  divider: {height: 1},
});

export default ProfileHomeScreen;
