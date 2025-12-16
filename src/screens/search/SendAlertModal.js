/**
 * Send Alert Modal
 * Free action to notify vehicle owner
 * FULLY THEME-AWARE WITH TRANSLATIONS
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ContactService} from '../../services/api';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';
import {InfoIcon} from '../../assets/icons';
import {useTheme} from '../../contexts/ThemeContext';

const SendAlertModal = ({navigation, route}) => {
  const {vehicle, searchQuery} = route.params;
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendAlert = async () => {
    if (!message.trim()) {
      Alert.alert(
        t('search.alert.messageRequired'),
        t('search.alert.messageRequiredDesc'),
      );
      return;
    }

    setIsSending(true);

    try {
      const response = await ContactService.sendAlert({
        vehicleId: vehicle._id,
        searchQuery,
        message: message.trim(),
      });

      if (response.success) {
        Alert.alert(
          t('search.alert.successTitle'),
          t('search.alert.successMessage'),
          [
            {
              text: t('common.ok'),
              onPress: () => navigation.navigate('FindVehicle'),
            },
          ],
        );
      } else {
        Alert.alert(
          t('search.alert.errorTitle'),
          t('search.alert.errorMessage'),
        );
      }
    } catch (error) {
      Alert.alert(t('search.alert.errorTitle'), t('search.alert.errorMessage'));
    } finally {
      setIsSending(false);
    }
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
          <Text style={[styles.icon, {marginBottom: spacing.md}]}>🔔</Text>
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
              marginBottom: spacing.lg,
            },
          ]}>
          <View style={styles.freeRow}>
            <Text style={[styles.freeIcon, {marginRight: spacing.md}]}>✨</Text>
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

        {/* Message Input */}
        <View style={[styles.inputSection, {marginBottom: spacing.lg}]}>
          <Text
            style={[
              styles.label,
              {
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              },
            ]}>
            {t('search.alert.messageLabel')}
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: spacing.md,
                color: colors.textPrimary,
              },
            ]}
            placeholder={t('search.alert.messagePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={200}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
          <Text
            style={[
              styles.charCount,
              {
                color: colors.textSecondary,
                marginTop: spacing.xs,
              },
            ]}>
            {t('search.alert.charCount', {count: message.length})}
          </Text>
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
            disabled={!message.trim()}
            style={{marginBottom: spacing.md}}
          />

          <SecondaryButton
            title={t('search.alert.cancelButton')}
            onPress={() => navigation.goBack()}
            fullWidth
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
  inputSection: {},
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    fontSize: 15,
    minHeight: 100,
  },
  charCount: {
    fontSize: 13,
    textAlign: 'right',
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
