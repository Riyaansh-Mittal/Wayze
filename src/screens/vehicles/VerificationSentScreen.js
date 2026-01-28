/**
 * Verification Sent Screen
 * Shown after user sends RC photo via email
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import {EmailIcon, CarIcon, ReviewIcon, ClockIcon} from '../../assets/icons';

const VerificationSentScreen = ({navigation, route}) => {
  const {plateNumber} = route.params || {};
  const {t, theme} = useTheme();
  const {colors, spacing, typography} = theme;

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleViewVehicles = () => {
    navigation.navigate('MyVehicles');
  };

  const handleNeedHelp = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.white}]}>
      <AppBar
        title="" // Empty title for clean header with just close button
        showClose
        onBackPress={handleGoHome}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom: spacing.xxxl,
          alignItems: 'center',
        }}>
        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, {backgroundColor: '#D6E9FF'}]}>
            <EmailIcon width={70} height={70} fill={colors.primary} />
          </View>
        </View>

        {/* Main Heading */}
        <Text
          style={[
            typography.h1,
            {
              textAlign: 'center',
              marginBottom: spacing.xs,
              fontWeight: '700',
              fontSize: 22,
              color: colors.textPrimary,
            },
          ]}>
          {t('vehicles.emailSent') || 'Email sent!'}
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            typography.body,
            {
              textAlign: 'center',
              color: colors.textSecondary,
              marginBottom: spacing.xxl,
              fontSize: 14,
            },
          ]}>
          {t('vehicles.reviewRequest') || "We'll take it from here"}
        </Text>

        {/* White Card Container with all timeline items */}
        <View
          style={[
            styles.whiteCard,
            {
              backgroundColor: colors.white,
              borderColor: colors.neutralBorder || '#E0E0E0',
            },
          ]}>
          {/* Step 1: Review RC */}
          <View style={styles.timelineItem}>
            <View
              style={[styles.iconCircleSmall, {backgroundColor: '#F5F5F5'}]}>
              <ReviewIcon width={35} height={35} fill={colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[
                  typography.bodyBold,
                  {fontSize: 15, marginBottom: 4, color: colors.textPrimary},
                ]}>
                {t('vehicles.reviewTitle') || 'Our team reviews your RC'}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {color: colors.textSecondary, fontSize: 13, lineHeight: 18},
                ]}>
                {t('vehicles.reviewSubtitle') || 'Usually within 24 hours'}
              </Text>
            </View>
          </View>

          {/* Step 2: Contact */}
          <View style={styles.timelineItem}>
            <View
              style={[styles.iconCircleSmall, {backgroundColor: '#E8F5E9'}]}>
              <Icon name="check" size={35} color="#4CAF50" />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[
                  typography.bodyBold,
                  {fontSize: 15, marginBottom: 4, color: colors.textPrimary},
                ]}>
                {t('vehicles.contactTitle') || 'We contact you if needed'}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {color: colors.textSecondary, fontSize: 13, lineHeight: 18},
                ]}>
                {t('vehicles.contactSubtitle') || 'No action required from you'}
              </Text>
            </View>
          </View>

          {/* Step 3: Vehicle Added */}
          <View style={[styles.timelineItem, {marginBottom: 0}]}>
            <View
              style={[styles.iconCircleSmall, {backgroundColor: '#FFF3E0'}]}>
              <CarIcon width={35} height={35} fill={colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[
                  typography.bodyBold,
                  {fontSize: 15, marginBottom: 4, color: colors.textPrimary},
                ]}>
                {t('vehicles.addedTitle') || 'Vehicle added to account'}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {color: colors.textSecondary, fontSize: 13, lineHeight: 18},
                ]}>
                {t('vehicles.addedSubtitle') || "You'll get a notification"}
              </Text>
            </View>
          </View>
        </View>

        {/* Relax Card - Yellow/Cream Background */}
        <View style={[styles.relaxCard, {backgroundColor: '#FFF9E6'}]}>
          <View
            style={[styles.iconCircleSmall, {backgroundColor: colors.white}]}>
            <ClockIcon width={35} height={35} fill={colors.white} />
          </View>
          <View style={{flex: 1}}>
            <Text
              style={[
                typography.bodyBold,
                {marginBottom: 4, fontSize: 15, color: colors.textPrimary},
              ]}>
              {t('vehicles.relaxTitle') || "Relax! We've got your request"}
            </Text>
            <Text
              style={[
                typography.caption,
                {color: colors.textSecondary, fontSize: 13, lineHeight: 18},
              ]}>
              {t('vehicles.relaxSubtitle') || 'Check notifications for updates'}
            </Text>
          </View>
        </View>

        {/* Need Help Link */}
        <TouchableOpacity
          style={styles.helpLink}
          activeOpacity={0.7}
          onPress={handleNeedHelp}>
          <Text
            style={[
              typography.bodyBold,
              {color: colors.primary, fontSize: 14},
            ]}>
            {t('vehicles.needHelpVerification') ||
              'Need help with verification?'}
          </Text>
          <Icon name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={{width: '100%', marginTop: spacing.md}}>
          <PrimaryButton
            title={t('vehicles.goHome') || 'Go to Home'}
            fullWidth
            onPress={handleGoHome}
            style={{marginBottom: spacing.sm}}
          />

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleViewVehicles}>
            <Text
              style={[
                typography.bodyBold,
                {color: colors.primary, fontSize: 15},
              ]}>
              {t('vehicles.viewVehicles') || 'View My Vehicles'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailEnvelope: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // ✅ White card container for timeline
  whiteCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  // ✅ Circular backgrounds for icons
  iconCircleSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  // ✅ Yellow/cream relax card
  relaxCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
});

export default VerificationSentScreen;
