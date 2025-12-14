/**
 * Referral Entry Screen
 * Optional referral code entry for new users
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReferral, useAuth } from '../../hooks';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import { REFERRAL } from '../../config/constants';
import { validateReferralCode } from '../../utils/validators';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import TextInput from '../../components/common/Input/TextInput';
import Card from '../../components/common/Card/Card';

const ReferralEntryScreen = ({ navigation }) => {
  const { validateReferralCode: validateCode, applyReferralCode, isLoading } = useReferral();
  const { completeOnboarding } = useAuth();

  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedCode, setValidatedCode] = useState(null);

  const handleCodeChange = (text) => {
    setReferralCode(text.toUpperCase());
    setError('');
    setValidatedCode(null);
  };

  const handleValidate = async () => {
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
        setValidatedCode(result.data);
        setError('');
      } else {
        setError('Invalid referral code');
      }
    } catch (err) {
      setError(err.message || 'Failed to validate code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleApply = async () => {
    if (!validatedCode) {return;}

    const result = await applyReferralCode(referralCode);

    if (result.success) {
      // Mark onboarding as complete
      await completeOnboarding();
      // Navigate to main app
      navigation.replace('Main');
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as complete
    await completeOnboarding();
    // Navigate to main app
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.icon}>🎁</Text>
            <Text style={styles.title}>Got a referral code?</Text>
            <Text style={styles.subtitle}>
              Enter code and get bonus calls for free!
            </Text>
          </View>

          {/* Reward Card */}
          <Card style={styles.rewardCard}>
            <Text style={styles.rewardIcon}>🎉</Text>
            <Text style={styles.rewardText}>
              Get {REFERRAL.REWARD_AMOUNT} free calls
            </Text>
            <Text style={styles.rewardSubtext}>
              Use them to contact vehicle owners
            </Text>
          </Card>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label="Referral Code (Optional)"
              value={referralCode}
              onChangeText={handleCodeChange}
              placeholder="Enter code"
              autoCapitalize="characters"
              maxLength={8}
              error={error}
              helperText={!error ? 'Get this code from friends who use the app' : undefined}
              disabled={isLoading || isValidating}
            />

            {/* Validated Code Display */}
            {validatedCode && (
              <Card style={styles.validatedCard}>
                <Text style={styles.validatedIcon}>✅</Text>
                <Text style={styles.validatedText}>
                  Valid code from {validatedCode.referrerName}
                </Text>
                <Text style={styles.validatedReward}>
                  You'll get {validatedCode.reward} free calls
                </Text>
              </Card>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {!validatedCode ? (
              <PrimaryButton
                title="Validate Code"
                onPress={handleValidate}
                loading={isValidating}
                disabled={referralCode.length < 6 || isLoading}
                fullWidth
              />
            ) : (
              <PrimaryButton
                title="Apply & Continue"
                onPress={handleApply}
                loading={isLoading}
                fullWidth
                icon={<Text style={{ color: COLORS.white }}>→</Text>}
              />
            )}

            <SecondaryButton
              title="Skip for now"
              onPress={handleSkip}
              disabled={isLoading || isValidating}
              fullWidth
              style={{ marginTop: SPACING.md }}
            />
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 You can also enter a referral code later from your profile settings
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  icon: {
    fontSize: 60,
    marginBottom: SPACING.base,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  rewardCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    marginBottom: SPACING.xl,
  },
  rewardIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  rewardText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  rewardSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  validatedCard: {
    alignItems: 'center',
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    marginTop: SPACING.base,
  },
  validatedIcon: {
    fontSize: 30,
    marginBottom: SPACING.xs,
  },
  validatedText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  validatedReward: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  infoContainer: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.base,
    borderRadius: 8,
    marginBottom: SPACING.xl,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ReferralEntryScreen;
