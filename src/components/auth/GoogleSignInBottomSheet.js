/**
 * Google Sign-In Bottom Sheet
 * Modern bottom sheet modal matching the reference design
 */

import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import {GoogleIcon} from '../../assets/icons';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const GoogleSignInBottomSheet = forwardRef(({onSignIn, isLoading}, ref) => {
  const {theme, t} = useTheme();
  const {colors, spacing} = theme;
  const insets = useSafeAreaInsets();
  
  const [isVisible, setIsVisible] = useState(false);
  const translateY = useState(new Animated.Value(SCREEN_HEIGHT))[0];

  useImperativeHandle(ref, () => ({
    present: () => {
      setIsVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        damping: 25,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    },
    dismiss: () => {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    },
  }));

  const handleBackdropPress = () => {
    if (!isLoading) {
      ref.current?.dismiss();
    }
  };

  const handleSignInPress = () => {
    if (!isLoading) {
      onSignIn();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleBackdropPress}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                {
                  backgroundColor: colors.white,
                  paddingBottom: insets.bottom + spacing.lg,
                  transform: [{translateY}],
                },
              ]}>
              {/* Handle Bar */}
              <View style={styles.handleBar}>
                <View
                  style={[
                    styles.handle,
                    {backgroundColor: colors.neutralBorder},
                  ]}
                />
              </View>

              {/* Google Logo */}
              <View style={styles.logoContainer}>
                <View style={styles.googleLogo}>
                  <GoogleIcon width={48} height={48} />
                </View>
              </View>

              {/* Title */}
              <Text style={[styles.title, {color: colors.textPrimary}]}>
                {t('auth.bottomSheet.title') || 'Sign in to QR Parking'}
              </Text>

              {/* Description */}
              <Text style={[styles.description, {color: colors.textSecondary}]}>
                {t('auth.bottomSheet.description') ||
                  'By continuing, Google will share your name, email address and profile picture with QR Parking.'}
              </Text>

              {/* Privacy Links */}
              <View style={styles.privacyLinks}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => console.log('Privacy Policy')}>
                  <Text style={[styles.linkText, {color: colors.primary}]}>
                    {t('auth.bottomSheet.privacy') || 'Privacy Policy'}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.linkSeparator, {color: colors.textSecondary}]}>
                  {' and '}
                </Text>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => console.log('Terms of Service')}>
                  <Text style={[styles.linkText, {color: colors.primary}]}>
                    {t('auth.bottomSheet.terms') || 'Terms of Service'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Google Account Info */}
              <Text style={[styles.accountInfo, {color: colors.textSecondary}]}>
                {t('auth.bottomSheet.accountInfo') ||
                  'You can manage Sign in with Google in your Google Account.'}
              </Text>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: isLoading ? 0.7 : 1,
                  },
                ]}
                onPress={handleSignInPress}
                disabled={isLoading}
                activeOpacity={0.8}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <GoogleIcon width={20} height={20} />
                    <Text style={[styles.signInText, {color: colors.white}]}>
                      {t('auth.bottomSheet.continueButton') ||
                        'Continue with Google'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleBackdropPress}
                disabled={isLoading}>
                <Text style={[styles.cancelText, {color: colors.textSecondary}]}>
                  {t('common.cancel') || 'Cancel'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  googleLogo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  privacyLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  linkButton: {
    padding: 4,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    fontSize: 13,
  },
  accountInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default GoogleSignInBottomSheet;
