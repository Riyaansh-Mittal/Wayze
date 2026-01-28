/**
 * Add Vehicle Screen
 * Premium UX – Fully Theme Aware & Translation Ready
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import {validatePlateNumber, validatePhoneNumber} from '../../utils/validators';

import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import TextInput from '../../components/common/Input/TextInput';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';

const VEHICLE_TYPES = [
  {value: 2, label: '2 Wheeler (Bike / Scooter)'},
  {value: 3, label: '3 Wheeler (Auto)'},
  {value: 4, label: '4 Wheeler (Car / SUV)'},
];

const AddVehicleScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, typography, layout} = theme;
  const {
    addVehicle,
    getModelUseCount, // ✅ Now available
    getEmergencyContact,
    isLoading,
  } = useVehicles();

  const referralCodeParam = route.params?.referralCode || '';

  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleType: null,
    emergencyContact: '',
    referralCode: referralCodeParam,
  });

  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isFirstVehicle, setIsFirstVehicle] = useState(false);

  /**
   * ✅ Check if this is the first vehicle
   */
  useEffect(() => {
    try {
      // Check if methods exist before calling
      if (typeof getModelUseCount === 'function') {
        const modelUseCount = getModelUseCount();
        const isFirst = modelUseCount === 0;
        setIsFirstVehicle(isFirst);
        console.log(
          '📊 Vehicle count:',
          modelUseCount,
          '| First vehicle:',
          isFirst,
        );
      } else {
        console.warn('⚠️ getModelUseCount is not available');
        setIsFirstVehicle(true); // Assume first vehicle if method not available
      }

      // Pre-fill emergency contact if exists
      if (typeof getEmergencyContact === 'function') {
        const existingContact = getEmergencyContact();
        if (existingContact) {
          setFormData(prev => ({...prev, emergencyContact: existingContact}));
          console.log('📱 Pre-filled emergency contact:', existingContact);
        }
      }
    } catch (error) {
      console.error('❌ Error in useEffect:', error);
      setIsFirstVehicle(true);
    }
  }, [getEmergencyContact, getModelUseCount]);

  /**
   * Update form field and clear error
   */
  const updateField = (key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
    setErrors(prev => ({...prev, [key]: null}));
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const err = {};

    // Vehicle type is required
    if (!formData.vehicleType) {
      err.vehicleType = t('validation.required') || 'Vehicle type is required';
    }

    // Plate number validation
    const plateValidation = validatePlateNumber(formData.plateNumber);
    if (!plateValidation.valid) {
      err.plateNumber = t('validation.invalidPlate') || plateValidation.message;
    }

    // Emergency contact validation (required)
    if (!formData.emergencyContact) {
      err.emergencyContact =
        t('validation.required') || 'Emergency contact is required';
    } else {
      const phoneValidation = validatePhoneNumber(formData.emergencyContact);
      if (!phoneValidation.valid) {
        err.emergencyContact =
          t('validation.invalidPhone') || phoneValidation.message;
      }
    }

    // Referral code validation (optional, only for first vehicle)
    if (isFirstVehicle && formData.referralCode) {
      // Basic format check: 8 alphanumeric characters
      if (!/^[A-Z0-9]{8}$/i.test(formData.referralCode)) {
        err.referralCode =
          t('validation.invalidReferral') ||
          'Referral code must be 8 alphanumeric characters';
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    console.log('📝 Submitting form:', formData);

    // Validate form
    if (!validateForm()) {
      Alert.alert(
        t('common.error') || 'Error',
        t('errors.validation') || 'Please fix the errors and try again',
      );
      return;
    }

    // Prepare data according to API format
    const vehicleData = {
      wheelType: formData.vehicleType,
      vehicleRegistration: formData.plateNumber.toUpperCase().trim(), // ✅ Changed from plateNumber to vehicleRegistration
      emergencyContact: formData.emergencyContact.trim(),
    };

    // Only include referralCode if it's the first vehicle and code is provided
    if (isFirstVehicle && formData.referralCode) {
      vehicleData.referralCode = formData.referralCode.toUpperCase().trim();
    }

    console.log('📤 Sending to API:', vehicleData);

    // Add vehicle
    const result = await addVehicle(vehicleData);

    if (result?.success) {
      Alert.alert(
        t('common.success') || 'Success',
        t('vehicles.form.success') || 'Vehicle added successfully!',
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      // ✅ Check if error is "Vehicle already registered"
      if (
        result?.error === 'Vehicle already registered' ||
        result?.error?.includes('already registered')
      ) {
        // Navigate to VerifyOwnership screen
        navigation.navigate('VerifyOwnership', {
          plateNumber: formData.plateNumber.toUpperCase().trim(),
          vehicleType: formData.vehicleType,
        });
      } else {
        // Show generic error
        Alert.alert(
          t('common.error') || 'Error',
          result?.error || t('errors.unknown') || 'Failed to add vehicle',
        );
      }
    }
  };

  const getVehicleTypeLabel = wheelType => {
    const type = VEHICLE_TYPES.find(v => v.value === wheelType);
    return type ? type.label : `${wheelType} Wheeler`;
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}>
      <AppBar
        title={t('vehicles.addButton') || 'Add Vehicle'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl,
          }}>
          {/* INTRO CARD */}
          <Card style={{marginBottom: spacing.lg}}>
            <Text style={[typography.h1, {fontWeight: '700'}]}>
              {t('vehicles.form.introTitle') || 'Add Your Vehicle'}
            </Text>
            <Text
              style={[
                typography.caption,
                {marginTop: spacing.sm, color: colors.textSecondary},
              ]}>
              {t('vehicles.form.introSubtitle') ||
                'Create a QR for your vehicle and receive alerts when someone scans it.'}
            </Text>
          </Card>

          {/* ✅ REFERRAL CODE CARD (Only for first vehicle) */}
          {isFirstVehicle && (
            <Card
              style={{
                marginBottom: spacing.lg,
                backgroundColor: colors.primaryLight,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                }}>
                <Text style={{fontSize: 24, marginRight: spacing.sm}}>🎁</Text>
                <Text style={[typography.h2, {color: colors.primary}]}>
                  {t('vehicles.form.referralTitle') || 'Have a Referral Code?'}
                </Text>
              </View>
              <Text
                style={[
                  typography.caption,
                  {color: colors.textSecondary, marginBottom: spacing.base},
                ]}>
                {t('vehicles.form.referralSubtitle') ||
                  "Enter your friend's referral code to give them rewards!"}
              </Text>

              <TextInput
                label={`${
                  t('vehicles.form.referralCode') || 'Referral Code'
                } (${t('common.optional') || 'Optional'})`}
                placeholder={
                  t('vehicles.form.referralPlaceholder') || 'A3F92CDE'
                }
                value={formData.referralCode}
                maxLength={8}
                autoCapitalize="characters"
                onChangeText={v => updateField('referralCode', v.toUpperCase())}
                error={errors.referralCode}
                helperText={
                  t('vehicles.form.referralHelper') ||
                  '8-character code from your friend'
                }
                leftIcon={<Text style={{fontSize: 18}}>🎫</Text>}
              />
            </Card>
          )}

          {/* VEHICLE TYPE SELECTION */}
          <Card style={{marginBottom: spacing.lg}}>
            <Text style={[typography.captionBold, {marginBottom: spacing.sm}]}>
              {t('vehicles.form.vehicleType') || 'Vehicle Type'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.dropdown,
                {
                  backgroundColor: colors.white,
                  borderColor: errors.vehicleType
                    ? colors.error
                    : colors.neutralBorder,
                },
              ]}
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setDropdownOpen(!dropdownOpen);
              }}>
              <VehicleIcon
                type={
                  formData.vehicleType
                    ? `${formData.vehicleType}-wheeler`
                    : '4-wheeler'
                }
                size={28}
              />

              <Text
                style={{
                  marginLeft: spacing.sm,
                  flex: 1,
                  fontWeight: '600',
                  fontSize: 15,
                  color: formData.vehicleType
                    ? colors.textPrimary
                    : colors.textSecondary,
                }}>
                {formData.vehicleType
                  ? getVehicleTypeLabel(formData.vehicleType)
                  : t('vehicles.form.vehicleTypePlaceholder') ||
                    'Select vehicle type'}
              </Text>

              <Icon
                name={dropdownOpen ? 'expand-less' : 'expand-more'}
                size={26}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Dropdown Options */}
            {dropdownOpen && (
              <View
                style={[
                  styles.dropdownList,
                  {
                    borderColor: colors.neutralBorder,
                    backgroundColor: colors.white,
                  },
                ]}>
                {VEHICLE_TYPES.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.dropdownItem,
                      {
                        backgroundColor:
                          formData.vehicleType === item.value
                            ? colors.primaryLight
                            : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      updateField('vehicleType', item.value);
                      LayoutAnimation.easeInEaseOut();
                      setDropdownOpen(false);
                    }}
                    activeOpacity={0.7}>
                    <VehicleIcon type={`${item.value}-wheeler`} size={22} />
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: spacing.sm,
                        color: colors.textPrimary,
                        fontSize: 15,
                        fontWeight:
                          formData.vehicleType === item.value ? '600' : '400',
                      }}>
                      {item.label}
                    </Text>
                    {formData.vehicleType === item.value && (
                      <Icon
                        name="check-circle"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Error Message */}
            {!!errors.vehicleType && (
              <Text
                style={{
                  color: colors.error,
                  marginTop: spacing.xs,
                  fontSize: 13,
                }}>
                {errors.vehicleType}
              </Text>
            )}
          </Card>

          {/* VEHICLE DETAILS */}
          <Card style={{marginBottom: spacing.lg}}>
            <Text style={[typography.h2, {marginBottom: spacing.sm}]}>
              {t('vehicles.form.vehicleDetailsTitle') || 'Vehicle Details'}
            </Text>

            {/* Vehicle Number */}
            <TextInput
              label={t('vehicles.form.plateNumber') || 'Vehicle Number'}
              placeholder={
                t('vehicles.form.platePlaceholder') ||
                'MH12AB1234 or 26BH1234AA' // ✅ Updated
              }
              value={formData.plateNumber}
              maxLength={15} // ✅ Updated (was 13)
              autoCapitalize="characters"
              onChangeText={v => updateField('plateNumber', v.toUpperCase())}
              error={errors.plateNumber}
              helperText={
                t('vehicles.form.plateHelper') ||
                'Standard (MH12AB1234), BH series (26BH1234AA), or Delhi (DL01CAA1234)' // ✅ Updated
              }
              leftIcon={<VehicleIcon type="4-wheeler" size={30} />}
            />

            <View style={{height: spacing.lg}} />

            {/* Emergency Contact (Required) */}
            <TextInput
              label={t('vehicles.form.contactPhone') || 'Emergency Contact'}
              placeholder={
                t('vehicles.form.contactPhonePlaceholder') ||
                '10 digit mobile number'
              }
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.emergencyContact}
              onChangeText={v =>
                updateField('emergencyContact', v.replace(/\D/g, ''))
              }
              error={errors.emergencyContact}
              helperText={
                t('vehicles.form.contactPhoneHelper') ||
                'This will be shown when someone searches your vehicle'
              }
              leftIcon={<Text style={{fontSize: 18}}>📱</Text>}
            />
          </Card>

          {/* CONFIRMATION CHECKBOX */}
          <Card style={styles.confirmCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{flexDirection: 'row', alignItems: 'flex-start', flex: 1}}
              onPress={() => setConfirmed(!confirmed)}>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: confirmed ? colors.primary : colors.white,
                    borderColor: confirmed
                      ? colors.primary
                      : colors.neutralBorder,
                  },
                ]}>
                {confirmed && (
                  <Icon name="check" size={18} color={colors.white} />
                )}
              </View>

              <Text
                style={{
                  marginLeft: spacing.sm,
                  flex: 1,
                  fontSize: 14,
                  lineHeight: 20,
                  color: colors.textPrimary,
                }}>
                {t('vehicles.form.confirmation') ||
                  'I confirm that the above details are correct and belong to me.'}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* ACTION BUTTONS */}
          <PrimaryButton
            title={t('vehicles.form.saveButton') || 'Save Vehicle'}
            fullWidth
            disabled={!confirmed}
            loading={isLoading}
            onPress={handleSubmit}
          />

          <SecondaryButton
            title={t('vehicles.form.cancelButton') || 'Cancel'}
            fullWidth
            style={{marginTop: spacing.md}}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  dropdown: {
    marginTop: 12,
    borderWidth: 2,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  dropdownItem: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  confirmCard: {
    marginBottom: 24,
    padding: 16,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddVehicleScreen;
