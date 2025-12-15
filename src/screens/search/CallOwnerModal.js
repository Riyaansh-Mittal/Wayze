/**
 * Call Owner Modal
 * Paid action to reveal phone and call owner (costs 1 credit)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '../../contexts/BalanceContext';
import { ContactService } from '../../services/api';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';

const CallOwnerModal = ({ navigation, route }) => {
  const { vehicle, searchQuery } = route.params;
  const { deductBalance } = useBalance();

  const [isProcessing, setIsProcessing] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const handleRevealAndCall = async () => {
    setIsProcessing(true);

    try {
      // Deduct balance
      const deductResult = await deductBalance(1);
      if (!deductResult.success) {
        Alert.alert('Error', 'Failed to deduct credit. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Log contact and get phone number
      const response = await ContactService.revealContact({
        vehicleId: vehicle._id,
        searchQuery,
        contactType: 'call',
      });

      if (response.success && response.data.phoneNumber) {
        setPhoneNumber(response.data.phoneNumber);
        setContactRevealed(true);
      } else {
        Alert.alert('Error', 'Failed to reveal contact details.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCallNow = async () => {
    try {
      const url = `tel:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
        navigation.navigate('FindVehicle');
      } else {
        Alert.alert('Error', 'Cannot open phone app. Please check your device settings.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open phone app.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Call Owner"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!contactRevealed ? (
          // Before revealing contact
          <>
            <View style={styles.header}>
              <Text style={styles.icon}>🔒</Text>
              <Text style={styles.title}>Confirm Call Request</Text>
              <Text style={styles.subtitle}>
                You're about to call the owner of {searchQuery}
              </Text>
            </View>

            {/* Vehicle Summary */}
            <Card>
              <View style={styles.vehicleRow}>
                <Text style={styles.vehicleIcon}>
                  {vehicle.vehicleType === '2-wheeler' ? '🏍️' : '🚗'}
                </Text>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
                  <Text style={styles.ownerName}>{vehicle.owner?.name}</Text>
                </View>
              </View>
            </Card>

            {/* Cost Info */}
            <Card style={styles.costCard}>
              <View style={styles.costRow}>
                <Text style={styles.costIcon}>💰</Text>
                <View style={styles.costInfo}>
                  <Text style={styles.costLabel}>Contact Cost</Text>
                  <Text style={styles.costValue}>1 Credit</Text>
                </View>
              </View>
            </Card>

            {/* Agreement */}
            <Card style={styles.agreementCard}>
              <View style={styles.agreementRow}>
                <Text style={styles.agreementIcon}>✓</Text>
                <Text style={styles.agreementText}>
                  By proceeding, you agree that:{'\n'}
                  • Phone number will be revealed{'\n'}
                  • Your details will be shared with owner{'\n'}
                  • This contact will be logged{'\n'}
                  • 1 credit will be deducted
                </Text>
              </View>
            </Card>

            {/* Action Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title={isProcessing ? 'Processing...' : 'Reveal & Call'}
                onPress={handleRevealAndCall}
                loading={isProcessing}
                fullWidth
              />

              <SecondaryButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                fullWidth
                style={{ marginTop: SPACING.md }}
              />
            </View>
          </>
        ) : (
          // After revealing contact
          <>
            <View style={styles.header}>
              <Text style={styles.icon}>✅</Text>
              <Text style={styles.title}>Contact Revealed</Text>
              <Text style={styles.subtitle}>
                You can now call the owner
              </Text>
            </View>

            {/* Contact Details */}
            <Card style={styles.contactCard}>
              <Text style={styles.sectionTitle}>Owner's Phone Number</Text>
              <View style={styles.phoneRow}>
                <Text style={styles.phoneIcon}>📞</Text>
                <Text style={styles.phoneNumber}>{phoneNumber}</Text>
              </View>
            </Card>

            {/* Info */}
            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  Tap "Call Now" to open your phone app and call the owner directly.
                </Text>
              </View>
            </Card>

            {/* Action Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Call Now"
                onPress={handleCallNow}
                fullWidth
                icon={<Text style={{ color: COLORS.white, fontSize: 20 }}>📞</Text>}
              />

              <SecondaryButton
                title="Done"
                onPress={() => navigation.navigate('FindVehicle')}
                fullWidth
                style={{ marginTop: SPACING.md }}
              />
            </View>
          </>
        )}
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
  icon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  ownerName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  costCard: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    marginVertical: SPACING.md,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  costInfo: {
    flex: 1,
  },
  costLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  costValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  agreementCard: {
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.lg,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  agreementIcon: {
    fontSize: 24,
    color: COLORS.primary,
    marginRight: SPACING.md,
    fontWeight: '700',
  },
  agreementText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: SPACING.base,
  },
  contactCard: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.md,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
  },
  phoneIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  phoneNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  infoCard: {
    backgroundColor: COLORS.neutralBg,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
});

export default CallOwnerModal;
