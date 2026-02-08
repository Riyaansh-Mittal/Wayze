import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {TIME} from '../../config/constants';

const SplashScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors} = theme;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, TIME.SPLASH_MIN_DURATION || 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, {backgroundColor: colors.primary}]}>
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        {/* ✅ Use actual logo image */}
        <View style={[styles.logoCircle, {backgroundColor: colors.primary}]}>
          <Image
            source={require('../../assets/images/app-icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
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
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 240,
    height: 240,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default SplashScreen;
