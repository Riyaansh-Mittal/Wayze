import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';
import {useBalance} from '../../contexts/BalanceContext';
import {useCall} from '../../contexts/CallContext';
import AppBar from '../../components/navigation/AppBar';
import ZegoCallButton from '../../components/common/Button/ZegoCallButton';
import Card from '../../components/common/Card/Card';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';
import {InfoIcon, BellIcon, CreditsIcon} from '../../assets/icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CenterModal from '../../components/common/Modal/CenterModal';

// ── Privacy helper ────────────────────────────────────────────────────────────
// "John Doe"  → "J*** D***"
// "Alice"     → "A***"
const maskName = name => {
  if (!name) return 'V***';
  return name
    .trim()
    .split(/\s+/)
    .map(word => (word.length > 0 ? word.charAt(0).toUpperCase() + '***' : ''))
    .join(' ');
};

// initials for avatar bubble: first + last initial
const getInitials = name => {
  if (!name) return 'V';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

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
  const [callLimitModal, setCallLimitModal] = useState({
    visible: false,
    resetAt: null,
    limit: 2,
  });

  const ownerName = vehicle.owner?.name || 'Vehicle Owner';
  const ownerPhoto = vehicle.owner?.photo;
  const ownerId = vehicle.owner?.userId || vehicle.owner?.id;
  const plateNumber = vehicle.plateNumber || searchQuery;
  const callLimit = vehicle.callLimit;
  const isCallBlocked = callLimit?.exceeded === true;

  useEffect(() => {
    console.log('✅ Vehicle found - Owner:', ownerName, '(ID:', ownerId, ')');
  }, [ownerId, ownerName]);

  const handleSendAlert = () => {
    navigation.navigate('SendAlertModal', {vehicle, searchQuery});
  };

  const handleInitiateCall = async () => {
    if (!ownerId) {
      Alert.alert('Error', 'Owner information is missing.');
      return false;
    }
    if (callId) return true;
    try {
      setIsInitiatingCall(true);
      const callResult = await initiateCall(ownerId);
      if (!callResult.success) {
        Alert.alert('Error', 'Failed to initiate call');
        return false;
      }
      setCallId(callResult.data?.callId);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to prepare call');
      return false;
    } finally {
      setIsInitiatingCall(false);
    }
  };

  const handleReportIssue = () => {
    navigation.navigate('ReportIssueModal', {vehicle, searchQuery});
  };

  // ── Render call button ────────────────────────────────────────────────────
  const renderCallButton = () => {
    if (!hasEnoughCredits) {
      return (
        <TouchableOpacity
          style={[styles.callBtn, {backgroundColor: colors.primary}]}
          onPress={() =>
            navigation.navigate('Profile', {screen: 'PurchaseCredits'})
          }
          activeOpacity={0.85}>
          <Icon
            name="credit-card"
            size={20}
            color="#fff"
            style={styles.btnIcon}
          />
          <Text style={styles.callBtnText}>
            {t('search.results.found.buyCredits') || 'Buy Credits to Call'}
          </Text>
        </TouchableOpacity>
      );
    }

    if (isCallBlocked) {
      return (
        <TouchableOpacity
          style={[
            styles.callBtn,
            {backgroundColor: colors.neutralCard, opacity: 0.6},
          ]}
          onPress={() =>
            setCallLimitModal({
              visible: true,
              resetAt: callLimit?.resetAt,
              limit: callLimit?.limit || 2,
            })
          }
          activeOpacity={0.7}>
          <Icon
            name="phone"
            size={20}
            color={colors.textDisabled}
            style={styles.btnIcon}
          />
          <Text style={[styles.callBtnText, {color: colors.textDisabled}]}>
            {t('search.results.found.callButton') || 'Call Owner'}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <ZegoCallButton
        receiverId={ownerId}
        invitees={[{userID: ownerId, userName: ownerName}]}
        callId={callId}
        title={t('search.results.found.callButton') || 'Call Owner • 1 Credit'}
        fullWidth
        disabled={isInitiatingCall}
        customData={{plateNumber}}
        onWillPressed={async () => await handleInitiateCall()}
        onPressed={() => console.log('📞 ✅ Call started')}
        onError={error =>
          Alert.alert('Call Error', error?.message || 'Failed to call')
        }
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('search.results.title') || 'Search Result'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* ── Body — no ScrollView, single View fills remaining space ── */}
      <View style={[styles.body, {paddingHorizontal: layout.screenPadding}]}>
        {/* ── Success header ── */}
        <View style={styles.successHeader}>
          <View style={[styles.checkCircle, {backgroundColor: '#E8F5E9'}]}>
            <Icon name="check" size={22} color={colors.success} />
          </View>
          <View style={styles.successText}>
            <Text style={[styles.successTitle, {color: colors.textPrimary}]}>
              {t('search.results.found.vehicleTitle') || 'Vehicle Found'}
            </Text>
            <Text style={[styles.successSub, {color: colors.textSecondary}]}>
              {t('search.results.found.registeredOwnerLocated') ||
                'Registered owner located'}
            </Text>
          </View>
        </View>

        {/* ── Combined vehicle + owner card ── */}
        <Card style={styles.infoCard}>
          {/* Plate row */}
          <View style={styles.plateRow}>
            <View style={styles.plateLeft}>
              <VehicleIcon
                type="4-wheeler"
                size={28}
                color={colors.primary}
                style={{marginRight: 10}}
              />
              <View>
                <Text style={[styles.plateNumber, {color: colors.textPrimary}]}>
                  {plateNumber}
                </Text>
                <Text style={[styles.plateMeta, {color: colors.textSecondary}]}>
                  {t('search.results.found.registered') || 'Registered Vehicle'}
                </Text>
              </View>
            </View>
            {/* Verified badge */}
            <View style={[styles.verifiedBadge, {borderColor: colors.primary}]}>
              <Icon name="check" size={12} color={colors.primary} />
              <Text style={[styles.verifiedText, {color: colors.primary}]}>
                {t('common.verified') || 'Verified'}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            style={[styles.divider, {backgroundColor: colors.neutralBorder}]}
          />

          {/* Owner row */}
          <View style={styles.ownerRow}>
            {ownerPhoto ? (
              <Image source={{uri: ownerPhoto}} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
                <Text style={styles.avatarText}>{getInitials(ownerName)}</Text>
              </View>
            )}
            <View style={styles.ownerInfo}>
              <Text style={[styles.ownerName, {color: colors.textPrimary}]}>
                {maskName(ownerName)}
              </Text>
              <Text style={[styles.ownerRole, {color: colors.textSecondary}]}>
                {t('search.results.found.vehicleOwner') || 'Vehicle Owner'}
              </Text>
            </View>
          </View>
        </Card>

        {/* ── Credits remaining ── */}
        {/* <View style={styles.creditsRow}>
          <Text style={styles.creditsEmoji}>🏷️</Text>
          <Text style={[styles.creditsText, {color: colors.textSecondary}]}>
            {balance}{' '}
            {t('search.results.found.creditsRemaining') || 'credits remaining'}
          </Text>
        </View> */}

        {/* ── Call button (primary) ── */}
        {renderCallButton()}

        {/* ── Send Alert button (outlined) ── */}
        <TouchableOpacity
          style={[
            styles.alertBtn,
            {borderColor: colors.neutralBorder, backgroundColor: '#FFFFFF'},
          ]}
          onPress={handleSendAlert}
          activeOpacity={0.8}>
          <Icon
            name="notifications"
            size={20}
            color={colors.textPrimary}
            style={styles.btnIcon}
          />
          <Text style={[styles.alertBtnText, {color: colors.textPrimary}]}>
            {t('search.results.found.alertButton') || 'Send Alert • Free'}
          </Text>
        </TouchableOpacity>

        {/* ── Info note ── */}
        <View style={styles.infoRow}>
          <Icon name="info-outline" size={15} color={colors.textSecondary} />
          <Text style={[styles.infoText, {color: colors.textSecondary}]}>
            {t('search.results.found.respectMessage') ||
              'Be respectful when contacting the owner'}
          </Text>
        </View>

        {/* ── Report link ── */}
        {/* <TouchableOpacity onPress={handleReportIssue} style={styles.reportBtn}>
          <Text style={[styles.reportLink, {color: colors.error}]}>
            {t('search.results.found.reportLink') || 'Report an issue'}
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* ── Call Limit Modal (unchanged logic) ── */}
      <CenterModal
        visible={callLimitModal.visible}
        onClose={() => setCallLimitModal(prev => ({...prev, visible: false}))}
        title={
          t('search.results.found.callLimit.title') || 'Call Limit Reached'
        }
        closeOnBackdropPress={false}>
        {/* Icon */}
        <View style={{alignItems: 'center', marginBottom: spacing.md}}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#FFF3F3',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 30}}>📵</Text>
          </View>
        </View>

        {/* Body — "X times per day" with bold limit number */}
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: spacing.md,
          }}>
          {t('search.results.found.callLimit.bodyPrefix') ||
            'You can only call the same owner'}{' '}
          <Text style={{fontWeight: '700', color: colors.textPrimary}}>
            {t('search.results.found.callLimit.bodyLimit', {
              limit: callLimitModal.limit,
            }) || `${callLimitModal.limit} times per day`}
          </Text>{' '}
          {t('search.results.found.callLimit.bodySuffix') ||
            'to prevent spam and ensure safety for all users.'}
        </Text>

        {/* Reset time box */}
        <View
          style={{
            backgroundColor: colors.neutralLight,
            borderRadius: 12,
            paddingVertical: spacing.md,
            alignItems: 'center',
            marginBottom: spacing.md,
          }}>
          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              marginBottom: 2,
            }}>
            {t('search.results.found.callLimit.resetLabel') || 'Calls reset at'}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.textPrimary,
            }}>
            {callLimitModal.resetAt
              ? new Date(callLimitModal.resetAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  timeZone: 'Asia/Kolkata',
                })
              : t('search.results.found.callLimit.resetFallback') ||
                '1:00 AM'}{' '}
            {t('search.results.found.callLimit.resetSuffix') || 'tonight'}
          </Text>
        </View>

        {/* Tip */}
        <Text
          style={{
            fontSize: 13,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: spacing.lg,
          }}>
          {t('search.results.found.callLimit.tipPrefix') || '💡 You can still'}{' '}
          <Text style={{fontWeight: '700', color: colors.textPrimary}}>
            {t('search.results.found.callLimit.tipAction') ||
              'Send a Free Alert'}
          </Text>{' '}
          {t('search.results.found.callLimit.tipSuffix') ||
            'to notify the owner instantly.'}
        </Text>

        {/* Send Alert button */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: spacing.sm,
          }}
          onPress={() => {
            setCallLimitModal(prev => ({...prev, visible: false}));
            handleSendAlert();
          }}>
          <Text style={{color: colors.white, fontSize: 15, fontWeight: '600'}}>
            {t('search.results.found.callLimit.sendAlert') ||
              'Send Alert Instead'}
          </Text>
        </TouchableOpacity>

        {/* Dismiss */}
        <TouchableOpacity
          style={{paddingVertical: 12, alignItems: 'center'}}
          onPress={() =>
            setCallLimitModal(prev => ({...prev, visible: false}))
          }>
          <Text style={{color: colors.textSecondary, fontSize: 14}}>
            {t('search.results.found.callLimit.dismiss') || 'Dismiss'}
          </Text>
        </TouchableOpacity>
      </CenterModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},

  body: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'flex-start', // items stack from top, no scroll needed
  },

  // Success header — horizontal, compact
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {gap: 1},
  successTitle: {fontSize: 17, fontWeight: '700'},
  successSub: {fontSize: 12},

  // Combined info card
  infoCard: {
    marginBottom: 12,
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  plateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  plateMeta: {fontSize: 14, marginTop: 1},
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  verifiedText: {fontSize: 12, fontWeight: '600'},
  divider: {height: 1, marginHorizontal: 16},
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ownerInfo: {gap: 2},
  ownerName: {fontSize: 17, fontWeight: '600'},
  ownerRole: {fontSize: 14},

  // Credits
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
  },
  creditsEmoji: {fontSize: 15},
  creditsText: {fontSize: 13, fontWeight: '500'},

  // Call button (primary filled)
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    marginBottom: 10,
  },
  callBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Alert button (outlined)
  alertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
    marginTop: 10,
  },
  alertBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },

  btnIcon: {marginRight: 8},

  // Info + Report
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 10,
  },
  infoText: {fontSize: 12},
  reportBtn: {alignItems: 'center', paddingVertical: 4},
  reportLink: {
    fontSize: 13,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default SearchResultFoundScreen;
