/**
 * Claim Submitted Screen
 * Success screen after ownership claim submission
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';

const ClaimSubmittedScreen = ({ navigation, route }) => {
  const { claimId, plateNumber } = route.params;

  const handleDone = () => {
    // Navigate back to vehicle list or home
    navigation.navigate('MyVehicles');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✅</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Claim Submitted!</Text>
        <Text style={styles.subtitle}>
          Your ownership claim has been submitted successfully
        </Text>

        {/* Claim Details Card */}
        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Claim ID:</Text>
            <Text style={styles.detailValue}>{claimId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plate Number:</Text>
            <Text style={styles.detailValue}>{plateNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, { color: COLORS.warning }]}>
              Under Review
            </Text>
          </View>
        </Card>

        {/* What's Next */}
        <Card style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>What happens next?</Text>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Verification</Text>
              <Text style={styles.stepDescription}>
                Our team will verify your RC document
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Confirmation</Text>
              <Text style={styles.stepDescription}>
                You'll receive a notification about the status
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Vehicle Transfer</Text>
              <Text style={styles.stepDescription}>
                If approved, vehicle will be transferred to your account
              </Text>
            </View>
          </View>
        </Card>

        {/* Timeline Card */}
        <Card style={styles.timelineCard}>
          <Text style={styles.timelineIcon}>⏱️</Text>
          <View style={styles.timelineText}>
            <Text style={styles.timelineTitle}>Expected Review Time</Text>
            <Text style={styles.timelineDescription}>24-48 hours</Text>
          </View>
        </Card>

        {/* Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can check your claim status in the Profile section under "My Claims"
          </Text>
        </Card>

        {/* Button */}
        <PrimaryButton
          title="Done"
          onPress={handleDone}
          fullWidth
          style={{ marginTop: SPACING.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
    paddingBottom: SPACING.xxxl,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 100,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  detailsCard: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorder,
  },
  detailLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...TYPOGRAPHY.bodyBold,
  },
  stepsCard: {
    marginBottom: SPACING.md,
  },
  stepsTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.base,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.base,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  stepDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  timelineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  timelineIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  timelineText: {
    flex: 1,
  },
  timelineTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  timelineDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

export default ClaimSubmittedScreen;
