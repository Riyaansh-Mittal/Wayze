/**
 * Splash Screen
 * App initialization and auto-login check
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {TIME} from '../../config/constants';

const SplashScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors} = theme;

  useEffect(() => {
    // ✅ Simple timer - just show splash for branding
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, TIME.SPLASH_MIN_DURATION || 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, {backgroundColor: colors.primary}]}>
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <View style={[styles.logoCircle, {backgroundColor: colors.white}]}>
          <Text style={[styles.logoIcon, {color: colors.primary}]}>
            {t?.('common.appIcon') || '🚗'}
          </Text>
        </View>

        <Text style={[styles.appName, {color: colors.white}]}>
          {t?.('common.appName') || 'QR Parking'}
        </Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={[styles.loadingText, {color: colors.white}]}>
          {t?.('common.loading') || 'Loading...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 50,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    marginTop: 16,
    fontWeight: '500',
  },
});

export default SplashScreen;
