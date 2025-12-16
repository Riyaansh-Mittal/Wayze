/**
 * Ownership Conflict Screen
 * REDESIGNED FOR BEAUTIFUL DARK MODE
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import {WarningIcon} from '../../assets/icons';

const OwnershipConflictScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {plateNumber, existingVehicle, newVehicleData} = route.params;

  const handleClaimOwnership = () => {
    navigation.navigate('UploadRC', {
      plateNumber,
      newVehicleData,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('vehicles.ownership.conflict.title')}
        showBack
        onBackPress={handleGoBack}
      />

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
        {/* Alert Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              alignItems: 'center',
              marginTop: spacing.lg,
              marginBottom: spacing.xl,
            },
          ]}>
          <View style={styles.iconCircle}>
            <WarningIcon width={64} height={64} fill={colors.warning} />
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
          {t('vehicles.ownership.conflict.heading')}
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
          {t('vehicles.ownership.conflict.message')}
        </Text>

        {/* Plate Number Card */}
        <Card
          style={[
            styles.plateCard,
            {
              alignItems: 'center',
              marginBottom: spacing.lg,
              backgroundColor: colors.warningLight,
              borderColor: colors.warning,
              borderWidth: 1,
            },
          ]}>
          <Text
            style={[
              styles.plateLabel,
              {
                color: colors.textSecondary,
                marginBottom: spacing.xs,
              },
            ]}>
            {t('vehicles.ownership.conflict.plate', {plate: ''}).replace(
              plateNumber,
              '',
            )}
          </Text>
          <Text
            style={[
              styles.plateNumber,
              {
                color: colors.warning,
                fontWeight: '700',
              },
            ]}>
            {plateNumber}
          </Text>
        </Card>

        {/* What Happens Next */}
        <Card
          style={{marginBottom: spacing.lg, backgroundColor: colors.surface}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.base,
              },
            ]}>
            {t('vehicles.ownership.conflict.whatNext')}
          </Text>

          <View style={[styles.step, {marginBottom: spacing.md}]}>
            <View
              style={[
                styles.stepNumber,
                {
                  backgroundColor: colors.primary,
                  marginRight: spacing.md,
                },
              ]}>
              <Text style={[styles.stepNumberText, {color: colors.white}]}>
                1
              </Text>
            </View>
            <Text
              style={[
                styles.stepText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.ownership.conflict.step1')}
            </Text>
          </View>

          <View style={[styles.step, {marginBottom: spacing.md}]}>
            <View
              style={[
                styles.stepNumber,
                {
                  backgroundColor: colors.primary,
                  marginRight: spacing.md,
                },
              ]}>
              <Text style={[styles.stepNumberText, {color: colors.white}]}>
                2
              </Text>
            </View>
            <Text
              style={[
                styles.stepText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.ownership.conflict.step2')}
            </Text>
          </View>

          <View style={[styles.step, {marginBottom: spacing.md}]}>
            <View
              style={[
                styles.stepNumber,
                {
                  backgroundColor: colors.primary,
                  marginRight: spacing.md,
                },
              ]}>
              <Text style={[styles.stepNumberText, {color: colors.white}]}>
                3
              </Text>
            </View>
            <Text
              style={[
                styles.stepText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.ownership.conflict.step3')}
            </Text>
          </View>

          <View style={styles.step}>
            <View
              style={[
                styles.stepNumber,
                {
                  backgroundColor: colors.primary,
                  marginRight: spacing.md,
                },
              ]}>
              <Text style={[styles.stepNumberText, {color: colors.white}]}>
                4
              </Text>
            </View>
            <Text
              style={[
                styles.stepText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.ownership.conflict.step4')}
            </Text>
          </View>
        </Card>

        {/* Privacy Notice */}
        <Card
          style={[
            styles.privacyCard,
            {
              backgroundColor: colors.successLight,
              borderColor: colors.success,
              borderWidth: 1,
              marginBottom: spacing.xl,
            },
          ]}>
          <View style={styles.privacyRow}>
            <Text style={[styles.privacyIcon, {marginRight: spacing.sm}]}>
              🔒
            </Text>
            <Text
              style={[
                styles.privacyText,
                {
                  color: colors.textPrimary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.ownership.conflict.security')}
            </Text>
          </View>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={t('vehicles.ownership.conflict.uploadButton')}
            onPress={handleClaimOwnership}
            fullWidth
          />

          <SecondaryButton
            title={t('common.cancel')}
            onPress={handleGoBack}
            fullWidth
            style={{marginTop: spacing.md}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  iconContainer: {},
  iconCircle: {},
  icon: {},
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  plateCard: {
    paddingVertical: 20,
  },
  plateLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  plateNumber: {
    fontSize: 28,
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 4,
  },
  privacyCard: {},
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyIcon: {
    fontSize: 24,
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {},
});

export default OwnershipConflictScreen;
