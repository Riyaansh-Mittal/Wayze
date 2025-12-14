/**
 * Ownership Conflict Screen
 * Shown when user tries to register an already registered plate
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import { maskName } from '../../utils/formatters';

const OwnershipConflictScreen = ({ navigation, route }) => {
  const { plateNumber, existingVehicle } = route.params;

  const handleClaimOwnership = () => {
    navigation.navigate('UploadRC', { plateNumber });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Vehicle Already Registered"
        showBack
        onBackPress={handleGoBack}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Alert Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Vehicle Already Registered</Text>
        <Text style={styles.subtitle}>
          This plate number is already registered by another user
        </Text>

        {/* Plate Number Card */}
        <Card style={styles.plateCard}>
          <Text style={styles.plateLabel}>Plate Number</Text>
          <Text style={styles.plateNumber}>{plateNumber}</Text>
        </Card>

        {/* Current Owner Info */}
        <Card>
          <Text style={styles.sectionTitle}>Current Registration Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registered By:</Text>
            <Text style={styles.infoValue}>
              {maskName(existingVehicle?.owner?.name || 'Unknown')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Type:</Text>
            <Text style={styles.infoValue}>
              {existingVehicle?.vehicleType || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, { color: COLORS.success }]}>
              Verified
            </Text>
          </View>
        </Card>

        {/* Options */}
        <Card style={styles.optionsCard}>
          <Text style={styles.optionsTitle}>What would you like to do?</Text>

          <View style={styles.option}>
            <Text style={styles.optionIcon}>✓</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>I own this vehicle</Text>
              <Text style={styles.optionDescription}>
                Submit ownership claim with RC proof
              </Text>
            </View>
          </View>

          <View style={styles.option}>
            <Text style={styles.optionIcon}>✗</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>This is not my vehicle</Text>
              <Text style={styles.optionDescription}>
                Go back and check the plate number
              </Text>
            </View>
          </View>
        </Card>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            If you're the rightful owner, submit an ownership claim with your RC
            document. Our team will verify and update the registration.
          </Text>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Claim Ownership"
            onPress={handleClaimOwnership}
            fullWidth
            icon={<Text style={{ color: COLORS.white }}>→</Text>}
          />

          <SecondaryButton
            title="Go Back"
            onPress={handleGoBack}
            fullWidth
            style={{ marginTop: SPACING.md }}
          />
        </View>
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
    marginVertical: SPACING.lg,
  },
  icon: {
    fontSize: 80,
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
  plateCard: {
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
    marginBottom: SPACING.md,
  },
  plateLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  plateNumber: {
    ...TYPOGRAPHY.h1,
    color: COLORS.error,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.base,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorder,
  },
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyBold,
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.md,
  },
  optionsCard: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    marginTop: SPACING.md,
  },
  optionsTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.base,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.base,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    marginTop: SPACING.md,
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
  buttonContainer: {
    marginTop: SPACING.xl,
  },
});

export default OwnershipConflictScreen;
