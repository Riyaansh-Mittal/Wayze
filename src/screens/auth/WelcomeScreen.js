/**
 * Welcome Screen
 * Google Sign-In entry point
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../hooks';
import {useTheme} from '../../contexts/ThemeContext';
import {GoogleIcon} from '../../assets/icons';

const WelcomeScreen = () => {
  const {t, theme} = useTheme();
  const {colors, spacing} = theme;
  const {
    googleLogin,
    isLoading: authLoading,
    legalDocs,
    getLegalDocuments,
  } = useAuth();
  const navigation = useNavigation();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setButtonLoading(true);
      const result = await googleLogin(navigation);

      if (result.success) {
        // ✅ Login successful - AuthContext handles navigation
        console.log('✅ Login successful');
      } else if (result.cancelled) {
        console.log('⏭️ User cancelled Google Sign-In');
      } else if (result.error === 'ACCOUNT_DELETED') {
        // ✅ Show specific alert for deleted accounts
        Alert.alert(
          t('auth.accountDeleted.title') || 'Account Deleted',
          t('auth.accountDeleted.message') ||
            'Your account was permanently deleted and cannot be restored. You can create a new account by signing in again.',
          [
            {
              text: t('common.ok') || 'OK',
              style: 'default',
            },
          ],
        );
      } else if (result.error === 'ACCOUNT_BLOCKED') {
        // ✅ Show specific alert for blocked accounts
        Alert.alert(
          t('auth.accountBlocked.title') || 'Account Blocked',
          t('auth.accountBlocked.message') ||
            'Your account has been blocked due to policy violations. Please contact support for assistance.',
          [
            {
              text: t('common.contactSupport') || 'Contact Support',
              onPress: () => {
                // TODO: Open support email or screen
                console.log('Open support');
              },
            },
            {
              text: t('common.ok') || 'OK',
              style: 'cancel',
            },
          ],
        );
      } else {
        // ✅ Generic error - toast already shown by AuthContext
        console.log('❌ Login failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
    } finally {
      setButtonLoading(false);
    }
  };

  const openTerms = () => {
    if (legalDocs?.termsAndConditions) {
      // Already loaded
      navigation.navigate('LegalDocument', {
        title: 'Terms of Service',
        htmlContent: legalDocs.termsAndConditions,
      });
    } else {
      // Load on-demand
      console.log('📄 Loading Terms on demand...');
      getLegalDocuments().then(docs => {
        if (docs?.termsAndConditions) {
          navigation.navigate('LegalDocument', {
            title: 'Terms of Service',
            htmlContent: docs.termsAndConditions,
          });
        }
      });
    }
  };

  const openPrivacy = () => {
    if (legalDocs?.privacyPolicy) {
      // Already loaded
      navigation.navigate('LegalDocument', {
        title: 'Privacy Policy',
        htmlContent: legalDocs.privacyPolicy,
      });
    } else {
      // Load on-demand
      console.log('📄 Loading Privacy Policy on demand...');
      getLegalDocuments().then(docs => {
        if (docs?.privacyPolicy) {
          navigation.navigate('LegalDocument', {
            title: 'Privacy Policy',
            htmlContent: docs.privacyPolicy,
          });
        }
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          {/* ✅ Use actual logo image */}
          <View style={[styles.logoCircle, {backgroundColor: colors.primary}]}>
            <Image
              source={require('../../assets/images/app-icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text
            style={[
              styles.appName,
              {color: colors.textPrimary, marginTop: spacing.xl},
            ]}>
            {t?.('common.appName') || 'QR Parking'}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {color: colors.textSecondary, marginTop: spacing.sm},
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
                borderColor: colors.neutralBorder,
                opacity: buttonLoading || authLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.7}
            disabled={buttonLoading || authLoading}>
            <View style={styles.googleContent}>
              {buttonLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.loader}
                  />
                  <Text
                    style={[styles.googleText, {color: colors.textPrimary}]}>
                    {t?.('auth.signingIn') || 'Signing in...'}
                  </Text>
                </>
              ) : authLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.loader}
                  />
                  <Text
                    style={[styles.googleText, {color: colors.textPrimary}]}>
                    {t?.('auth.settingUp') || 'Setting up...'}
                  </Text>
                </>
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <GoogleIcon width={20} height={20} />
                  </View>
                  <Text
                    style={[styles.googleText, {color: colors.textPrimary}]}>
                    {t?.('auth.welcome.googleButton') || 'Continue with Google'}
                  </Text>
                </>
              )}
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
              {' and '}
              <Text
                style={[styles.legalLink, {color: colors.primary}]}
                onPress={openPrivacy}>
                {t?.('auth.welcome.privacy') || 'Privacy Policy'}
              </Text>
            </Text>
          </View>
        </View>
      </View>
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
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 28,
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
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
  loader: {
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
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
