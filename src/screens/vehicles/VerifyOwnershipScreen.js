/**
 * Verify Ownership Screen
 * Shown when user tries to add a vehicle that's already registered
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';

const VerifyOwnershipScreen = ({navigation, route}) => {
  const {plateNumber, vehicleType} = route.params;
  const {user} = useAuth();
  const {t, theme} = useTheme();
  const {colors, spacing, typography} = theme;
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Open Gmail with pre-filled email for RC photo submission
   */
  /**
   * Open Gmail with pre-filled email for RC photo submission
   */
  const handleOpenGmail = async () => {
    const emailRecipient = 'support@yourapp.com'; // ✅ Replace with your actual email
    const subject = `Vehicle Ownership Verification - ${plateNumber}`;
    const body = `Hi Team,

I need to verify ownership of my vehicle:

User Details:
• Name: ${user?.fullName || user?.firstName || 'N/A'}

Vehicle Details:
• Vehicle Number: ${plateNumber}
• Vehicle Type: ${vehicleType}-Wheeler

I have attached clear photos of my RC (all 4 corners visible) where:
- My name matches the RC name
- The plate number is readable

Please verify and add this vehicle to my account.

Thank you!`;

    try {
      setIsLoading(true);

      const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;

      // ✅ Just open it - don't check canOpenURL (causes false negatives)
      await Linking.openURL(mailtoUrl);

      console.log('✅ Email intent sent');

      // Navigate to success screen
      setTimeout(() => {
        navigation.replace('VerificationSent', {
          plateNumber,
          vehicleType,
        });
      }, 1000);
    } catch (error) {
      console.error('❌ Error opening email:', error);

      // Show fallback instructions
      Alert.alert(
        t('vehicles.emailApp.notFound') || 'No Email App',
        `${
          t('vehicles.emailApp.manual') || 'Please send an email manually to:'
        }\n\n📧 ${emailRecipient}\n\n${
          t('vehicles.emailApp.includeDetails') || 'Include:'
        }\n• Your name: ${user?.fullName || 'N/A'}\n• Mobile: ${
          user?.phoneNumber || 'N/A'
        }\n• Vehicle: ${plateNumber}\n• RC photo`,
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => {
              navigation.replace('VerificationSent', {
                plateNumber,
                vehicleType,
              });
            },
          },
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}>
      <AppBar
        title={t('vehicles.verifyOwnership') || 'Verify Ownership'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom: spacing.xxxl,
        }}>
        {/* Warning Icon */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              {backgroundColor: colors.warningLight || '#FFF3E0'},
            ]}>
            <Icon
              name="error-outline"
              size={48}
              color={colors.warning || '#F57C00'}
            />
          </View>
        </View>

        {/* Main Message */}
        <Text
          style={[
            typography.h1,
            {
              textAlign: 'center',
              marginBottom: spacing.sm,
              fontWeight: '700',
            },
          ]}>
          {t('vehicles.alreadyRegistered') || 'Vehicle already\nregistered'}
        </Text>

        {/* Vehicle Number Card */}
        <View
          style={[
            styles.plateCard,
            {
              backgroundColor: colors.white,
              borderColor: colors.primary,
            },
          ]}>
          <Icon name="directions-car" size={24} color={colors.textPrimary} />
          <Text
            style={[
              typography.h2,
              {
                marginLeft: spacing.sm,
                fontWeight: '700',
                letterSpacing: 2,
              },
            ]}>
            {plateNumber}
          </Text>
        </View>

        {/* Explanation Text */}
        <Text
          style={[
            typography.body,
            {
              textAlign: 'center',
              color: colors.textSecondary,
              marginBottom: spacing.xl,
              lineHeight: 22,
            },
          ]}>
          {t('vehicles.verifyExplanation') ||
            'We need to verify you own this vehicle to prevent fraud'}
        </Text>

        {/* How to Verify Card */}
        <Card style={{marginBottom: spacing.lg}}>
          <Text
            style={[
              typography.h2,
              {marginBottom: spacing.md, fontWeight: '600'},
            ]}>
            {t('vehicles.howToVerify') || 'How to verify'}
          </Text>

          {/* Step 1 */}
          <View style={styles.step}>
            <View
              style={[styles.stepNumber, {backgroundColor: colors.primary}]}>
              <Text
                style={[
                  typography.caption,
                  {color: colors.white, fontWeight: '700'},
                ]}>
                1
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={[typography.bodyBold, {marginBottom: spacing.xs}]}>
                {t('vehicles.step1Title') || 'Email your RC photo'}
              </Text>
              <Text style={[typography.caption, {color: colors.textSecondary}]}>
                {t('vehicles.step1Subtitle') || 'Gmail will open automatically'}
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.step}>
            <View
              style={[styles.stepNumber, {backgroundColor: colors.primary}]}>
              <Text
                style={[
                  typography.caption,
                  {color: colors.white, fontWeight: '700'},
                ]}>
                2
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={[typography.bodyBold, {marginBottom: spacing.xs}]}>
                {t('vehicles.step2Title') || 'Our team will review'}
              </Text>
              <Text style={[typography.caption, {color: colors.textSecondary}]}>
                {t('vehicles.step2Subtitle') || "We'll contact you if needed"}
              </Text>
            </View>
          </View>
        </Card>

        {/* What to Include Card */}
        <Card
          style={{
            marginBottom: spacing.xl,
            backgroundColor: colors.infoLight || '#E3F2FD',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.sm,
            }}>
            <Icon
              name="email"
              size={20}
              color={colors.info || '#1976D2'}
              style={{marginRight: spacing.xs}}
            />
            <Text
              style={[
                typography.captionBold,
                {color: colors.info || '#1976D2'},
              ]}>
              {t('vehicles.whatToInclude') || 'What to include in email'}
            </Text>
          </View>

          <View style={styles.checklistItem}>
            <Icon
              name="check-circle"
              size={18}
              color={colors.success}
              style={{marginRight: spacing.xs}}
            />
            <Text style={[typography.caption, {flex: 1, lineHeight: 20}]}>
              {t('vehicles.rcRequirement1') ||
                'Clear RC photo (all 4 corners visible)'}
            </Text>
          </View>

          <View style={styles.checklistItem}>
            <Icon
              name="check-circle"
              size={18}
              color={colors.success}
              style={{marginRight: spacing.xs}}
            />
            <Text style={[typography.caption, {flex: 1, lineHeight: 20}]}>
              {t('vehicles.rcRequirement2') || 'Your name must match RC name'}
            </Text>
          </View>

          <View style={styles.checklistItem}>
            <Icon
              name="check-circle"
              size={18}
              color={colors.success}
              style={{marginRight: spacing.xs}}
            />
            <Text style={[typography.caption, {flex: 1, lineHeight: 20}]}>
              {t('vehicles.rcRequirement3') || 'Plate number must be readable'}
            </Text>
          </View>
        </Card>

        {/* Info Banner */}
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: colors.successLight || '#E8F5E9',
              borderLeftColor: colors.success,
            },
          ]}>
          <Icon
            name="shield"
            size={20}
            color={colors.success}
            style={{marginRight: spacing.sm}}
          />
          <Text
            style={[
              typography.caption,
              {flex: 1, color: colors.success, lineHeight: 18},
            ]}>
            {t('vehicles.rcDeletion') ||
              'Your RC is deleted after verification'}
          </Text>
        </View>

        {/* Action Buttons */}
        <PrimaryButton
          title={t('vehicles.openGmail') || '📧 Open Gmail & Send'}
          fullWidth
          onPress={handleOpenGmail}
          loading={isLoading}
          style={{marginBottom: spacing.md}}
        />

        <SecondaryButton
          title={t('common.cancel') || 'Cancel'}
          fullWidth
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 24,
  },
});

export default VerifyOwnershipScreen;
