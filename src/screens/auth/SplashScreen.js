/**
 * Splash Screen
 * App initialization and auto-login check
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/theme';
import { TIME } from '../../config/constants';
import Spinner from '../../components/common/Loading/Spinner';

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated, isLoading, isFirstTimeUser } = useAuth();

  // ✅ FIXED: Wrapped in useCallback
  const navigateToNextScreen = useCallback(() => {
    setTimeout(() => {
      if (isAuthenticated) {
        // User is logged in
        if (isFirstTimeUser()) {
          // First time user - check if referral was applied during signup
          navigation.replace('ReferralEntry');
        } else {
          // Returning user - go to main app
          navigation.replace('Main');
        }
      } else {
        // User not logged in - show welcome
        navigation.replace('Welcome');
      }
    }, 300);
  }, [isAuthenticated, isFirstTimeUser, navigation]);

  // ✅ FIXED: Wrapped in useCallback
  const initializeApp = useCallback(async () => {
    // Minimum splash display time for branding
    await new Promise(resolve => setTimeout(resolve, TIME.SPLASH_MIN_DURATION));

    if (!isLoading) {
      navigateToNextScreen();
    }
  }, [isLoading, navigateToNextScreen]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (!isLoading) {
      navigateToNextScreen();
    }
  }, [isLoading, navigateToNextScreen]);

  return (
    <View style={styles.container}>
      {/* Logo/Branding */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🚗</Text>
        <Text style={styles.appName}>QR Parking</Text>
        <Text style={styles.tagline}>Find vehicle owners instantly</Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loaderContainer}>
        <Spinner color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ in India 🇮🇳</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: SPACING.base,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  tagline: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  loaderContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  loadingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});

export default SplashScreen;
