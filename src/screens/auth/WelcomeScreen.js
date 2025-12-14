/**
 * Welcome Screen
 * Google Sign-In entry point
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import { EXTERNAL_URLS } from '../../config/constants';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import FullScreenLoader from '../../components/common/Loading/FullScreenLoader';

const WelcomeScreen = ({ navigation }) => {
  const { socialLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // TODO: Integrate with actual Google Sign-In
      // For now, use mock data
      const mockGoogleUser = {
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        email: 'test.user@gmail.com',
        phoneNumber: '',
        deviceType: 'ANDROID',
        fcmToken: 'mock-fcm-token',
        photo: 'https://i.pravatar.cc/150?img=1',
      };

      const result = await socialLogin(mockGoogleUser);

      if (result.success) {
        // Check if first time user
        if (result.isFirstTime) {
          // New user - go to referral entry
          navigation.replace('ReferralEntry');
        } else {
          // Returning user - go to main app
          navigation.replace('Main');
        }
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openTerms = () => {
    Linking.openURL(EXTERNAL_URLS.TERMS);
  };

  const openPrivacy = () => {
    Linking.openURL(EXTERNAL_URLS.PRIVACY);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🚗</Text>
          <Text style={styles.appName}>QR Parking</Text>
          <Text style={styles.tagline}>Find vehicle owners instantly</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="🔍"
            title="Search Vehicles"
            description="Find vehicle owners by plate number"
          />
          <FeatureItem
            icon="📱"
            title="Contact Owners"
            description="Call or message when you need to"
          />
          <FeatureItem
            icon="🚙"
            title="Register Your Vehicles"
            description="Be reachable when someone needs you"
          />
          <FeatureItem
            icon="🎁"
            title="Earn Free Calls"
            description="Get rewards for referring friends"
          />
        </View>

        {/* Sign In Button */}
        <View style={styles.signInContainer}>
          <PrimaryButton
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            fullWidth
            icon={<Text style={styles.googleIcon}>G</Text>}
          />

          {/* Legal Text */}
          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>
              By continuing, you agree to our{' '}
              <Text style={styles.legalLink} onPress={openTerms}>
                Terms
              </Text>{' '}
              and{' '}
              <Text style={styles.legalLink} onPress={openPrivacy}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in India 🇮🇳</Text>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      <FullScreenLoader visible={isLoading} message="Signing in..." />
    </SafeAreaView>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: LAYOUT.screenPadding,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
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
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    paddingVertical: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  featureIcon: {
    fontSize: 40,
    marginRight: SPACING.base,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  signInContainer: {
    marginTop: 'auto',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  legalContainer: {
    marginTop: SPACING.base,
    paddingHorizontal: SPACING.base,
  },
  legalText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  legalLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.base,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});

export default WelcomeScreen;
