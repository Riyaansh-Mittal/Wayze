/**
 * Welcome Screen
 * Google Sign-In entry point
 * FULLY INTEGRATED WITH REAL GOOGLE SIGN-IN
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../hooks';
import {useTheme} from '../../contexts/ThemeContext';
import {EXTERNAL_URLS} from '../../config/constants';
import FullScreenLoader from '../../components/common/Loading/FullScreenLoader';
import {GoogleIcon} from '../../assets/icons';

const WelcomeScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, spacing} = theme;
  const {googleLogin} = useAuth(); // ✅ Use googleLogin instead of socialLogin
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      // ✅ Call Google Sign-In
      const result = await googleLogin();

      if (result.success) {
        // ✅ FIXED: Only navigate for first-time users
        if (result.isFirstTime) {
          navigation.replace('ReferralEntry');
        }
        // ✅ For returning users, do nothing - AuthContext will handle navigation
        // When googleLogin() succeeds, isAuthenticated becomes true
        // AppNavigator will automatically switch to Main screen
      } else if (result.cancelled) {
        // User cancelled - do nothing
        console.log('User cancelled Google Sign-In');
      } else {
        // Show error
        Alert.alert(
          'Login Failed',
          result.error || 'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          {/* App Icon */}
          <View style={[styles.logoCircle, {backgroundColor: colors.primary}]}>
            <Text style={[styles.logoIcon, {color: colors.white}]}>
              {t?.('common.appIcon') || '🚗'}
            </Text>
          </View>

          {/* App Name */}
          <Text
            style={[
              styles.appName,
              {
                color: colors.textPrimary,
                marginTop: spacing.xl,
              },
            ]}>
            {t?.('common.appName') || 'Welcome to QR Parking'}
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                marginTop: spacing.sm,
              },
            ]}>
            {t?.('auth.welcome.subtitle') ||
              'Sign in to save your vehicles and be reachable when needed'}
          </Text>
        </View>

        {/* Sign In Section */}
        <View style={styles.signInSection}>
          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[
              styles.googleButton,
              {
                backgroundColor: colors.white,
                borderColor: colors.border,
              },
            ]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.7}>
            <View style={styles.googleContent}>
              {/* Google Icon - Replace with actual SVG */}
              <View style={styles.googleIconContainer}>
                <GoogleIcon width={20} height={20} />
              </View>
              <Text style={[styles.googleText, {color: colors.textPrimary}]}>
                {t?.('auth.welcome.googleButton') || 'Continue with Google'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Legal Text */}
          <View style={[styles.legalContainer, {marginTop: spacing.md}]}>
            <Text style={[styles.legalText, {color: colors.textSecondary}]}>
              {t?.('auth.welcome.legalText') ||
                'By continuing, you agree to our'}{' '}
              <Text
                style={[styles.legalLink, {color: colors.primary}]}
                onPress={openTerms}>
                {t?.('auth.welcome.terms') || 'Terms'}
              </Text>
              {'\n'}
              {t?.('auth.welcome.and') || 'and'}{' '}
              <Text
                style={[styles.legalLink, {color: colors.primary}]}
                onPress={openPrivacy}>
                {t?.('auth.welcome.privacy') || 'Privacy Policy'}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <FullScreenLoader message={t?.('auth.signingIn') || 'Signing in...'} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  signInSection: {
    width: '100%',
  },
  googleButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  legalContainer: {
    alignItems: 'center',
  },
  legalText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
