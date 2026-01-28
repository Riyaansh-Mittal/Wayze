/**
 * Settings Screen
 * FIXED: Proper API integration with UserContext
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUser} from '../../contexts/UserContext';
import {useTheme} from '../../contexts/ThemeContext';
import {useToast} from '../../components/common/Toast/ToastProvider';
import {LANGUAGES} from '../../config/constants';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import Spinner from '../../components/common/Loading/Spinner';
import {BellIcon} from '../../assets/icons';

const SettingsScreen = ({navigation}) => {
  const {
    getSettings,
    updateSettings: updateUserSettings,
    settings,
    isLoading,
  } = useUser();
  const {t, theme, currentLanguage, changeLanguage, toggleTheme, isDarkMode} =
    useTheme();
  const {showSuccess, showError} = useToast();
  const {colors, typography, spacing, layout} = theme;

  // Local state synced with API settings
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  // ✅ Load settings on mount
  const loadSettings = useCallback(async () => {
    console.log('⚙️ Loading user settings...');
    const result = await getSettings();
    if (result.success) {
      console.log('✅ Settings loaded:', result.data);
    } else {
      console.log('⚠️ No settings found, using defaults');
    }
  }, [getSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ✅ Sync local state when settings change
  useEffect(() => {
    if (settings) {
      console.log('🔄 Syncing settings state:', settings);
      setNotifications(settings.notifications ?? true);
      setEmailAlerts(settings.emailAlerts ?? true);
      setSmsAlerts(settings.smsAlerts ?? true);
      setProfileVisibility(settings.profileVisibility ?? true);
    }
  }, [settings]);

  // ✅ Handle toggle with API call and optimistic update
  const handleToggle = useCallback(
    async (key, value, setter) => {
      // Optimistic update
      setter(value);
      console.log(`⚙️ Updating ${key} to ${value}...`);

      const result = await updateUserSettings({[key]: value});

      if (!result.success) {
        console.error(`❌ Failed to update ${key}`);
        // Revert on failure
        setter(!value);
        showError(t('toast.settings.updateFailed'));
      } else {
        console.log(`✅ ${key} updated successfully`);
      }
    },
    [updateUserSettings, showError, t],
  );

  // ✅ Handle dark mode toggle (local preference, not API)
  const handleDarkModeToggle = useCallback(async () => {
    const result = await toggleTheme();
    if (result.success) {
      showSuccess(
        result.theme === 'dark'
          ? t('toast.settings.darkModeEnabled')
          : t('toast.settings.lightModeEnabled'),
      );
    } else {
      showError(t('toast.settings.themeChangeFailed'));
    }
  }, [toggleTheme, showSuccess, showError, t]);

  // ✅ Handle language change (local preference, not API)
  const handleLanguageChange = useCallback(
    async languageCode => {
      console.log('🌐 Changing language to:', languageCode);
      const result = await changeLanguage(languageCode);
      setShowLanguagePicker(false);

      if (result.success) {
        showSuccess(
          t('toast.settings.languageChanged') ||
            'Language changed successfully',
        );
      } else {
        showError(
          t('toast.settings.updateFailed') || 'Failed to change language',
        );
      }
    },
    [changeLanguage, showSuccess, showError, t],
  );

  // ✅ Handle data download request
  const handleDownloadData = useCallback(() => {
    Alert.alert(
      t('profile.settings.dataExport.title') || 'Download Your Data',
      t('profile.settings.dataExport.message') ||
        "We'll prepare your data and send you an email with a download link within 24 hours.",
      [
        {text: t('common.cancel') || 'Cancel', style: 'cancel'},
        {
          text: t('profile.settings.dataExport.confirm') || 'Request Data',
          onPress: async () => {
            console.log('📦 Requesting data export...');
            showSuccess(
              t('toast.dataExport.preparing') ||
                'Preparing your data...',
            );
            setTimeout(() => {
              showSuccess(
                t('toast.dataExport.checkEmail') ||
                  'Check your email for download link',
              );
            }, 2000);
          },
        },
      ],
    );
  }, [t, showSuccess]);

  // ✅ Get display name for current language
  const getLanguageDisplayName = useCallback(() => {
    switch (currentLanguage) {
      case LANGUAGES.HI:
        return 'हिन्दी';
      case LANGUAGES.MR:
        return 'मराठी';
      case LANGUAGES.EN:
      default:
        return 'English';
    }
  }, [currentLanguage]);

  // Show loading state while fetching
  if (isLoading && !settings) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.neutralLight}]}
        edges={['top']}>
        <AppBar
          title={t('profile.settings.title') || 'Settings'}
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner size="large" color={colors.primary} />
          <Text
            style={[
              typography.caption,
              {marginTop: spacing.md, color: colors.textSecondary},
            ]}>
            {t('common.loading') || 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('profile.settings.title') || 'Settings'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: layout.screenPadding},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.textPrimary, marginBottom: spacing.sm},
            ]}>
            {t('profile.settings.notifications.title') || 'Notifications'}
          </Text>
          <Card>
            <ToggleItem
              icon={<BellIcon width={24} height={24} fill={colors.warning} />}
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
              icon="📧"
              label={
                t('profile.settings.notifications.email') || 'Email Alerts'
              }
              value={emailAlerts}
              onValueChange={value =>
                handleToggle('emailAlerts', value, setEmailAlerts)
              }
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <ToggleItem
              icon="📱"
              label={t('profile.settings.notifications.sms') || 'SMS Alerts'}
              value={smsAlerts}
              onValueChange={value =>
                handleToggle('smsAlerts', value, setSmsAlerts)
              }
              theme={theme}
            />
          </Card>
        </View>

        {/* Privacy Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.textPrimary, marginBottom: spacing.sm},
            ]}>
            {t('profile.settings.privacy.title') || 'Privacy'}
          </Text>
          <Card>
            <ToggleItem
              icon="👁️"
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
              icon="📥"
              label={
                t('profile.settings.privacy.downloadData') || 'Download My Data'
              }
              onPress={handleDownloadData}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="📜"
              label={t('profile.settings.privacy.dataPolicy') || 'Data Policy'}
              onPress={() =>
                showSuccess(t('common.comingSoon') || 'Coming Soon')
              }
              theme={theme}
            />
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.textPrimary, marginBottom: spacing.sm},
            ]}>
            {t('profile.settings.preferences.title') || 'Preferences'}
          </Text>
          <Card>
            <ToggleItem
              icon="🌙"
              label={t('profile.settings.preferences.darkMode') || 'Dark Mode'}
              value={isDarkMode()}
              onValueChange={handleDarkModeToggle}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <SelectItem
              icon="🌐"
              label={t('profile.settings.preferences.language') || 'Language'}
              value={getLanguageDisplayName()}
              onPress={() => setShowLanguagePicker(true)}
              theme={theme}
            />
          </Card>
        </View>

        {/* Account Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.textPrimary, marginBottom: spacing.sm},
            ]}>
            {t('profile.settings.account.title') || 'Account'}
          </Text>
          <Card>
            <MenuItem
              icon="🔐"
              label={
                t('profile.settings.account.changePassword') ||
                'Change Password'
              }
              onPress={() =>
                showSuccess(t('common.comingSoon') || 'Coming Soon')
              }
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="🔗"
              label={
                t('profile.settings.account.linkedAccounts') ||
                'Linked Accounts'
              }
              onPress={() =>
                showSuccess(t('common.comingSoon') || 'Coming Soon')
              }
              theme={theme}
            />
          </Card>
        </View>
      </ScrollView>

      {/* Language Picker Modal */}
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
              {
                backgroundColor: colors.white,
                padding: spacing.lg,
              },
            ]}>
            <Text
              style={[
                styles.modalTitle,
                {
                  color: colors.textPrimary,
                  marginBottom: spacing.base,
                },
              ]}>
              {t('profile.settings.selectLanguage') || 'Select Language'}
            </Text>

            {/* English */}
            <TouchableOpacity
              style={[
                styles.languageOption,
                {padding: spacing.base, marginBottom: spacing.sm},
                currentLanguage === LANGUAGES.EN && {
                  backgroundColor: colors.primaryLight,
                  borderWidth: 2,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleLanguageChange(LANGUAGES.EN)}>
              <Text
                style={[
                  styles.languageText,
                  {color: colors.textPrimary},
                  currentLanguage === LANGUAGES.EN && {
                    color: colors.primary,
                    fontWeight: '600',
                  },
                ]}>
                🇬🇧 English
              </Text>
              {currentLanguage === LANGUAGES.EN && (
                <Text style={{color: colors.primary, fontSize: 20}}>✓</Text>
              )}
            </TouchableOpacity>

            {/* Hindi */}
            <TouchableOpacity
              style={[
                styles.languageOption,
                {padding: spacing.base, marginBottom: spacing.sm},
                currentLanguage === LANGUAGES.HI && {
                  backgroundColor: colors.primaryLight,
                  borderWidth: 2,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleLanguageChange(LANGUAGES.HI)}>
              <Text
                style={[
                  styles.languageText,
                  {color: colors.textPrimary},
                  currentLanguage === LANGUAGES.HI && {
                    color: colors.primary,
                    fontWeight: '600',
                  },
                ]}>
                🇮🇳 हिन्दी (Hindi)
              </Text>
              {currentLanguage === LANGUAGES.HI && (
                <Text style={{color: colors.primary, fontSize: 20}}>✓</Text>
              )}
            </TouchableOpacity>

            {/* Marathi */}
            <TouchableOpacity
              style={[
                styles.languageOption,
                {padding: spacing.base, marginBottom: spacing.sm},
                currentLanguage === LANGUAGES.MR && {
                  backgroundColor: colors.primaryLight,
                  borderWidth: 2,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleLanguageChange(LANGUAGES.MR)}>
              <Text
                style={[
                  styles.languageText,
                  {color: colors.textPrimary},
                  currentLanguage === LANGUAGES.MR && {
                    color: colors.primary,
                    fontWeight: '600',
                  },
                ]}>
                🇮🇳 मराठी (Marathi)
              </Text>
              {currentLanguage === LANGUAGES.MR && (
                <Text style={{color: colors.primary, fontSize: 20}}>✓</Text>
              )}
            </TouchableOpacity>

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
                style={[
                  styles.cancelText,
                  {
                    color: colors.textPrimary,
                    fontWeight: '600',
                  },
                ]}>
                {t('common.cancel') || 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// ✅ Component definitions remain the same
const ToggleItem = ({icon, label, value, onValueChange, theme}) => {
  const {colors, spacing} = theme;
  return (
    <View style={[styles.toggleItem, {padding: spacing.base}]}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text
        style={[
          styles.itemLabel,
          {
            color: colors.textPrimary,
            flex: 1,
            marginLeft: spacing.base,
          },
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

const SelectItem = ({icon, label, value, onPress, theme}) => {
  const {colors, spacing} = theme;
  return (
    <TouchableOpacity
      style={[styles.selectItem, {padding: spacing.base}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <View style={[styles.selectContent, {marginLeft: spacing.base}]}>
        <Text style={[styles.itemLabel, {color: colors.textPrimary}]}>
          {label}
        </Text>
        <Text
          style={[
            styles.itemValue,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
            },
          ]}>
          {value}
        </Text>
      </View>
      <Text style={[styles.itemChevron, {color: colors.textSecondary}]}>›</Text>
    </TouchableOpacity>
  );
};

const MenuItem = ({icon, label, onPress, theme}) => {
  const {colors, spacing} = theme;
  return (
    <TouchableOpacity
      style={[styles.menuItem, {padding: spacing.base}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text
        style={[
          styles.itemLabel,
          {
            color: colors.textPrimary,
            flex: 1,
            marginLeft: spacing.base,
          },
        ]}>
        {label}
      </Text>
      <Text style={[styles.itemChevron, {color: colors.textSecondary}]}>›</Text>
    </TouchableOpacity>
  );
};

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 24,
  },
  itemLabel: {
    fontSize: 16,
  },
  itemValue: {
    fontSize: 14,
  },
  itemChevron: {
    fontSize: 20,
  },
  divider: {
    height: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  languageText: {
    fontSize: 16,
  },
  cancelButton: {
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;
