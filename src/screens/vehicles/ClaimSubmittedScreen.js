/**
 * Claim Submitted Screen
 * REDESIGNED FOR BEAUTIFUL DARK MODE
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';

const ClaimSubmittedScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {claimId, plateNumber} = route.params;

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleViewVehicles = () => {
    navigation.navigate('MyVehicles');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              alignItems: 'center',
              marginTop: spacing.xxxl,
              marginBottom: spacing.lg,
            },
          ]}>
          <View
            style={[
              styles.successCircle,
              {
                backgroundColor: colors.success,
                width: 120,
                height: 120,
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text style={[styles.icon, {color: colors.white, fontSize: 60}]}>
              ✓
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              textAlign: 'center',
              marginBottom: spacing.sm,
            },
          ]}>
          {t('vehicles.ownership.submitted.heading')}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: spacing.xl,
            },
          ]}>
          {t('vehicles.ownership.submitted.message')}
        </Text>

        {/* Timeline */}
        <Card
          style={{marginBottom: spacing.lg, backgroundColor: colors.surface}}>
          <View style={[styles.timelineItem, {marginBottom: spacing.base}]}>
            <View
              style={[
                styles.timelineIcon,
                {
                  backgroundColor: colors.success,
                  marginRight: spacing.md,
                },
              ]}>
              <Text style={[styles.timelineIconText, {color: colors.white}]}>
                ✓
              </Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, {color: colors.textPrimary}]}>
                {t('vehicles.ownership.submitted.step1')}
              </Text>
              <Text style={[styles.timelineTime, {color: colors.success}]}>
                {t('vehicles.ownership.submitted.now')}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.timelineLine,
              {
                backgroundColor: colors.border,
                marginLeft: 20,
              },
            ]}
          />

          <View style={[styles.timelineItem, {marginBottom: spacing.base}]}>
            <View
              style={[
                styles.timelineIcon,
                {
                  backgroundColor: colors.warning,
                  marginRight: spacing.md,
                },
              ]}>
              <Text style={[styles.timelineIconText, {color: colors.white}]}>
                ⏳
              </Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, {color: colors.textPrimary}]}>
                {t('vehicles.ownership.submitted.step2')}
              </Text>
              <Text style={[styles.timelineTime, {color: colors.warning}]}>
                {t('vehicles.ownership.submitted.duration')}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.timelineLine,
              {
                backgroundColor: colors.border,
                marginLeft: 20,
              },
            ]}
          />

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineIcon,
                {
                  backgroundColor: colors.neutralLight,
                  borderWidth: 2,
                  borderColor: colors.border,
                  marginRight: spacing.md,
                },
              ]}>
              <Text
                style={[
                  styles.timelineIconText,
                  {color: colors.textSecondary},
                ]}>
                🔔
              </Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, {color: colors.textPrimary}]}>
                {t('vehicles.ownership.submitted.step3')}
              </Text>
              <Text
                style={[styles.timelineTime, {color: colors.textSecondary}]}>
                {t('common.comingSoon')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Info Card */}
        <Card
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary,
              borderWidth: 1,
              marginBottom: spacing.xl,
            },
          ]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoIcon, {marginRight: spacing.md}]}>✉️</Text>
            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textPrimary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.ownership.submitted.emailInfo')}
            </Text>
          </View>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={t('vehicles.ownership.submitted.homeButton')}
            onPress={handleGoHome}
            fullWidth
            style={{marginBottom: spacing.md}}
          />

          <SecondaryButton
            title={t('vehicles.ownership.submitted.vehiclesButton')}
            onPress={handleViewVehicles}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},
  scrollContent: {},
  iconContainer: {},
  successCircle: {},
  icon: {fontWeight: '700'},
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconText: {
    fontSize: 18,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  timelineLine: {
    width: 2,
    height: 20,
    marginVertical: 4,
  },
  infoCard: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {},
});

export default ClaimSubmittedScreen;
