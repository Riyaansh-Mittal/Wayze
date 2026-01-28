// /**
//  * Welcome Screen
//  * Google Sign-In entry point
//  * FULLY INTEGRATED WITH REAL GOOGLE SIGN-IN
//  */

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Linking,
//   Alert,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {useNavigation} from '@react-navigation/native';
// import {useAuth} from '../../hooks';
// import {useTheme} from '../../contexts/ThemeContext';
// import {EXTERNAL_URLS} from '../../config/constants';
// import FullScreenLoader from '../../components/common/Loading/FullScreenLoader';
// import {GoogleIcon} from '../../assets/icons';

// const WelcomeScreen = () => {
//   const {t, theme} = useTheme();
//   const {colors, spacing} = theme;
//   const {googleLogin} = useAuth(); // ✅ Use googleLogin
//   const navigation = useNavigation(); // ✅ Get navigation from hook
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsLoading(true);

//       // ✅ Pass navigation to googleLogin
//       const result = await googleLogin(navigation);

//       if (result.success) {
//         // ✅ Only navigate for first-time users to referral screen
//         if (result.isFirstTime) {
//           navigation.replace('ReferralEntry');
//         }
//         // ✅ For returning users, AuthContext handles navigation automatically
//         // isAuthenticated becomes true → AppNavigator switches to Main
//       } else if (result.cancelled) {
//         // User cancelled - do nothing
//         console.log('User cancelled Google Sign-In');
//       } else {
//         // Show error
//         Alert.alert(
//           'Login Failed',
//           result.error || 'Something went wrong. Please try again.',
//         );
//       }
//     } catch (error) {
//       console.error('Sign in failed:', error);
//       Alert.alert('Error', 'An unexpected error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openTerms = () => {
//     Linking.openURL(EXTERNAL_URLS.TERMS);
//   };

//   const openPrivacy = () => {
//     Linking.openURL(EXTERNAL_URLS.PRIVACY);
//   };

//   return (
//     <SafeAreaView
//       style={[styles.container, {backgroundColor: colors.background}]}
//       edges={['top', 'bottom']}>
//       <View style={styles.content}>
//         {/* Logo Section */}
//         <View style={styles.logoSection}>
//           {/* App Icon */}
//           <View style={[styles.logoCircle, {backgroundColor: colors.primary}]}>
//             <Text style={[styles.logoIcon, {color: colors.white}]}>
//               {t?.('common.appIcon') || '🚗'}
//             </Text>
//           </View>

//           {/* App Name */}
//           <Text
//             style={[
//               styles.appName,
//               {
//                 color: colors.textPrimary,
//                 marginTop: spacing.xl,
//               },
//             ]}>
//             {t?.('common.appName') || 'Welcome to QR Parking'}
//           </Text>

//           {/* Subtitle */}
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: colors.textSecondary,
//                 marginTop: spacing.sm,
//               },
//             ]}>
//             {t?.('auth.welcome.subtitle') ||
//               'Sign in to save your vehicles and be reachable when needed'}
//           </Text>
//         </View>

//         {/* Sign In Section */}
//         <View style={styles.signInSection}>
//           {/* Google Sign In Button */}
//           <TouchableOpacity
//             style={[
//               styles.googleButton,
//               {
//                 backgroundColor: colors.white,
//                 borderColor: colors.border,
//               },
//             ]}
//             onPress={handleGoogleSignIn}
//             activeOpacity={0.7}
//             disabled={isLoading}>
//             <View style={styles.googleContent}>
//               {/* Google Icon */}
//               <View style={styles.googleIconContainer}>
//                 <GoogleIcon width={20} height={20} />
//               </View>
//               <Text style={[styles.googleText, {color: colors.textPrimary}]}>
//                 {t?.('auth.welcome.googleButton') || 'Continue with Google'}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* Legal Text */}
//           <View style={[styles.legalContainer, {marginTop: spacing.md}]}>
//             <Text style={[styles.legalText, {color: colors.textSecondary}]}>
//               {t?.('auth.welcome.legalText') ||
//                 'By continuing, you agree to our'}{' '}
//               <Text
//                 style={[styles.legalLink, {color: colors.primary}]}
//                 onPress={openTerms}>
//                 {t?.('auth.welcome.terms') || 'Terms'}
//               </Text>
//               {'\n'}
//               {t?.('auth.welcome.and') || 'and'}{' '}
//               <Text
//                 style={[styles.legalLink, {color: colors.primary}]}
//                 onPress={openPrivacy}>
//                 {t?.('auth.welcome.privacy') || 'Privacy Policy'}
//               </Text>
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <FullScreenLoader message={t?.('auth.signingIn') || 'Signing in...'} />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'space-between',
//     paddingHorizontal: 24,
//     paddingTop: 80,
//     paddingBottom: 40,
//   },
//   logoSection: {
//     alignItems: 'center',
//   },
//   logoCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   logoIcon: {
//     fontSize: 40,
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: '700',
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 15,
//     textAlign: 'center',
//     lineHeight: 22,
//     paddingHorizontal: 16,
//   },
//   signInSection: {
//     width: '100%',
//   },
//   googleButton: {
//     width: '100%',
//     height: 52,
//     borderRadius: 8,
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   googleContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   googleIconContainer: {
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   googleText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   legalContainer: {
//     alignItems: 'center',
//   },
//   legalText: {
//     fontSize: 13,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   legalLink: {
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//   },
// });

// export default WelcomeScreen;

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
  Linking,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../hooks';
import {useTheme} from '../../contexts/ThemeContext';
import {EXTERNAL_URLS} from '../../config/constants';
import {GoogleIcon} from '../../assets/icons';

const WelcomeScreen = () => {
  const {t, theme} = useTheme();
  const {colors, spacing} = theme;
  const {googleLogin, isLoading: authLoading} = useAuth();
  const navigation = useNavigation();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setButtonLoading(true); // ✅ Button shows loader

      const result = await googleLogin(navigation);

      if (result.success) {
        if (result.isFirstTime) {
          navigation.replace('ReferralEntry');
        }
      } else if (result.cancelled) {
        console.log('User cancelled Google Sign-In');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setButtonLoading(false); // ✅ Button returns to normal
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
        {/* Logo Section - same as before */}
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, {backgroundColor: colors.primary}]}>
            <Text style={[styles.logoIcon, {color: colors.white}]}>
              {t?.('common.appIcon') || '🚗'}
            </Text>
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

          {/* Legal Text - same as before */}
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
