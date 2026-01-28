/**
 * Send Alert Modal
 * Two-tier alert system: High Priority (Urgent) or Low Priority (Warning)
 * FULLY THEME-AWARE WITH TRANSLATIONS
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ContactService} from '../../services/api';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';
import {
  InfoIcon,
  WarningIcon,
  AlertIcon,
  FreeIcon,
  BellIcon,
} from '../../assets/icons';
import {useTheme} from '../../contexts/ThemeContext';

const SendAlertModal = ({navigation, route}) => {
  const {vehicle, searchQuery} = route.params;
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;

  const [selectedPriority, setSelectedPriority] = useState(null); // 'high' or 'low'
  const [isSending, setIsSending] = useState(false);

  const handleSendAlert = async () => {
    // 1. Validation
    if (!selectedPriority) {
      Alert.alert(
        t('search.alert.priorityRequired'),
        t('search.alert.priorityRequiredDesc'),
      );
      return;
    }

    // 2. Direct Send (Confirmation removed as requested)
    sendAlert();
  };

  const sendAlert = async () => {
    setIsSending(true);

    try {
      // API Call
      const response = await ContactService.initiateAlert({
        receiverId: vehicle?.owner?.userId || vehicle?.userId, // Defensive check
        priorityHigh: selectedPriority === 'high',
      });

      // 3. Handle Success
      if (response.success) {
        Alert.alert(
          t('search.alert.successTitle'),
          selectedPriority === 'high'
            ? t('search.alert.successMessageHigh')
            : t('search.alert.successMessageLow'),
          [
            {
              text: t('common.ok'),
              onPress: () => navigation.navigate('FindVehicle'),
            },
          ],
        );
      } else {
        // 4. Handle Logic Failure (e.g., 400 Bad Request returned by service wrapper)
        handleApiError(response.message);
      }
    } catch (error) {
      // 5. Handle Network/Server Failure (Incomplete call, Network Error, etc.)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t('search.alert.errorMessage');

      handleApiError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Centralized Error Handler
   * checks for specific backend messages
   */
  const handleApiError = message => {
    const errorMsg = message || '';

    // Check specifically for "Receiver not found" from your backend controller
    if (errorMsg.includes('Receiver not found')) {
      Alert.alert(
        t('search.alert.errorTitle'),
        t('search.alert.userNotFound', {
          defaultValue:
            'Vehicle owner ID not found. They may have deactivated their account.',
        }),
      );
      return;
    }

    // Generic Fallback
    Alert.alert(
      t('search.alert.errorTitle'),
      errorMsg ||
        t('search.alert.errorMessage', {
          defaultValue: 'Something went wrong. Please try again.',
        }),
    );
  };

  const renderPriorityCard = (priority, icon, title, description, color) => {
    const isSelected = selectedPriority === priority;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedPriority(priority)}
        style={[
          styles.priorityCard,
          {
            backgroundColor: isSelected ? color + '15' : colors.surface,
            borderWidth: 2,
            borderColor: isSelected ? color : colors.border,
            borderRadius: 12,
            marginBottom: spacing.md,
          },
        ]}>
        <View style={styles.priorityHeader}>
          <Text style={styles.priorityIcon}>{icon}</Text>
          <View style={styles.priorityTextContainer}>
            <Text
              style={[
                styles.priorityTitle,
                {
                  color: isSelected ? color : colors.textPrimary,
                  fontWeight: isSelected ? '700' : '600',
                },
              ]}>
              {title}
            </Text>
            <Text
              style={[
                styles.priorityDescription,
                {color: colors.textSecondary},
              ]}>
              {description}
            </Text>
          </View>
          {isSelected && (
            <View
              style={[
                styles.checkmark,
                {
                  backgroundColor: color,
                },
              ]}>
              <Text style={styles.checkmarkIcon}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('search.alert.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, {marginBottom: spacing.xl}]}>
          <Text style={[styles.icon, {marginBottom: spacing.md}]}>
            <BellIcon width={60} height={60} fill={colors.warning} />
          </Text>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              },
            ]}>
            {t('search.alert.heading')}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                textAlign: 'center',
              },
            ]}>
            {t('search.alert.subtitle', {plate: searchQuery})}
          </Text>
        </View>

        {/* Free Badge */}
        <Card
          style={[
            styles.freeCard,
            {
              backgroundColor: colors.successLight,
              borderColor: colors.success,
              borderWidth: 1,
              marginBottom: spacing.xl,
            },
          ]}>
          <View style={styles.freeRow}>
            <Text style={[styles.freeIcon, {marginRight: spacing.md}]}>
              <FreeIcon width={40} height={40} fill={colors.success} />
            </Text>
            <View style={styles.freeInfo}>
              <Text
                style={[
                  styles.freeTitle,
                  {
                    color: colors.success,
                    marginBottom: spacing.xs,
                  },
                ]}>
                {t('search.alert.freeTitle')}
              </Text>
              <Text
                style={[styles.freeDescription, {color: colors.textSecondary}]}>
                {t('search.alert.freeDescription')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Priority Selection */}
        <View style={[styles.prioritySection, {marginBottom: spacing.lg}]}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.textPrimary,
                marginBottom: spacing.md,
              },
            ]}>
            {t('search.alert.selectPriority')}
          </Text>

          {/* High Priority */}
          {renderPriorityCard(
            'high',
            <AlertIcon width={40} height={40} fill={colors.error} />,
            t('search.alert.highPriorityTitle'),
            t('search.alert.highPriorityDesc'),
            colors.error,
          )}

          {/* Low Priority */}
          {renderPriorityCard(
            'low',
            <WarningIcon width={40} height={40} fill={colors.warning} />,
            t('search.alert.lowPriorityTitle'),
            t('search.alert.lowPriorityDesc'),
            colors.warning,
          )}
        </View>

        {/* Info Box */}
        <Card
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.primaryLight,
              marginBottom: spacing.xl,
            },
          ]}>
          <View style={styles.infoRow}>
            <View style={{marginRight: spacing.md}}>
              <InfoIcon width={24} height={24} fill={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.sm,
                  },
                ]}>
                {t('search.alert.infoTitle')}
              </Text>
              <Text
                style={[
                  styles.infoDescription,
                  {
                    color: colors.textSecondary,
                    lineHeight: 20,
                  },
                ]}>
                • {t('search.alert.infoPoint1')}
                {'\n'}• {t('search.alert.infoPoint2')}
                {'\n'}• {t('search.alert.infoPoint3')}
                {'\n'}• {t('search.alert.infoPoint4')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title={
              isSending
                ? t('search.alert.sending')
                : t('search.alert.sendButton')
            }
            onPress={handleSendAlert}
            loading={isSending}
            fullWidth
            disabled={!selectedPriority || isSending}
            style={{marginBottom: spacing.md}}
          />

          <SecondaryButton
            title={t('search.alert.cancelButton')}
            onPress={() => navigation.goBack()}
            fullWidth
            disabled={isSending}
          />
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
  scrollContent: {},
  header: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  freeCard: {},
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeIcon: {
    fontSize: 32,
  },
  freeInfo: {
    flex: 1,
  },
  freeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  freeDescription: {
    fontSize: 13,
  },
  prioritySection: {},
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  priorityCard: {
    padding: 16,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  priorityTextContainer: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
  priorityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoDescription: {
    fontSize: 13,
  },
  actions: {},
});

export default SendAlertModal;
