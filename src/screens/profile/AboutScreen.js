/**
 * About Screen
 * App info, version, legal links, social
 * FULLY THEME-AWARE
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../hooks'; // ✅ ADD THIS
import {EXTERNAL_URLS} from '../../config/constants';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '42';

const AboutScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, typography, spacing, layout} = theme;
  const {legalDocs, getLegalDocuments} = useAuth(); // ✅ ADD THIS

  // ✅ NEW: Handle Terms tap
  const openTerms = () => {
    if (legalDocs?.termsAndConditions) {
      // Already loaded
      navigation.navigate('LegalDocument', {
        title: t('profile.about.terms') || 'Terms of Service',
        htmlContent: legalDocs.termsAndConditions,
      });
    } else {
      // Load on-demand
      console.log('📄 Loading Terms from About screen...');
      getLegalDocuments().then(docs => {
        if (docs?.termsAndConditions) {
          navigation.navigate('LegalDocument', {
            title: t('profile.about.terms') || 'Terms of Service',
            htmlContent: docs.termsAndConditions,
          });
        }
      });
    }
  };

  // ✅ NEW: Handle Privacy tap
  const openPrivacy = () => {
    if (legalDocs?.privacyPolicy) {
      // Already loaded
      navigation.navigate('LegalDocument', {
        title: t('profile.about.privacy') || 'Privacy Policy',
        htmlContent: legalDocs.privacyPolicy,
      });
    } else {
      // Load on-demand
      console.log('📄 Loading Privacy from About screen...');
      getLegalDocuments().then(docs => {
        if (docs?.privacyPolicy) {
          navigation.navigate('LegalDocument', {
            title: t('profile.about.privacy') || 'Privacy Policy',
            htmlContent: docs.privacyPolicy,
          });
        }
      });
    }
  };

  const openURL = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('profile.about.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: layout.screenPadding},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={[styles.appInfoSection, {marginBottom: spacing.xxxl}]}>
          <View style={[styles.logoCircle, {backgroundColor: colors.primary}]}>
            <Image
              source={require('../../assets/images/app-icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[typography.h1, {marginBottom: spacing.xs}]}>
            QR Parking
          </Text>
          <Text style={[typography.caption, {marginBottom: spacing.sm}]}>
            {t('profile.about.version', {
              version: APP_VERSION,
              build: BUILD_NUMBER,
            })}
          </Text>
          <Text style={[typography.caption, {fontStyle: 'italic'}]}>
            {t('profile.about.tagline')}
          </Text>
        </View>

        {/* Legal Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text style={[typography.h2, {marginBottom: spacing.sm}]}>
            {t('profile.about.legal')}
          </Text>
          <Card>
            <MenuItem
              icon="📜"
              label={t('profile.about.terms')}
              onPress={openTerms} // ✅ CHANGED
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="🔐"
              label={t('profile.about.privacy')}
              onPress={openPrivacy} // ✅ CHANGED
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="🏢"
              label={t('profile.about.licenses')}
              onPress={() => navigation.navigate('Licenses')}
              theme={theme}
            />
          </Card>
        </View>

        {/* Social Section */}
        <View style={{marginBottom: spacing.lg}}>
          <Text style={[typography.h2, {marginBottom: spacing.sm}]}>
            {t('profile.about.connect')}
          </Text>
          <Card>
            <MenuItem
              icon="🌐"
              label={t('profile.about.website')}
              onPress={() => openURL(EXTERNAL_URLS.WEBSITE)}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="📧"
              label={t('profile.about.email')}
              onPress={() => openURL(`mailto:${EXTERNAL_URLS.HELLO_EMAIL}`)}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="📱"
              label={t('profile.about.twitter')}
              onPress={() => openURL(EXTERNAL_URLS.TWITTER)}
              theme={theme}
            />
          </Card>
        </View>

        {/* Footer */}
        <View style={[styles.footer, {marginTop: spacing.xl}]}>
          <Text style={[typography.caption, {marginBottom: spacing.sm}]}>
            {t('profile.about.footer')}
          </Text>
          <Text style={[typography.small, {fontSize: 12}]}>
            {t('profile.about.copyright', {year: new Date().getFullYear()})}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Menu Item Component (unchanged)
const MenuItem = ({icon, label, onPress, theme}) => {
  const {colors, typography, spacing} = theme;
  return (
    <TouchableOpacity
      style={[styles.menuItem, {padding: spacing.base}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[typography.body, {flex: 1, marginLeft: spacing.base}]}>
        {label}
      </Text>
      <Text style={[styles.menuChevron, {color: colors.textSecondary}]}>›</Text>
    </TouchableOpacity>
  );
};

// Divider Component (unchanged)
const Divider = ({color}) => (
  <View style={[styles.divider, {backgroundColor: color}]} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  appInfoSection: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 105,
    height: 105,
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
  appIconText: {
    fontSize: 60,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
  },
  menuChevron: {
    fontSize: 24,
  },
  divider: {
    height: 1,
  },
  footer: {
    alignItems: 'center',
  },
});

export default AboutScreen;
