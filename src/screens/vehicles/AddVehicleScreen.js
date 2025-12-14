/**
 * Add Vehicle Screen
 * Form to add a new vehicle
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicles } from '../../hooks';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import {
  validatePlateNumber,
  validateRCNumber,
  validatePhoneNumber,
} from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import PlateInput from '../../components/common/Input/PlateInput';
import TextInput from '../../components/common/Input/TextInput';
import PhoneInput from '../../components/common/Input/PhoneInput';
import VehicleTypeSelector from '../../components/vehicle/VehicleTypeSelector';
import ContactMethodsSelector from '../../components/vehicle/ContactMethodsSelector';
import RCUploader from '../../components/vehicle/RCUploader';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';

const AddVehicleScreen = ({ navigation }) => {
  const { addVehicle, checkPlateExists, isLoading } = useVehicles();

  const [formData, setFormData] = useState({
    plateNumber: '',
    rcNumber: '',
    vehicleType: '',
    contactPhone: '',
    contactMethods: {
      phone: true,
      sms: true,
      whatsapp: false,
      email: false,
    },
    rcPhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [isCheckingPlate, setIsCheckingPlate] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Plate number
    const plateValidation = validatePlateNumber(formData.plateNumber);
    if (!plateValidation.valid) {
      newErrors.plateNumber = plateValidation.message;
    }

    // RC number
    const rcValidation = validateRCNumber(formData.rcNumber);
    if (!rcValidation.valid) {
      newErrors.rcNumber = rcValidation.message;
    }

    // Vehicle type
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Please select vehicle type';
    }

    // Contact phone
    const phoneValidation = validatePhoneNumber(formData.contactPhone);
    if (!phoneValidation.valid) {
      newErrors.contactPhone = phoneValidation.message;
    }

    // Contact methods (at least one)
    const hasContactMethod = Object.values(formData.contactMethods).some((v) => v);
    if (!hasContactMethod) {
      newErrors.contactMethods = 'Select at least one contact method';
    }

    // RC photo
    if (!formData.rcPhoto) {
      newErrors.rcPhoto = 'RC photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
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
      });
      return;
    }

    // Add vehicle
    const result = await addVehicle(formData);

    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to add vehicle');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Add Vehicle"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Card */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>📋</Text>
            <Text style={styles.infoText}>
              Register your vehicle to be reachable when someone needs to contact you
            </Text>
          </Card>

          {/* Form */}
          <View style={styles.form}>
            {/* Plate Number */}
            <PlateInput
              value={formData.plateNumber}
              onChangeText={(value) => updateField('plateNumber', value)}
              error={errors.plateNumber}
              required
            />

            {/* RC Number */}
            <TextInput
              label="RC Number"
              value={formData.rcNumber}
              onChangeText={(value) => updateField('rcNumber', value)}
              placeholder="MH01AB123456789"
              autoCapitalize="characters"
              error={errors.rcNumber}
              helperText="Registration Certificate number"
              required
            />

            {/* Vehicle Type */}
            <VehicleTypeSelector
              value={formData.vehicleType}
              onChange={(value) => updateField('vehicleType', value)}
              error={errors.vehicleType}
            />

            {/* Contact Phone */}
            <PhoneInput
              value={formData.contactPhone}
              onChangeText={(value) => updateField('contactPhone', value)}
              error={errors.contactPhone}
              required
            />

            {/* Contact Methods */}
            <ContactMethodsSelector
              value={formData.contactMethods}
              onChange={(value) => updateField('contactMethods', value)}
              error={errors.contactMethods}
            />

            {/* RC Photo */}
            <RCUploader
              value={formData.rcPhoto}
              onChange={(value) => updateField('rcPhoto', value)}
              error={errors.rcPhoto}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Add Vehicle"
              onPress={handleSubmit}
              loading={isLoading || isCheckingPlate}
              fullWidth
              icon={<Text style={{ color: COLORS.white }}>→</Text>}
            />

            <SecondaryButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              disabled={isLoading || isCheckingPlate}
              fullWidth
              style={{ marginTop: SPACING.md }}
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
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
    paddingBottom: SPACING.xxxl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.lg,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  buttonContainer: {
    marginTop: SPACING.base,
  },
});

export default AddVehicleScreen;
