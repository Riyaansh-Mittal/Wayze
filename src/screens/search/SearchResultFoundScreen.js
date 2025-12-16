/**
 * Search Result Found Screen
 * Shows vehicle owner details when found
 * FULLY THEME-AWARE WITH SVG ICONS
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBalance} from '../../contexts/BalanceContext';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';
import {InfoIcon} from '../../assets/icons';

const SearchResultFoundScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {vehicle, searchQuery} = route.params;
  const {balance, canMakeContact} = useBalance();

  const hasEnoughCredits = canMakeContact();

  const getTimeAgo = dateString => {
    // Mock implementation - replace with actual logic
    return t('time.monthsAgo', {count: 5});
  };

  // Get vehicle type label
  const getVehicleTypeLabel = type => {
    switch (type) {
      case '2wheeler':
        return t('vehicles.types.2-wheeler');
      case '3wheeler':
        return t('vehicles.types.3-wheeler');
      case '4wheeler':
        return t('vehicles.types.4-wheeler');
      default:
        return type;
    }
  };

  // FREE ALERT OPTION - No credits needed
  const handleSendAlert = () => {
    navigation.navigate('SendAlertModal', {
      vehicle,
      searchQuery,
    });
  };

  // PAID OPTIONS - Require credits
  const handleCallOwner = () => {
    if (!hasEnoughCredits) {
      Alert.alert(
        t('profile.balance.lowBalance'),
        t('search.registrationGate.toast'),
        [
          {text: t('common.cancel'), style: 'cancel'},
          {
            text: t('common.continue'),
            onPress: () =>
              navigation.navigate('Profile', {screen: 'PurchaseCredits'}),
          },
        ],
      );
      return;
    }

    navigation.navigate('CallOwnerModal', {
      vehicle,
      searchQuery,
    });
  };

  const handleWhatsAppOwner = () => {
    if (!hasEnoughCredits) {
      Alert.alert(
        t('profile.balance.lowBalance'),
        t('search.registrationGate.toast'),
      );
      return;
    }

    navigation.navigate('WhatsAppOwnerModal', {
      vehicle,
      searchQuery,
    });
  };

  const handleEmailOwner = () => {
    if (!hasEnoughCredits) {
      Alert.alert(
        t('profile.balance.lowBalance'),
        t('search.registrationGate.toast'),
      );
      return;
    }

    navigation.navigate('EmailOwnerModal', {
      vehicle,
      searchQuery,
    });
  };

  const handleReportIssue = () => {
    navigation.navigate('ReportIssueModal', {
      vehicle,
      searchQuery,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('search.results.title')}
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
        {/* Vehicle Found Header */}
        <View style={[styles.header, {marginBottom: spacing.xl}]}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              },
            ]}>
            {t('search.results.found.vehicleTitle')}
          </Text>
        </View>

        {/* Vehicle Info Card with SVG Icon */}
        <Card style={{marginBottom: spacing.base}}>
          <View style={styles.vehicleRow}>
            {/* SVG Vehicle Icon */}
            <VehicleIcon
              type={vehicle.vehicleType}
              size={48}
              color={colors.primary}
              style={{marginRight: spacing.md}}
            />
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
              <Text style={[styles.vehicleMeta, {color: colors.textSecondary}]}>
                {getVehicleTypeLabel(vehicle.vehicleType)} ·{' '}
                {t('search.results.found.registered', {
                  time: getTimeAgo(vehicle.createdAt),
                })}
              </Text>
            </View>
          </View>
        </Card>

        {/* Owner Info Card */}
        <Card style={{marginBottom: spacing.lg}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.md,
              },
            ]}>
            {t('search.results.found.ownerTitle')}
          </Text>

          <View style={styles.ownerRow}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.primary,
                  marginRight: spacing.md,
                },
              ]}>
              <Text style={[styles.avatarText, {color: colors.white}]}>
                {vehicle.owner?.name?.charAt(0).toUpperCase() || 'R'}
              </Text>
            </View>
            <View style={styles.ownerInfo}>
              <View style={[styles.ownerNameRow, {marginBottom: spacing.xs}]}>
                <Text
                  style={[
                    styles.ownerName,
                    {
                      color: colors.textPrimary,
                      marginRight: spacing.xs,
                    },
                  ]}>
                  {vehicle.owner?.maskedName || 'R**** M****'}
                </Text>
                <Text style={[styles.verifiedBadge, {color: colors.success}]}>
                  ✓
                </Text>
              </View>
              <Text style={[styles.ownerMeta, {color: colors.textSecondary}]}>
                {t('search.results.found.memberSince', {
                  date: vehicle.owner?.memberSince || 'June 2024',
                })}
              </Text>
            </View>
          </View>
        </Card>

        {/* Contact Owner Section */}
        <View style={[styles.section, {marginBottom: spacing.base}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.md,
              },
            ]}>
            {t('search.results.found.contactTitle')}
          </Text>

          {/* FREE ALERT OPTION */}
          <Card
            style={[
              styles.freeCard,
              {
                backgroundColor: colors.successLight,
                borderColor: colors.success,
                borderWidth: 1,
                marginBottom: spacing.sm,
              },
            ]}>
            <View style={styles.optionRow}>
              <Text style={[styles.optionIcon, {marginRight: spacing.md}]}>
                🔔
              </Text>
              <View style={styles.optionInfo}>
                <Text
                  style={[
                    styles.optionTitle,
                    {
                      color: colors.textPrimary,
                      marginBottom: spacing.xs,
                    },
                  ]}>
                  {t('search.results.found.alertTitle') || 'Send Alert'}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    {color: colors.textSecondary},
                  ]}>
                  {t('search.results.found.alertDescription') ||
                    "Notify owner for free. They'll see your message."}
                </Text>
              </View>
              <View
                style={[
                  styles.freeBadge,
                  {
                    backgroundColor: colors.success,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                  },
                ]}>
                <Text style={[styles.freeText, {color: colors.white}]}>
                  {t('common.free') || 'FREE'}
                </Text>
              </View>
            </View>
          </Card>

          <PrimaryButton
            title={t('search.results.found.alertButton') || 'Send Alert'}
            onPress={handleSendAlert}
            fullWidth
            icon={<Text style={{color: colors.white, fontSize: 18}}>🔔</Text>}
            style={{marginBottom: spacing.lg}}
          />

          {/* Call Button */}
          <SecondaryButton
            title={t('search.results.found.callButton')}
            onPress={handleCallOwner}
            fullWidth
            icon={<Text style={{color: colors.primary, fontSize: 18}}>📞</Text>}
            style={{marginBottom: spacing.sm}}
          />
        </View>

        {/* Balance Info - Only show if credits are low */}
        {!hasEnoughCredits && (
          <Card
            style={[
              styles.balanceCard,
              {
                backgroundColor: colors.warningLight,
                borderColor: colors.warning,
                borderWidth: 1,
                marginBottom: spacing.md,
              },
            ]}>
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceIcon, {marginRight: spacing.md}]}>
                💰
              </Text>
              <View style={styles.balanceInfo}>
                <Text
                  style={[
                    styles.balanceLabel,
                    {
                      color: colors.textSecondary,
                      marginBottom: spacing.xs,
                    },
                  ]}>
                  {t('profile.balance.title')}
                </Text>
                <Text
                  style={[styles.balanceValue, {color: colors.textPrimary}]}>
                  {t('profile.balance.calls', {count: balance})}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Profile', {screen: 'PurchaseCredits'})
                }
                style={[
                  styles.buyButton,
                  {
                    backgroundColor: colors.primary,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: 6,
                  },
                ]}>
                <Text style={[styles.buyButtonText, {color: colors.white}]}>
                  {t('common.buy') || 'Buy'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Respect Message */}
        <Card
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.neutralLight,
              marginBottom: spacing.md,
            },
          ]}>
          <View style={styles.infoRow}>
            <View style={{marginRight: spacing.sm}}>
              <InfoIcon width={20} height={20} fill={colors.primary} />
            </View>
            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('search.results.found.respectMessage')}
            </Text>
          </View>
        </Card>

        {/* Report Link */}
        <TouchableOpacity
          onPress={handleReportIssue}
          style={[styles.reportButton, {paddingVertical: spacing.sm}]}>
          <Text style={[styles.reportLink, {color: colors.primary}]}>
            {t('search.results.found.reportLink')}
          </Text>
        </TouchableOpacity>
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
  header: {},
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
  vehicleMeta: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedBadge: {
    fontSize: 16,
  },
  ownerMeta: {
    fontSize: 14,
  },
  section: {},
  freeCard: {},
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 32,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 13,
  },
  freeBadge: {
    borderRadius: 4,
  },
  freeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  balanceCard: {},
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIcon: {
    fontSize: 32,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 13,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyButton: {},
  buyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reportButton: {
    alignItems: 'center',
  },
  reportLink: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default SearchResultFoundScreen;
