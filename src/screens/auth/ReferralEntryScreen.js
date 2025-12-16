/**
 * Referral Entry Screen
 * Optional referral code entry for new users
 * FULLY THEME-AWARE - MATCHES DESIGN
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useReferral, useAuth} from '../../hooks';
import {useTheme} from '../../contexts/ThemeContext';
import {REFERRAL} from '../../config/constants';
import {validateReferralCode} from '../../utils/validators';
import PrimaryButton from '../../components/common/Button/PrimaryButton';

const ReferralEntryScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, spacing} = theme;
  const {
    validateReferralCode: validateCode,
    applyReferralCode,
    isLoading,
  } = useReferral();
  const {completeOnboarding} = useAuth();

  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedCode, setValidatedCode] = useState(null);

  const handleCodeChange = text => {
    setReferralCode(text.toUpperCase());
    setError('');
    setValidatedCode(null);
  };

  const handleApply = async () => {
    if (!referralCode.trim()) {
      handleSkip();
      return;
    }

    // Validate format first
    const validation = validateReferralCode(referralCode);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const result = await validateCode(referralCode);

      if (result.success && result.data.valid) {
        // Apply the code
        const applyResult = await applyReferralCode(referralCode);

        if (applyResult.success) {
          await completeOnboarding();
          navigation.replace('Main');
        }
      } else {
        setError(t?.('auth.referral.invalidCode') || 'Invalid referral code');
      }
    } catch (err) {
      setError(
        err.message ||
          t?.('auth.referral.validateError') ||
          'Failed to validate code',
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigation.replace('Main');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Decorative Border Frame */}
          <View style={[styles.borderFrame, {borderColor: colors.primary}]}>
            {/* Corner Decorations */}
            <View
              style={[styles.cornerTopLeft, {borderColor: colors.primary}]}
            />
            <View
              style={[styles.cornerTopRight, {borderColor: colors.primary}]}
            />
            <View
              style={[styles.cornerBottomLeft, {borderColor: colors.primary}]}
            />
            <View
              style={[styles.cornerBottomRight, {borderColor: colors.primary}]}
            />

            {/* Content */}
            <View style={styles.content}>
              {/* Icon */}
              <View style={[styles.iconContainer, {marginBottom: spacing.lg}]}>
                <Text style={styles.icon}>🎁</Text>
              </View>

              {/* Title */}
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.sm,
                  },
                ]}>
                {t?.('auth.referral.title') || 'Got a referral code?'}
              </Text>

              {/* Subtitle */}
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                    marginBottom: spacing.xl,
                  },
                ]}>
                {t?.('auth.referral.subtitle') ||
                  'Enter code and get bonus calls for free!'}
              </Text>

              {/* Reward Badge */}
              <View
                style={[
                  styles.rewardBadge,
                  {
                    backgroundColor: colors.warningLight,
                    marginBottom: spacing.xl,
                  },
                ]}>
                <Text style={styles.rewardIcon}>⚡</Text>
                <Text style={[styles.rewardText, {color: colors.textPrimary}]}>
                  {t?.('auth.referral.rewardShort') ||
                    `Get ${REFERRAL.REWARD_AMOUNT} free calls`}
                </Text>
              </View>

              {/* Input */}
              <View style={[styles.inputContainer, {marginBottom: spacing.sm}]}>
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: colors.textSecondary,
                      marginBottom: spacing.sm,
                    },
                  ]}>
                  {t?.('auth.referral.codeLabel') || 'Referral Code (Optional)'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.white,
                      borderColor: error ? colors.error : colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  value={referralCode}
                  onChangeText={handleCodeChange}
                  placeholder={
                    t?.('auth.referral.codePlaceholder') || 'ENTER CODE'
                  }
                  placeholderTextColor={colors.textDisabled}
                  autoCapitalize="characters"
                  maxLength={8}
                  editable={!isLoading && !isValidating}
                />
                {error && (
                  <Text style={[styles.errorText, {color: colors.error}]}>
                    {error}
                  </Text>
                )}
              </View>

              {/* Helper Text */}
              <Text
                style={[
                  styles.helperText,
                  {
                    color: colors.textSecondary,
                    marginBottom: spacing.xl,
                  },
                ]}>
                {t?.('auth.referral.codeHelper') ||
                  'Get this code from friends who use the app'}
              </Text>

              {/* Apply Button */}
              <PrimaryButton
                title={t?.('auth.referral.applyButton') || 'Apply & Continue'}
                onPress={handleApply}
                loading={isLoading || isValidating}
                fullWidth
                style={{marginBottom: spacing.md}}
              />

              {/* Skip Button */}
              <TouchableOpacity
                onPress={handleSkip}
                disabled={isLoading || isValidating}
                style={styles.skipButton}>
                <Text style={[styles.skipText, {color: colors.textSecondary}]}>
                  {t?.('auth.referral.skipButton') || 'Skip for now'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Progress Indicator */}
          <View style={[styles.progressContainer, {marginTop: spacing.xl}]}>
            <View
              style={[
                styles.progressBar,
                {backgroundColor: colors.neutralLight},
              ]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: '50%',
                  },
                ]}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 40,
  },
  borderFrame: {
    flex: 1,
    borderWidth: 3,
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 20,
    height: 20,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 20,
    height: 20,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -3,
    left: -3,
    width: 20,
    height: 20,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 20,
    height: 20,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderBottomRightRadius: 16,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rewardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  rewardText: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    marginTop: 4,
  },
  helperText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default ReferralEntryScreen;
