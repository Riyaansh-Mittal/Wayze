/**
 * Add Vehicle Screen
 * Form to add a new vehicle (No RC required unless conflict)
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
import { useVehicles } from '../../contexts/VehicleContext';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import {
  validatePlateNumber,
  validatePhoneNumber,
} from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import PlateInput from '../../components/common/Input/PlateInput';
import PhoneInput from '../../components/common/Input/PhoneInput';
import VehicleTypeSelector from '../../components/vehicle/VehicleTypeSelector';
import ContactMethodsSelector from '../../components/vehicle/ContactMethodsSelector';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';

const AddVehicleScreen = ({ navigation }) => {
  const { addVehicle, checkPlateExists, isLoading } = useVehicles();

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
      // Plate already registered - show conflict screen with RC verification
      navigation.navigate('OwnershipConflict', {
        plateNumber: formData.plateNumber,
        existingVehicle: plateCheck.vehicle,
        newVehicleData: formData, // Pass the new vehicle data
      });
      return;
    }

    // No conflict - add vehicle directly (no RC required)
    const result = await addVehicle(formData);

    if (result.success) {
      Alert.alert(
        'Success',
        'Vehicle added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
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
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📋</Text>
              <Text style={styles.infoText}>
                Register your vehicle to be reachable when someone needs to contact you about parking.
              </Text>
            </View>
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
              helperText="This number will be used to contact you"
              required
            />

            {/* Contact Methods */}
            <ContactMethodsSelector
              value={formData.contactMethods}
              onChange={(value) => updateField('contactMethods', value)}
              error={errors.contactMethods}
            />
          </View>

          {/* Privacy Notice */}
          <Card style={styles.privacyCard}>
            <View style={styles.privacyRow}>
              <Text style={styles.privacyIcon}>🔒</Text>
              <View style={styles.privacyInfo}>
                <Text style={styles.privacyTitle}>Privacy & Security</Text>
                <Text style={styles.privacyText}>
                  • Your contact details remain private{'\n'}
                  • Only revealed when someone contacts you{'\n'}
                  • RC verification only if ownership conflict occurs
                </Text>
              </View>
            </View>
          </Card>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isCheckingPlate ? 'Checking...' : 'Add Vehicle'}
              onPress={handleSubmit}
              loading={isLoading || isCheckingPlate}
              fullWidth
              icon={<Text style={{ color: COLORS.white }}>✓</Text>}
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
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  privacyCard: {
    backgroundColor: COLORS.successLight,
    marginBottom: SPACING.lg,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  privacyText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: SPACING.base,
  },
});

export default AddVehicleScreen;
