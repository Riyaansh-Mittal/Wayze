/**
 * Search Result Found Screen
 * Shows vehicle owner details when found
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '../../contexts/BalanceContext';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';

const SearchResultFoundScreen = ({ navigation, route }) => {
  const { vehicle, searchQuery } = route.params;
  const { balance, canMakeContact } = useBalance();

  const hasEnoughCredits = canMakeContact();

  const handleSendAlert = () => {
    // Free action - no balance check needed
    navigation.navigate('SendAlertModal', {
      vehicle,
      searchQuery,
    });
  };

  const handleCallOwner = () => {
    if (!hasEnoughCredits) {
      Alert.alert(
        'Insufficient Balance',
        'You need at least 1 contact credit to call the owner. Purchase more from your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy Credits',
            onPress: () => navigation.navigate('Profile', { screen: 'PurchaseCredits' }),
          },
        ]
      );
      return;
    }

    // Has enough credits - proceed to call
    navigation.navigate('CallOwnerModal', {
      vehicle,
      searchQuery,
    });
  };

  const handleSearchAgain = () => {
    navigation.goBack();
  };

  const handleReportIssue = () => {
    navigation.navigate('ReportIssueModal', {
      vehicle,
      searchQuery,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Search Result"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.header}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.title}>Vehicle Found!</Text>
          <Text style={styles.subtitle}>
            We found the owner of {searchQuery}
          </Text>
        </View>

        {/* Vehicle Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <Card>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleIcon}>
                {vehicle.vehicleType === '2-wheeler' ? '🏍️' : '🚗'}
              </Text>
              <View style={styles.vehicleInfo}>
                <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
                <Text style={styles.vehicleMeta}>
                  {vehicle.vehicleType} · Registered {vehicle.registeredAgo || '5 months ago'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Owner Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Information</Text>
          <Card>
            <View style={styles.ownerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {vehicle.owner?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.ownerInfo}>
                <View style={styles.ownerNameRow}>
                  <Text style={styles.ownerName}>{vehicle.owner?.name || 'R**** M****'}</Text>
                  {vehicle.owner?.verified && (
                    <Text style={styles.verifiedBadge}>✓</Text>
                  )}
                </View>
                <Text style={styles.ownerMeta}>
                  Member since {vehicle.owner?.memberSince || 'June 2024'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Owner</Text>

          {/* Free Alert Option */}
          <Card style={styles.freeCard}>
            <View style={styles.optionRow}>
              <Text style={styles.optionIcon}>🔔</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Send Alert</Text>
                <Text style={styles.optionDescription}>
                  Notify owner for free. They'll see your message.
                </Text>
              </View>
              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>FREE</Text>
              </View>
            </View>
          </Card>

          <PrimaryButton
            title="Send Alert"
            onPress={handleSendAlert}
            fullWidth
            icon={<Text style={{ color: COLORS.white, fontSize: 20 }}>🔔</Text>}
            style={{ marginTop: SPACING.sm }}
          />

          {/* Paid Call Option */}
          <Card style={[styles.paidCard, !hasEnoughCredits && styles.disabledCard]}>
            <View style={styles.optionRow}>
              <Text style={styles.optionIcon}>📞</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Call Owner</Text>
                <Text style={styles.optionDescription}>
                  Reveal phone number and call directly.
                </Text>
              </View>
              <View style={styles.costBadge}>
                <Text style={styles.costText}>1 Credit</Text>
              </View>
            </View>
          </Card>

          {!hasEnoughCredits ? (
            <SecondaryButton
              title="Buy Credits to Call"
              onPress={() => navigation.navigate('Profile', { screen: 'PurchaseCredits' })}
              fullWidth
              icon={<Text style={{ color: COLORS.primary, fontSize: 20 }}>💳</Text>}
              style={{ marginTop: SPACING.sm }}
            />
          ) : (
            <SecondaryButton
              title="Call Owner"
              onPress={handleCallOwner}
              fullWidth
              icon={<Text style={{ color: COLORS.primary, fontSize: 20 }}>📞</Text>}
              style={{ marginTop: SPACING.sm }}
            />
          )}
        </View>

        {/* Balance Info */}
        <Card style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceIcon}>💰</Text>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Your Contact Credits</Text>
              <Text style={styles.balanceValue}>{balance} credits remaining</Text>
            </View>
          </View>
        </Card>

        {/* Privacy Notice */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Please be respectful. Abuse will be reported.
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <SecondaryButton
            title="Search Again"
            onPress={handleSearchAgain}
            fullWidth
          />
          <Text style={styles.reportLink} onPress={handleReportIssue}>
            Report an issue
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  vehicleMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ownerName: {
    ...TYPOGRAPHY.bodyBold,
    marginRight: SPACING.xs,
  },
  verifiedBadge: {
    fontSize: 16,
    color: COLORS.success,
  },
  ownerMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  freeCard: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    marginBottom: SPACING.sm,
  },
  paidCard: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  disabledCard: {
    backgroundColor: COLORS.neutralBg,
    borderColor: COLORS.neutralBorder,
    opacity: 0.6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  optionInfo: {
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
  freeBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  freeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: '700',
  },
  costBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  costText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: '700',
  },
  balanceCard: {
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.md,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  balanceValue: {
    ...TYPOGRAPHY.bodyBold,
  },
  infoCard: {
    backgroundColor: COLORS.neutralBg,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actions: {
    alignItems: 'center',
  },
  reportLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    marginTop: SPACING.md,
    textDecorationLine: 'underline',
  },
});

export default SearchResultFoundScreen;
