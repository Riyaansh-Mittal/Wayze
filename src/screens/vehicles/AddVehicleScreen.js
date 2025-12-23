/**
 * Add Vehicle Screen
 * Premium UX – Fully Theme Aware & Translation Ready
 */

import React, {useState} from 'react';
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
  {value: '2-wheeler', label: '2 Wheeler (Bike / Scooter)'},
  {value: '3-wheeler', label: '3 Wheeler (Auto)'},
  {value: '4-wheeler', label: '4 Wheeler (Car / SUV)'},
];

const AddVehicleScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, typography, layout} = theme;
  const {addVehicle, checkPlateExists, isLoading} = useVehicles();

  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleType: '',
    contactPhone: '',
  });

  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [checkingPlate, setCheckingPlate] = useState(false);

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
      err.vehicleType = t('validation.required') || 'This field is required';
    }

    // Plate number validation
    if (!validatePlateNumber(formData.plateNumber).valid) {
      err.plateNumber =
        t('validation.invalidPlate') || 'Invalid plate number format';
    }

    // Contact phone validation (optional, but if provided must be valid)
    if (
      formData.contactPhone &&
      !validatePhoneNumber(formData.contactPhone).valid
    ) {
      err.contactPhone = t('validation.invalidPhone') || 'Invalid phone number';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      Alert.alert(
        t('common.error') || 'Error',
        t('errors.validation') || 'Please fix the errors and try again',
      );
      return;
    }

    // Check if plate exists
    setCheckingPlate(true);
    const plateCheck = await checkPlateExists(formData.plateNumber);
    setCheckingPlate(false);

    if (plateCheck?.exists) {
      // Navigate to ownership conflict screen
      navigation.navigate('OwnershipConflict', {
        plateNumber: formData.plateNumber,
        existingVehicle: plateCheck.vehicle,
        newVehicleData: formData,
      });
      return;
    }

    // Add vehicle
    const result = await addVehicle(formData);

    if (result?.success) {
      Alert.alert(
        t('common.success') || 'Success',
        t('vehicles.form.success') || 'Vehicle added successfully',
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      Alert.alert(
        t('common.error') || 'Error',
        result?.error || t('errors.unknown') || 'Something went wrong',
      );
    }
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
                type={formData.vehicleType || '4-wheeler'}
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
                  ? t(`vehicles.types.${formData.vehicleType}`) ||
                    VEHICLE_TYPES.find(v => v.value === formData.vehicleType)
                      ?.label
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
                    <VehicleIcon type={item.value} size={22} />
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: spacing.sm,
                        color: colors.textPrimary,
                        fontSize: 15,
                        fontWeight:
                          formData.vehicleType === item.value ? '600' : '400',
                      }}>
                      {t(`vehicles.types.${item.value}`) || item.label}
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
              placeholder={t('vehicles.form.platePlaceholder') || 'PB10AB1234'}
              value={formData.plateNumber}
              maxLength={13}
              autoCapitalize="characters"
              onChangeText={v => updateField('plateNumber', v.toUpperCase())}
              error={errors.plateNumber}
              helperText={t('vehicles.form.plateHelper')}
              leftIcon={<VehicleIcon type="4-wheeler" size={30} />}
            />

            <View style={{height: spacing.lg}} />

            {/* Contact Number (Optional) */}
            <TextInput
              label={`${t('vehicles.form.contactPhone') || 'Contact Number'} (${
                t('common.optional') || 'Optional'
              })`}
              placeholder={
                t('vehicles.form.contactPhonePlaceholder') ||
                '10 digit mobile number'
              }
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.contactPhone}
              onChangeText={v =>
                updateField('contactPhone', v.replace(/\D/g, ''))
              }
              error={errors.contactPhone}
              helperText={t('vehicles.form.contactPhoneHelper')}
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
            loading={isLoading || checkingPlate}
            onPress={handleSubmit}
          />

          <SecondaryButton
            title={t('vehicles.form.cancelButton') || 'Cancel'}
            fullWidth
            style={{marginTop: spacing.md}}
            onPress={() => navigation.goBack()}
            disabled={isLoading || checkingPlate}
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
