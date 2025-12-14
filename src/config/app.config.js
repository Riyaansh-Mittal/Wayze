/**
 * Application Configuration
 * App metadata and version information
 */

import { Platform } from 'react-native';

export const APP_CONFIG = {
  // App Identity
  name: 'QR Parking',
  displayName: 'QR Parking',
  tagline: 'Find vehicle owners instantly',
  description: 'Manage your vehicles and be reachable when needed',

  // Version
  version: '1.0.0',
  buildNumber: 1,
  versionString: '1.0.0 (Build 1)',

  // Bundle Identifiers
  bundleId: {
    ios: 'com.qrparking.app',
    android: 'com.qrparking.app',
  },

  // App Store IDs
  appStoreId: {
    ios: 'YOUR_IOS_APP_STORE_ID', // Replace with actual ID
    android: 'com.qrparking.app',
  },

  // Company Info
  company: {
    name: 'QR Parking',
    country: 'India',
    flag: '🇮🇳',
    copyright: `© ${new Date().getFullYear()} QR Parking. All rights reserved.`,
    tagline: 'Made with ❤️ in India 🇮🇳',
  },

  // Contact
  contact: {
    email: 'hello@qrparking.com',
    support: 'support@qrparking.com',
    website: 'https://qrparking.com',
  },

  // Social Media
  social: {
    twitter: '@qrparking',
    twitterUrl: 'https://twitter.com/qrparking',
  },

  // Legal
  legal: {
    terms: 'https://qrparking.com/terms',
    privacy: 'https://qrparking.com/privacy',
  },

  // Platform Info
  platform: Platform.OS,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',

  // Environment
  environment: __DEV__ ? 'development' : 'production',
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
};

export default APP_CONFIG;
