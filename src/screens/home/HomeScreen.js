import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';
import {useUser} from '../../contexts/UserContext';
import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import {useToast} from '../../components/common/Toast/ToastProvider';
import {LANGUAGES} from '../../config/constants';
import Card from '../../components/common/Card/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BoltIcon, WarningIcon, LogoutIcon} from '../../assets/icons';
import Spinner from '../../components/common/Loading/Spinner';

// ── Only incoming / outgoing ──────────────────────────────────────────────────
const DUMMY_RECENT_CALLS = [
  {
    id: '1',
    plate: 'ABC-1234',
    name: 'Sarah Jenkins',
    time: '10:42 AM',
    status: 'incoming',
  },
  {
    id: '2',
    plate: 'XYZ-9876',
    name: 'Mike Peterson',
    time: 'Yesterday',
    status: 'outgoing',
  },
];

// ── Initials helper ───────────────────────────────────────────────────────────
const getInitials = name =>
  name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

const HomeScreen = ({navigation}) => {
  const {user, logout} = useAuth();
  const {getUserHome, userStats, isLoading, isRefreshing, updateSettings} =
    useUser();
  const {vehicles} = useVehicles();
  const {t, theme, currentLanguage, changeLanguage, toggleTheme, isDarkMode} =
    useTheme();
  const {showSuccess, showError} = useToast();

  const {colors, typography, spacing, layout} = theme;

  const callBalance = userStats?.callBalance ?? user?.callBalance ?? 0;
  const isBalanceLow = callBalance < 5;
  const unreadCount = userStats?.unreadNotifications ?? 0;

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const lastRefreshRef = useRef(0);
  const MIN_REFRESH_INTERVAL = 3000;

  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      if (now - lastRefreshRef.current > MIN_REFRESH_INTERVAL) {
        lastRefreshRef.current = now;
        getUserHome();
      }
    }, [getUserHome]),
  );

  const userName = user?.fullName || user?.displayName || 'User';
  const firstName = userName.split(' ')[0];

  const memberSince =
    userStats?.memberSince || user?.memberSince || user?.createdAt
      ? new Date(
          userStats?.memberSince || user?.memberSince || user?.createdAt,
        ).toLocaleDateString('en-US', {month: 'short', year: '2-digit'})
      : "Feb'26";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning') || 'Good morning';
    if (hour < 17) return t('home.greeting.afternoon') || 'Good afternoon';
    return t('home.greeting.evening') || 'Good evening';
  };

  const handleRefresh = useCallback(async () => {
    await getUserHome(true);
  }, [getUserHome]);

  const hasAnyData = userStats || user?.vehicleRegistered !== undefined;
  const showLoadingSkeleton = isLoading && !hasAnyData;

  const [showDefaultUI, setShowDefaultUI] = useState(false);
  useEffect(() => {
    if (isLoading && !hasAnyData) {
      const timeout = setTimeout(() => setShowDefaultUI(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, hasAnyData]);

  const handleDarkModeToggle = useCallback(async () => {
    const result = await toggleTheme();
    if (!result.success) showError(t('toast.settings.themeChangeFailed'));
  }, [toggleTheme, showError, t]);

  const handleLanguageChange = useCallback(
    async languageCode => {
      try {
        const themeResult = await changeLanguage(languageCode);
        if (!themeResult.success) throw new Error('UI language failed');
        await updateSettings?.({preferredLanguage: languageCode});
        setShowLanguagePicker(false);
        showSuccess(t('toast.settings.languageChanged') || 'Language changed');
      } catch {
        showError(
          t('toast.settings.updateFailed') || 'Failed to change language',
        );
      }
    },
    [changeLanguage, updateSettings, showSuccess, showError, t],
  );

  const handleLogout = useCallback(async () => {
    setShowLogoutModal(false);
    const result = await logout();
    if (!result.success) showError('Logout failed. Please try again.');
  }, [logout, showError]);

  const vehicleCount =
    userStats?.vehicleRegistered ?? user?.vehicleRegistered ?? 0;

  // ── Call status — Incoming / Outgoing only, fully theme-driven ─────────────
  const getCallStatusStyle = status => {
    switch (status) {
      case 'incoming':
        return {
          label: t('calls.status.incoming') || 'Incoming',
          bg: colors.successLight, // theme token
          text: colors.success, // theme token
        };
      case 'outgoing':
        return {
          label: t('calls.status.outgoing') || 'Outgoing',
          bg: colors.primaryLight, // theme token
          text: colors.primary, // theme token
        };
      default:
        return {
          label: status,
          bg: colors.neutralLight,
          text: colors.textSecondary,
        };
    }
  };

  const getCallIcon = status => {
    switch (status) {
      case 'incoming':
        return {name: 'call-received', color: colors.success};
      case 'outgoing':
        return {name: 'call-made', color: colors.primary};
      default:
        return {name: 'call', color: colors.textSecondary};
    }
  };

  const STATS = [
    {
      value: userStats?.vehicleRegistered ?? user?.vehicleRegistered ?? 0,
      label: t('home.activity.vehiclesRegistered') || 'Vehicles',
    },
    {
      value: userStats?.vehicleSearched ?? user?.vehicleSearched ?? 0,
      label: t('home.activity.vehicleSearches') || 'Searches',
    },
    {
      value: userStats?.timesContacted ?? user?.timesContacted ?? 0,
      label: t('home.activity.peopleContacted') || 'Contacted',
    },
    {value: memberSince, label: t('home.activity.memberSince') || 'Member'},
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
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
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={[styles.appName, {color: colors.primary}]}>
              {t('common.appName') || 'Wayze'}
            </Text>
            <Text style={[styles.greeting, {color: colors.textSecondary}]}>
              {getGreeting()}, {firstName}
            </Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={[styles.iconBtn, {backgroundColor: colors.neutralCard}]}
              onPress={handleDarkModeToggle}
              activeOpacity={0.7}>
              <Icon
                name={isDarkMode() ? 'light-mode' : 'dark-mode'}
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, {backgroundColor: colors.neutralCard}]}
              onPress={() => setShowLanguagePicker(true)}
              activeOpacity={0.7}>
              <Icon name="language" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, {backgroundColor: colors.neutralCard}]}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}>
              <Icon
                name="notifications-none"
                size={20}
                color={colors.textPrimary}
              />
              {unreadCount > 0 && (
                <View style={[styles.badge, {backgroundColor: colors.error}]}>
                  <Text style={[styles.badgeText, {color: colors.white}]}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero card ── */}
        <Card style={[styles.heroCard, {backgroundColor: colors.primary}]}>
          <View style={styles.heroInner}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroGreeting}>{getGreeting()},</Text>
              <View style={styles.heroNameRow}>
                <Text style={styles.heroName}>{firstName}</Text>
                <Text style={styles.heroEmoji}> 👋</Text>
              </View>
              <Text style={styles.heroSub}>
                {vehicleCount}{' '}
                {`vehicle${vehicleCount !== 1 ? 's' : ''} active`}
              </Text>
            </View>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>
                {firstName.slice(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>
        </Card>

        {/* ── Stats row ── */}
        {showLoadingSkeleton && !showDefaultUI ? (
          <View style={styles.loadingWrap}>
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
          <View style={styles.statsRow}>
            {STATS.map((stat, index) => (
              <View
                key={index}
                style={[styles.statBox, {backgroundColor: colors.white}]}>
                <Text
                  style={[styles.statBoxValue, {color: colors.primary}]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}>
                  {stat.value}
                </Text>
                <Text
                  style={[styles.statBoxLabel, {color: colors.textSecondary}]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Manage ── */}
        <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
          {t('home.manage.title') || 'Manage'}
        </Text>

        <View style={styles.manageRow}>
          <TouchableOpacity
            style={[styles.manageCard, {backgroundColor: colors.white}]}
            onPress={() => navigation.navigate('CallRecords')}
            activeOpacity={0.75}>
            <View
              style={[
                styles.manageIconWrap,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Icon name="phone" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.manageLabel, {color: colors.textPrimary}]}>
              {t('home.manage.callRecords') || 'Call Records'}
            </Text>
            <Text style={[styles.manageSub, {color: colors.textSecondary}]}>
              {t('home.manage.viewHistory') || 'View history'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.manageCard, {backgroundColor: colors.white}]}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.75}>
            <View
              style={[
                styles.manageIconWrap,
                {backgroundColor: colors.errorLight},
              ]}>
              <LogoutIcon width={20} height={20} fill={colors.error} />
            </View>
            <Text style={[styles.manageLabel, {color: colors.error}]}>
              {t('profile.menu.logout') || 'Logout'}
            </Text>
            <Text style={[styles.manageSub, {color: colors.error}]}>
              {t('home.manage.signOut') || 'Secure exit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Calls ── */}
        <View style={styles.recentHeader}>
          <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
            {t('home.recentCalls.title') || 'Recent Calls'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CallRecords')}
            activeOpacity={0.7}>
            <Text style={[styles.seeAll, {color: colors.primary}]}>
              {t('home.recentCalls.seeAll') || 'See all →'}
            </Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.recentCallsCard}>
          {DUMMY_RECENT_CALLS.map((call, index) => {
            const statusStyle = getCallStatusStyle(call.status);
            const iconProps = getCallIcon(call.status);
            const initials = getInitials(call.name); // ✅ initials only
            const isLast = index === DUMMY_RECENT_CALLS.length - 1;
            return (
              <View key={call.id}>
                <TouchableOpacity
                  style={styles.callItem}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('CallRecords')}>
                  {/* Avatar circle showing initials */}
                  <View
                    style={[
                      styles.callAvatarCircle,
                      {backgroundColor: statusStyle.bg},
                    ]}>
                    <Text
                      style={[
                        styles.callAvatarText,
                        {color: statusStyle.text},
                      ]}>
                      {initials}
                    </Text>
                  </View>

                  <View style={styles.callInfo}>
                    <Text
                      style={[styles.callPlate, {color: colors.textPrimary}]}>
                      {call.plate}
                    </Text>
                    {/* Direction icon + label inline */}
                    <View style={styles.callDirectionRow}>
                      <Icon
                        name={iconProps.name}
                        size={12}
                        color={iconProps.color}
                        style={{marginRight: 3}}
                      />
                      <Text
                        style={[
                          styles.callDirectionLabel,
                          {color: iconProps.color},
                        ]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[styles.callTime, {color: colors.textSecondary}]}>
                    {call.time}
                  </Text>
                </TouchableOpacity>

                {!isLast && (
                  <View
                    style={[
                      styles.callDivider,
                      {backgroundColor: colors.neutralBorder},
                    ]}
                  />
                )}
              </View>
            );
          })}
        </Card>
      </ScrollView>

      {/* ── Logout Modal ── */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.logoutOverlay}>
          <View style={[styles.logoutModal, {backgroundColor: colors.white}]}>
            <View
              style={[
                styles.logoutIconCircle,
                {backgroundColor: colors.errorLight},
              ]}>
              <LogoutIcon width={32} height={32} fill={colors.error} />
            </View>
            <Text style={[styles.logoutTitle, {color: colors.textPrimary}]}>
              {t('auth.logout.title') || 'Logout'}
            </Text>
            <Text style={[styles.logoutMessage, {color: colors.textSecondary}]}>
              {t('auth.logout.message') ||
                'Are you sure you want to logout? You will need to sign in again to access your account.'}
            </Text>
            <View style={styles.logoutButtons}>
              <TouchableOpacity
                style={[
                  styles.logoutCancelBtn,
                  {
                    backgroundColor: colors.neutralLight,
                    borderColor: colors.neutralBorder,
                  },
                ]}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.logoutCancelText,
                    {color: colors.textPrimary},
                  ]}>
                  {t('common.cancel') || 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.logoutConfirmBtn,
                  {backgroundColor: colors.error},
                ]}
                onPress={handleLogout}
                activeOpacity={0.7}>
                <LogoutIcon width={16} height={16} fill={colors.white} />
                <Text style={[styles.logoutConfirmText, {color: colors.white}]}>
                  {t('auth.logout.button') || 'Logout'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Language Modal ── */}
      <Modal
        visible={showLanguagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguagePicker(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguagePicker(false)}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: colors.white, padding: spacing.lg},
            ]}>
            <Text
              style={[
                styles.modalTitle,
                {color: colors.textPrimary, marginBottom: spacing.base},
              ]}>
              {t('profile.settings.selectLanguage') || 'Select Language'}
            </Text>
            {[
              {code: LANGUAGES.EN, label: '🇬🇧 English'},
              {code: LANGUAGES.HI, label: '🇮🇳 हिन्दी (Hindi)'},
            ].map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  {padding: spacing.base, marginBottom: spacing.sm},
                  currentLanguage === lang.code && {
                    backgroundColor: colors.primaryLight,
                    borderWidth: 2,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => handleLanguageChange(lang.code)}>
                <Text
                  style={[
                    {fontSize: 16, color: colors.textPrimary},
                    currentLanguage === lang.code && {
                      color: colors.primary,
                      fontWeight: '600',
                    },
                  ]}>
                  {lang.label}
                </Text>
                {currentLanguage === lang.code && (
                  <Text style={{color: colors.primary, fontSize: 20}}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: colors.neutralLight,
                  padding: spacing.base,
                  marginTop: spacing.sm,
                },
              ]}
              onPress={() => setShowLanguagePicker(false)}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.textPrimary,
                  textAlign: 'center',
                }}>
                {t('common.cancel') || 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},
  scrollContent: {paddingTop: 12, paddingBottom: 16},

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {gap: 1},
  appName: {fontSize: 22, fontWeight: '700', letterSpacing: 0.2},
  greeting: {fontSize: 13},
  topActions: {flexDirection: 'row', gap: 8},
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {fontSize: 9, fontWeight: '700'},

  // Hero card
  heroCard: {padding: 9, marginBottom: 10},
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: {flex: 1},
  heroGreeting: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 1,
  },
  heroNameRow: {flexDirection: 'row', alignItems: 'center'},
  heroName: {fontSize: 24, fontWeight: '700', color: '#fff'},
  heroEmoji: {fontSize: 22},
  heroSub: {fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4},
  heroAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  heroAvatarText: {fontSize: 16, fontWeight: '700', color: '#fff'},

  // Stats
  statsRow: {flexDirection: 'row', gap: 8, marginBottom: 12},
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  statBoxValue: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 3,
  },
  statBoxLabel: {fontSize: 11, fontWeight: '500', textAlign: 'center'},

  // Manage
  sectionTitle: {fontSize: 15, fontWeight: '700', marginBottom: 8},
  manageRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
  manageCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  manageIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  manageLabel: {fontSize: 14, fontWeight: '600', marginBottom: 2},
  manageSub: {fontSize: 11},

  // Recent calls
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  seeAll: {fontSize: 13, fontWeight: '600'},
  recentCallsCard: {marginBottom: 8, padding: 0},

  // ✅ Tighter call item padding
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5, // was 10
    paddingHorizontal: 12, // was 14
  },
  // ✅ Initials avatar circle (replaces callIconCircle)
  callAvatarCircle: {
    width: 34, // was 38
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8, // was 10
  },
  callAvatarText: {fontSize: 12, fontWeight: '700'},

  callInfo: {flex: 1},
  callPlate: {fontSize: 14, fontWeight: '600'},

  // ✅ Direction row replacing callName
  callDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  callDirectionLabel: {fontSize: 11, fontWeight: '500'},

  callTime: {fontSize: 11},
  callDivider: {height: 1, marginHorizontal: 12},

  loadingWrap: {alignItems: 'center', paddingVertical: 20},

  // Logout modal
  logoutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoutModal: {
    width: '100%',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },
  logoutIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  logoutMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  logoutButtons: {flexDirection: 'row', gap: 12, width: '100%'},
  logoutCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoutCancelText: {fontSize: 15, fontWeight: '600'},
  logoutConfirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  logoutConfirmText: {fontSize: 15, fontWeight: '600'},

  // Language modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {borderTopLeftRadius: 16, borderTopRightRadius: 16},
  modalTitle: {fontSize: 20, fontWeight: '600', textAlign: 'center'},
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelButton: {borderRadius: 8, alignItems: 'center'},

  // Balance (kept commented-out — no changes needed)
  balanceCard: {padding: 20},
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLeft: {flex: 1},
  balanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
    marginBottom: 6,
  },
  balanceValueRow: {flexDirection: 'row', alignItems: 'flex-end'},
  balanceValueNumber: {fontSize: 38, fontWeight: '700', color: '#fff'},
  balanceValueUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  readyRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  readyText: {fontSize: 13, color: '#fff', fontWeight: '500'},
  balanceRight: {alignItems: 'center'},
  topUpText: {fontSize: 13, color: '#fff', fontWeight: '600'},
  lowBalanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {flex: 1, fontSize: 13, color: '#fff'},
});

export default HomeScreen;
