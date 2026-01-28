import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';
import {useBalance} from '../../contexts/BalanceContext';
import {useCall} from '../../contexts/CallContext';
import AppBar from '../../components/navigation/AppBar';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import ZegoCallButton from '../../components/common/Button/ZegoCallButton';
import Card from '../../components/common/Card/Card';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';
import {InfoIcon, BellIcon, CreditsIcon} from '../../assets/icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchResultFoundScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {user} = useAuth();
  const {vehicle, searchQuery} = route.params;

  const {balance, canMakeContact} = useBalance();
  const {initiateCall} = useCall();

  const hasEnoughCredits = canMakeContact();
  const [callId, setCallId] = useState(null);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);

  // Extract vehicle data
  const ownerName = vehicle.owner?.name || 'Vehicle Owner';
  const ownerPhoto = vehicle.owner?.photo;
  const ownerId = vehicle.owner?.userId || vehicle.owner?.id;
  const plateNumber = vehicle.plateNumber || searchQuery;

  useEffect(() => {
    console.log('✅ Vehicle found - Owner:', ownerName, '(ID:', ownerId, ')');
  }, [ownerId, ownerName]);

  const getInitial = name => {
    return name?.charAt(0).toUpperCase() || 'V';
  };

  const handleSendAlert = () => {
    navigation.navigate('SendAlertModal', {
      vehicle,
      searchQuery,
    });
  };

  /**
   * ✅ Handle call initiation - called BEFORE Zego button is pressed
   */
  const handleInitiateCall = async () => {
    if (!ownerId) {
      Alert.alert('Error', 'Owner information is missing.');
      return false;
    }

    if (callId) {
      // Already have callId, allow call
      console.log('✅ Using existing callId:', callId);
      return true;
    }

    try {
      setIsInitiatingCall(true);
      console.log('📞 Initiating call with backend...');

      const callResult = await initiateCall(ownerId);

      if (!callResult.success) {
        Alert.alert('Error', 'Failed to initiate call');
        return false;
      }

      console.log('✅ Call initiated - callId:', callResult.data?.callId);
      setCallId(callResult.data?.callId);
      return true;
    } catch (error) {
      console.error('❌ Failed to initiate call:', error);
      Alert.alert('Error', 'Failed to prepare call');
      return false;
    } finally {
      setIsInitiatingCall(false);
    }
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
        title={t('search.results.title') || 'Search Result'}
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
        {/* Success Header */}
        <View
          style={[
            styles.header,
            {marginBottom: spacing.xl, alignItems: 'center'},
          ]}>
          <View
            style={[
              styles.successIcon,
              {
                backgroundColor: colors.successLight,
                width: 64,
                height: 64,
                borderRadius: 32,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.md,
              },
            ]}>
            <Icon name="check" size={48} color={colors.success} />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                marginBottom: spacing.xs,
                textAlign: 'center',
              },
            ]}>
            {t('search.results.found.vehicleTitle') || 'Vehicle Found!'}
          </Text>
        </View>

        {/* Vehicle Info Card */}
        <Card style={{marginBottom: spacing.base}}>
          <View style={styles.vehicleRow}>
            <VehicleIcon
              type="4-wheeler"
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
                {plateNumber}
              </Text>
              <Text style={[styles.vehicleMeta, {color: colors.textSecondary}]}>
                {t('search.results.found.registered') || 'Registered Vehicle'}
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
            {t('search.results.found.ownerTitle') || 'Owner Information'}
          </Text>

          <View style={styles.ownerRow}>
            {ownerPhoto ? (
              <Image
                source={{uri: ownerPhoto}}
                style={[
                  styles.avatar,
                  {
                    marginRight: spacing.md,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.primary,
                    marginRight: spacing.md,
                  },
                ]}>
                <Text style={[styles.avatarText, {color: colors.white}]}>
                  {getInitial(ownerName)}
                </Text>
              </View>
            )}

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
                  {ownerName}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Contact Section */}
        <View style={[styles.section, {marginBottom: spacing.base}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.md,
              },
            ]}>
            {t('search.results.found.contactTitle') || 'Contact Owner'}
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
                <BellIcon width={32} height={32} fill={colors.warning} />
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
                    "Notify owner instantly. They'll see your message."}
                </Text>
              </View>
              <View
                style={[
                  styles.freeBadge,
                  {
                    backgroundColor: colors.success,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: 4,
                  },
                ]}>
                <Text style={[styles.freeText, {color: colors.white}]}>
                  {t('common.free') || 'FREE'}
                </Text>
              </View>
            </View>
          </Card>

          <PrimaryButton
            title={
              t('search.results.found.alertButton') || 'Send Alert to Owner'
            }
            onPress={handleSendAlert}
            fullWidth
            icon={
              <Text style={{color: colors.white, fontSize: 18}}>
                <BellIcon width={24} height={24} fill={colors.white} />
              </Text>
            }
            style={{marginBottom: spacing.md}}
          />

          {/* PAID CALL OPTION */}
          <Card
            style={[
              styles.paidCard,
              {
                backgroundColor: colors.warningLight,
                borderColor: colors.warning,
                borderWidth: 1,
                marginBottom: spacing.sm,
              },
              !hasEnoughCredits && {
                backgroundColor: colors.neutralLight,
                borderColor: colors.neutralBorder,
                opacity: 0.6,
              },
            ]}>
            <View style={styles.optionRow}>
              <Text style={[styles.optionIcon, {marginRight: spacing.md}]}>
                📞
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
                  {t('search.results.found.callTitle') || 'Call Owner'}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    {color: colors.textSecondary},
                  ]}>
                  {t('search.results.found.callDescription') ||
                    'Instantly call owner and deduct 1 credit.'}
                </Text>
              </View>
              <View
                style={[
                  styles.costBadge,
                  {
                    backgroundColor: colors.warning,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: 4,
                  },
                ]}>
                <Text style={[styles.costText, {color: colors.white}]}>
                  1 Credit
                </Text>
              </View>
            </View>
          </Card>

          {/* ✅ SIMPLIFIED: Call button logic - NO BALANCE DEDUCTION */}
          {!hasEnoughCredits ? (
            // No credits - show buy button
            <SecondaryButton
              title={
                t('search.results.found.buyCredits') || 'Buy Credits to Call'
              }
              onPress={() =>
                navigation.navigate('Profile', {screen: 'PurchaseCredits'})
              }
              fullWidth
              icon={
                <Text style={{color: colors.primary, fontSize: 18}}>💳</Text>
              }
              style={{marginBottom: spacing.lg}}
            />
          ) : (
            // Has credits - show Zego button directly
            <View style={{marginBottom: spacing.lg}}>
              {console.log('🔵 Rendering ZegoCallButton for:', {
                userID: ownerId,
                userName: ownerName,
                callId,
              })}
              <ZegoCallButton
                receiverId={ownerId}
                invitees={[{userID: ownerId, userName: ownerName}]}
                callId={callId}
                title={t('search.results.found.callButton') || 'Call Owner Now'}
                fullWidth
                disabled={isInitiatingCall}
                onWillPressed={async () => {
                  console.log('📞 About to call - initiating backend call...');
                  const success = await handleInitiateCall();
                  return success; // Allow/deny Zego call based on backend response
                }}
                onPressed={() => {
                  console.log('📞 ✅ Call started with callId:', callId);
                }}
                onError={error => {
                  console.error('❌ Call error:', error);
                  Alert.alert('Call Error', error?.message || 'Failed to call');
                }}
              />
            </View>
          )}
        </View>

        {/* Balance Info Card */}
        <Card
          style={[
            styles.balanceCard,
            {
              backgroundColor: colors.primaryLight,
              marginBottom: spacing.md,
            },
          ]}>
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceIcon, {marginRight: spacing.md}]}>
              <CreditsIcon width={55} height={55} />
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
                {t('search.results.found.yourCredits') ||
                  'Your Contact Credits'}
              </Text>
              <Text style={[styles.balanceValue, {color: colors.textPrimary}]}>
                {balance} {balance === 1 ? 'credit' : 'credits'} remaining
              </Text>
            </View>
          </View>
        </Card>

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
              {t('search.results.found.respectMessage') ||
                'Please be respectful when contacting the owner.'}
            </Text>
          </View>
        </Card>

        {/* Report Link */}
        <TouchableOpacity
          onPress={handleReportIssue}
          style={[styles.reportButton, {paddingVertical: spacing.sm}]}>
          <Text style={[styles.reportLink, {color: colors.primary}]}>
            {t('search.results.found.reportLink') || 'Report an issue'}
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
  successIcon: {},
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
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
    fontWeight: '700',
    letterSpacing: 1,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
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
    fontSize: 18,
    fontWeight: '600',
  },
  section: {},
  freeCard: {},
  paidCard: {},
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
    lineHeight: 18,
  },
  freeBadge: {},
  freeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  costBadge: {},
  costText: {
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
