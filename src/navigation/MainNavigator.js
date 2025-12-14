/**
 * Main Navigator
 * Main app navigation after authentication
 * TODO: Will be implemented in Batch 8
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks';
import { COLORS, TYPOGRAPHY, SPACING } from '../config/theme';
import PrimaryButton from '../components/common/Button/PrimaryButton';

const MainNavigator = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigation will automatically go back to auth flow
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.title}>Welcome to QR Parking!</Text>
        <Text style={styles.subtitle}>
          You're logged in as {user?.fullName}
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>✅ Batch 5 Complete!</Text>
          <Text style={styles.infoText}>
            • Splash screen with auto-login{'\n'}
            • Welcome screen with Google Sign-In{'\n'}
            • Referral code entry flow{'\n'}
            • Auth navigation working{'\n'}
            • Token persistence{'\n'}
            {'\n'}
            Main app screens coming in Batch 6-8
          </Text>
        </View>

        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  icon: {
    fontSize: 80,
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
    marginBottom: SPACING.xl,
  },
  infoCard: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.xl,
    width: '100%',
  },
  infoTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
});

export default MainNavigator;
