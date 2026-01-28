/**
 * Call Owner Modal
 * Paid action to reveal phone and call owner (costs 1 credit)
 * FULLY THEME-AWARE WITH CORRECT TRANSLATION KEYS
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Linking, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBalance} from '../../contexts/BalanceContext';
import {useTheme} from '../../contexts/ThemeContext';
import {ContactService} from '../../services/api';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';
import {InfoIcon} from '../../assets/icons';

const CallOwnerModal = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {vehicle, searchQuery} = route.params;
  const {deductBalance} = useBalance();

  const [isProcessing, setIsProcessing] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const ownerId = vehicle.owner?.userId;

  const handleRevealAndCall = async () => {
    setIsProcessing(true);

    try {
      // Deduct balance
      const deductResult = await deductBalance(1, 'Contact owner via call');
      if (!deductResult.success) {
        Alert.alert(t('common.error'), t('search.contact.failed'));
        setIsProcessing(false);
        return;
      }

      // ✅ UPDATED: Log contact and get phone number using userId
      const response = await ContactService.revealContact({
        userId: ownerId, // ✅ USE THIS INSTEAD OF vehicleId
        vehicleRegistration: searchQuery, // ✅ Send plate number
        contactType: 'call',
      });

      if (response.success && response.data.phoneNumber) {
        setPhoneNumber(response.data.phoneNumber);
        setContactRevealed(true);
      } else {
        Alert.alert(t('common.error'), t('search.contact.failed'));
      }
    } catch (error) {
      console.error('❌ Reveal contact failed:', error);
      Alert.alert(t('common.error'), t('search.contact.failed'));
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
        Alert.alert(t('common.error'), t('search.contact.failed'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('search.contact.failed'));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('search.contact.title')}
        showBack
        onBackPress={() => navigation.goBack()}
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
        {!contactRevealed ? (
          // Before revealing contact
          <>
            <View
              style={[
                styles.header,
                {
                  alignItems: 'center',
                  marginBottom: spacing.xl,
                },
              ]}>
              <Text style={[styles.icon, {marginBottom: spacing.md}]}>🔒</Text>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.sm,
                  },
                ]}>
                {t('search.contact.title')}
              </Text>
              <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
                {t('search.contact.message', {
                  name: vehicle.owner?.maskedName || 'owner',
                  plate: searchQuery,
                })}
              </Text>
            </View>

            {/* Vehicle Summary */}
            <Card style={{marginBottom: spacing.md}}>
              <View style={styles.vehicleRow}>
                <Text style={[styles.vehicleIcon, {marginRight: spacing.md}]}>
                  {vehicle.vehicleType === '2-wheeler' ? '🏍️' : '🚗'}
                </Text>
                <View style={styles.vehicleInfo}>
                  <Text
                    style={[
                      styles.plateNumber,
                      {
                        color: colors.textPrimary,
                        marginBottom: spacing.xs,
                      },
                    ]}>
                    {vehicle.plateNumber}
                  </Text>
                  <Text
                    style={[styles.ownerName, {color: colors.textSecondary}]}>
                    {vehicle.owner?.maskedName}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Cost Info */}
            <Card
              style={[
                styles.costCard,
                {
                  backgroundColor: colors.warningLight,
                  borderColor: colors.warning,
                  borderWidth: 1,
                  marginBottom: spacing.md,
                },
              ]}>
              <View style={styles.costRow}>
                <Text style={[styles.costIcon, {marginRight: spacing.md}]}>
                  💰
                </Text>
                <View style={styles.costInfo}>
                  <Text
                    style={[
                      styles.costLabel,
                      {
                        color: colors.textSecondary,
                        marginBottom: spacing.xs,
                      },
                    ]}>
                    {t('profile.balance.title')}
                  </Text>
                  <Text style={[styles.costValue, {color: colors.textPrimary}]}>
                    {t('profile.balance.calls', {count: 1})}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Info */}
            <Card
              style={[
                styles.agreementCard,
                {
                  backgroundColor: colors.primaryLight,
                  marginBottom: spacing.lg,
                },
              ]}>
              <View style={styles.agreementRow}>
                <Text
                  style={[
                    styles.agreementIcon,
                    {
                      color: colors.primary,
                      marginRight: spacing.md,
                    },
                  ]}>
                  <InfoIcon width={15} height={15} fill={colors.primary} />
                </Text>
                <Text
                  style={[
                    styles.agreementText,
                    {
                      color: colors.textSecondary,
                      flex: 1,
                    },
                  ]}>
                  {t('search.contact.logInfo')}
                </Text>
              </View>
            </Card>

            {/* Action Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title={t('search.contact.confirmCall')}
                onPress={handleRevealAndCall}
                loading={isProcessing}
                fullWidth
              />

              <SecondaryButton
                title={t('common.cancel')}
                onPress={() => navigation.goBack()}
                fullWidth
                style={{marginTop: spacing.md}}
              />
            </View>
          </>
        ) : (
          // After revealing contact
          <>
            <View
              style={[
                styles.header,
                {
                  alignItems: 'center',
                  marginBottom: spacing.xl,
                },
              ]}>
              <Text style={[styles.icon, {marginBottom: spacing.md}]}>✅</Text>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.sm,
                  },
                ]}>
                {t('search.contact.logged')}
              </Text>
              <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
                {t('search.results.found.callButton')}
              </Text>
            </View>

            {/* Contact Details */}
            <Card
              style={[
                styles.contactCard,
                {
                  backgroundColor: colors.successLight,
                  borderColor: colors.success,
                  borderWidth: 1,
                  marginBottom: spacing.md,
                },
              ]}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                    marginBottom: spacing.md,
                  },
                ]}>
                {t('vehicles.details.phoneNumber')}
              </Text>
              <View
                style={[
                  styles.phoneRow,
                  {
                    backgroundColor: colors.white,
                    padding: spacing.md,
                  },
                ]}>
                <Text style={[styles.phoneIcon, {marginRight: spacing.sm}]}>
                  📞
                </Text>
                <Text style={[styles.phoneNumber, {color: colors.primary}]}>
                  {phoneNumber}
                </Text>
              </View>
            </Card>

            {/* Action Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title={t('search.results.found.callButton')}
                onPress={handleCallNow}
                fullWidth
                icon={
                  <Text style={{color: colors.white, fontSize: 18}}>📞</Text>
                }
              />

              <SecondaryButton
                title={t('common.done')}
                onPress={() => navigation.navigate('FindVehicle')}
                fullWidth
                style={{marginTop: spacing.md}}
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Styles applied dynamically
  },
  header: {
    // Styles applied dynamically
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    fontSize: 40,
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  ownerName: {
    fontSize: 14,
  },
  costCard: {
    // Styles applied dynamically
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costIcon: {
    fontSize: 32,
  },
  costInfo: {
    flex: 1,
  },
  costLabel: {
    fontSize: 13,
  },
  costValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  agreementCard: {
    // Styles applied dynamically
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  agreementIcon: {
    fontSize: 24,
  },
  agreementText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    // Styles applied dynamically
  },
  contactCard: {
    // Styles applied dynamically
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  phoneIcon: {
    fontSize: 24,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default CallOwnerModal;
