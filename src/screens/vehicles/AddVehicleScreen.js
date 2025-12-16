/**
 * Add Vehicle Screen
 * Form to add a new vehicle
 * FULLY CORRECTED TRANSLATION KEYS FROM i18n
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import {validatePlateNumber, validatePhoneNumber} from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import TextInput from '../../components/common/Input/TextInput';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';

const VEHICLE_TYPES = [
  {value: '2-wheeler', label: '2-wheeler (Bike/Scooter)', icon: <VehicleIcon type="2-wheeler" size={64} />},
  {value: '3-wheeler', label: '3-wheeler (Auto)', icon: <VehicleIcon type="3-wheeler" size={64} />},
  {value: '4-wheeler', label: '4-wheeler (Car/SUV)', icon: <VehicleIcon type="4-wheeler" size={64} />},
];

const AddVehicleScreen = ({navigation}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {addVehicle, checkPlateExists, isLoading} = useVehicles();

  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleType: '',
    contactPhone: '',
    contactMethods: {
      phone: true,
      sms: true,
      whatsapp: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [isCheckingPlate, setIsCheckingPlate] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: ''}));
  };

  const updateContactMethod = method => {
    setFormData(prev => ({
      ...prev,
      contactMethods: {
        ...prev.contactMethods,
        [method]: !prev.contactMethods[method],
      },
    }));
    setErrors(prev => ({...prev, contactMethods: ''}));
  };

  const validateForm = () => {
    const newErrors = {};

    // Plate number
    const plateValidation = validatePlateNumber(formData.plateNumber);
    if (!plateValidation.valid) {
      newErrors.plateNumber = t('validation.invalidPlate');
    }

    // Vehicle type
    if (!formData.vehicleType) {
      newErrors.vehicleType = t('validation.required');
    }

    // Contact phone
    const phoneValidation = validatePhoneNumber(formData.contactPhone);
    if (!phoneValidation.valid) {
      newErrors.contactPhone = t('validation.invalidPhone');
    }

    // Contact methods (at least one)
    const hasContactMethod = Object.values(formData.contactMethods).some(
      v => v,
    );
    if (!hasContactMethod) {
      newErrors.contactMethods = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(t('common.error'), t('errors.validation'));
      return;
    }

    // Check if plate exists
    setIsCheckingPlate(true);
    const plateCheck = await checkPlateExists(formData.plateNumber);
    setIsCheckingPlate(false);

    if (plateCheck.exists) {
      // Plate already registered - show conflict screen
      navigation.navigate('OwnershipConflict', {
        plateNumber: formData.plateNumber,
        existingVehicle: plateCheck.vehicle,
        newVehicleData: formData,
      });
      return;
    }

    // No conflict - add vehicle directly
    const result = await addVehicle(formData);

    if (result.success) {
      Alert.alert(t('common.success'), t('vehicles.form.success'), [
        {
          text: t('common.ok'),
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert(t('common.error'), result.error || t('errors.unknown'));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('vehicles.addButton')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              padding: layout.screenPadding,
              paddingBottom: spacing.xxxl,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Vehicle Type */}
          <View style={[styles.section, {marginBottom: spacing.lg}]}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  marginBottom: spacing.sm,
                },
              ]}>
              {t('vehicles.form.vehicleType')}
            </Text>

            {VEHICLE_TYPES.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.vehicleTypeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor:
                      formData.vehicleType === type.value
                        ? colors.primary
                        : colors.border,
                    borderWidth: 2,
                    marginBottom: spacing.sm,
                  },
                ]}
                onPress={() => updateField('vehicleType', type.value)}
                activeOpacity={0.7}>
                <Text
                  style={[styles.vehicleTypeIcon, {marginRight: spacing.md}]}>
                  {type.icon}
                </Text>
                <Text
                  style={[
                    styles.vehicleTypeLabel,
                    {
                      color: colors.textPrimary,
                      flex: 1,
                    },
                  ]}>
                  {t(`vehicles.types.${type.value}Full`)}
                </Text>
                {formData.vehicleType === type.value && (
                  <Text style={[styles.checkmark, {color: colors.primary}]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            {errors.vehicleType && (
              <Text style={[styles.errorText, {color: colors.error}]}>
                {errors.vehicleType}
              </Text>
            )}
          </View>

          {/* Registration Number */}
          <View style={[styles.section, {marginBottom: spacing.lg}]}>
            <TextInput
              label={t('vehicles.form.plateNumber')}
              value={formData.plateNumber}
              onChangeText={text =>
                updateField('plateNumber', text.toUpperCase())
              }
              placeholder={t('vehicles.form.platePlaceholder')}
              autoCapitalize="characters"
              maxLength={13}
              error={errors.plateNumber}
              helperText={t('vehicles.form.plateHelper')}
              leftIcon={<VehicleIcon type="4-wheeler" size={32} />}
            />
          </View>

          {/* Contact Phone Number */}
          <View style={[styles.section, {marginBottom: spacing.lg}]}>
            <TextInput
              label={t('vehicles.form.contactPhone')}
              value={formData.contactPhone}
              onChangeText={text =>
                updateField('contactPhone', text.replace(/\D/g, ''))
              }
              placeholder={t('vehicles.form.contactPhonePlaceholder')}
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.contactPhone}
              helperText={t('vehicles.form.contactPhoneHelper')}
              leftIcon={<Text>📱</Text>}
            />
          </View>

          {/* Contact Methods */}
          <View style={[styles.section, {marginBottom: spacing.lg}]}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  marginBottom: spacing.sm,
                },
              ]}>
              {t('vehicles.form.contactMethods')}
            </Text>

            <Card style={{padding: 0}}>
              <TouchableOpacity
                style={[
                  styles.methodRow,
                  {
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.base,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => updateContactMethod('phone')}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: formData.contactMethods.phone
                        ? colors.primary
                        : colors.border,
                      backgroundColor: formData.contactMethods.phone
                        ? colors.primary
                        : 'transparent',
                    },
                  ]}>
                  {formData.contactMethods.phone && (
                    <Text style={[styles.checkboxCheck, {color: colors.white}]}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text style={[styles.methodLabel, {color: colors.textPrimary}]}>
                  {t('vehicles.form.allowCalls')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodRow,
                  {
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.base,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => updateContactMethod('sms')}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: formData.contactMethods.sms
                        ? colors.primary
                        : colors.border,
                      backgroundColor: formData.contactMethods.sms
                        ? colors.primary
                        : 'transparent',
                    },
                  ]}>
                  {formData.contactMethods.sms && (
                    <Text style={[styles.checkboxCheck, {color: colors.white}]}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text style={[styles.methodLabel, {color: colors.textPrimary}]}>
                  {t('vehicles.form.allowSMS')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodRow,
                  {
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.base,
                  },
                ]}
                onPress={() => updateContactMethod('whatsapp')}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: formData.contactMethods.whatsapp
                        ? colors.primary
                        : colors.border,
                      backgroundColor: formData.contactMethods.whatsapp
                        ? colors.primary
                        : 'transparent',
                    },
                  ]}>
                  {formData.contactMethods.whatsapp && (
                    <Text style={[styles.checkboxCheck, {color: colors.white}]}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text style={[styles.methodLabel, {color: colors.textPrimary}]}>
                  {t('vehicles.form.allowWhatsApp')}
                </Text>
              </TouchableOpacity>
            </Card>

            {errors.contactMethods && (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.error,
                    marginTop: spacing.sm,
                  },
                ]}>
                {errors.contactMethods}
              </Text>
            )}
          </View>

          {/* Confirmation Checkbox */}
          <TouchableOpacity
            style={[styles.confirmRow, {marginBottom: spacing.xl}]}
            onPress={() => setIsConfirmed(!isConfirmed)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: isConfirmed ? colors.primary : colors.border,
                  backgroundColor: isConfirmed ? colors.primary : 'transparent',
                  marginRight: spacing.sm,
                },
              ]}>
              {isConfirmed && (
                <Text style={[styles.checkboxCheck, {color: colors.white}]}>
                  ✓
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.confirmText,
                {
                  color: colors.textSecondary,
                  flex: 1,
                },
              ]}>
              {t('vehicles.form.confirmation')}
            </Text>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={
                isCheckingPlate
                  ? t('common.loading')
                  : t('vehicles.form.saveButton')
              }
              onPress={handleSubmit}
              loading={isLoading || isCheckingPlate}
              disabled={!isConfirmed}
              fullWidth
            />

            <SecondaryButton
              title={t('vehicles.form.cancelButton')}
              onPress={() => navigation.goBack()}
              disabled={isLoading || isCheckingPlate}
              fullWidth
              style={{marginTop: spacing.md}}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Styles applied dynamically
  },
  section: {
    // Styles applied dynamically
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  vehicleTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  vehicleTypeIcon: {
    fontSize: 32,
  },
  vehicleTypeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    marginTop: 4,
  },
  helperNote: {
    fontSize: 12,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCheck: {
    fontSize: 14,
    fontWeight: '700',
  },
  methodLabel: {
    fontSize: 15,
    flex: 1,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  confirmText: {
    fontSize: 13,
    lineHeight: 18,
  },
  buttonContainer: {
    // Styles applied dynamically
  },
});

export default AddVehicleScreen;
