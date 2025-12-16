/**
 * Settings Screen
 * Notifications, privacy, preferences, account settings
 * FULLY THEME-AWARE WITH PROPER DARK MODE SUPPORT
 */

import React, {useState} from 'react';
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
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {useToast} from '../../components/common/Toast/ToastProvider';
import {LANGUAGES} from '../../config/constants';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import { InfoIcon } from '../../assets/icons';

const SettingsScreen = ({navigation}) => {
  const {user, updateUserPreferences} = useAuth();
  const {t, theme, currentLanguage, changeLanguage, toggleTheme, isDarkMode} =
    useTheme();
  const {showSuccess, showError} = useToast();
  const {colors, typography, spacing, layout} = theme;

  const [pushNotifications, setPushNotifications] = useState(
    user?.preferences?.pushNotifications ?? true,
  );
  const [emailAlerts, setEmailAlerts] = useState(
    user?.preferences?.emailAlerts ?? true,
  );
  const [smsAlerts, setSmsAlerts] = useState(
    user?.preferences?.smsAlerts ?? false,
  );
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleToggle = async (key, value, setter) => {
    setter(value);

    try {
      await updateUserPreferences({[key]: value});
      showSuccess('Preference updated');
    } catch (error) {
      showError('Failed to update preference');
      setter(!value);
    }
  };

  const handleDarkModeToggle = async () => {
    const result = await toggleTheme();
    if (result.success) {
      showSuccess(`${result.theme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
    } else {
      showError('Failed to change theme');
    }
  };

  const handleLanguageChange = async languageCode => {
    const result = await changeLanguage(languageCode);
    setShowLanguagePicker(false);

    if (result.success) {
      showSuccess(
        t('profile.settings.languageChanged') ||
          'Language changed successfully',
      );
    } else {
      showError('Failed to change language');
    }
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Your Data',
      "We'll prepare your data and send you an email with a download link within 24 hours.",
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: 'Request Data',
          onPress: async () => {
            showSuccess(t('profile.settings.dataExport.preparing'));
            setTimeout(() => {
              showSuccess(t('profile.settings.dataExport.checkEmail'));
            }, 2000);
          },
        },
      ],
    );
  };

  const getLanguageDisplayName = () => {
    switch (currentLanguage) {
      case LANGUAGES.HI:
        return 'हिन्दी';
      case LANGUAGES.EN:
      default:
        return 'English';
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('profile.settings.title')}
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
            {t('profile.settings.notifications.title')}
          </Text>
          <Card>
            <ToggleItem
              icon="🔔"
              label={t('profile.settings.notifications.push')}
              value={pushNotifications}
              onValueChange={value =>
                handleToggle('pushNotifications', value, setPushNotifications)
              }
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <ToggleItem
              icon="📧"
              label={t('profile.settings.notifications.email')}
              value={emailAlerts}
              onValueChange={value =>
                handleToggle('emailAlerts', value, setEmailAlerts)
              }
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <ToggleItem
              icon="📱"
              label={t('profile.settings.notifications.sms')}
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
            {t('profile.settings.privacy.title')}
          </Text>
          <Card>
            <SelectItem
              icon="👁️"
              label={t('profile.settings.privacy.visibility')}
              value={t('profile.settings.privacy.public')}
              onPress={() => showSuccess(t('common.comingSoon'))}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="🔗"
              label={t('profile.settings.privacy.downloadData')}
              onPress={handleDownloadData}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon={<InfoIcon width={15} height={15} fill={colors.primary}/>}
              label={t('profile.settings.privacy.dataPolicy')}
              onPress={() => showSuccess(t('common.comingSoon'))}
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
            {t('profile.settings.preferences.title')}
          </Text>
          <Card>
            <ToggleItem
              icon="🌙"
              label={t('profile.settings.preferences.darkMode')}
              value={isDarkMode()}
              onValueChange={handleDarkModeToggle}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <SelectItem
              icon="🌐"
              label={t('profile.settings.preferences.language')}
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
            {t('profile.settings.account.title')}
          </Text>
          <Card>
            <MenuItem
              icon="🔐"
              label={t('profile.settings.account.changePassword')}
              onPress={() => showSuccess(t('common.comingSoon'))}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="🔗"
              label={t('profile.settings.account.linkedAccounts')}
              onPress={() => showSuccess(t('common.comingSoon'))}
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
              {t('profile.settings.selectLanguage')}
            </Text>

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
                English
              </Text>
              {currentLanguage === LANGUAGES.EN && (
                <Text style={{color: colors.primary, fontSize: 20}}>✓</Text>
              )}
            </TouchableOpacity>

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
                हिन्दी (Hindi)
              </Text>
              {currentLanguage === LANGUAGES.HI && (
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
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// Toggle Item Component
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

// Select Item Component
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

// Menu Item Component
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
