/**
 * Edit Vehicle Screen
 * Form to edit existing vehicle
 */

import React, { useState, useEffect } from 'react';
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
  validatePhoneNumber,
} from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import TextInput from '../../components/common/Input/TextInput';
import PhoneInput from '../../components/common/Input/PhoneInput';
import ContactMethodsSelector from '../../components/vehicle/ContactMethodsSelector';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Card from '../../components/common/Card/Card';
import Spinner from '../../components/common/Loading/Spinner';

const EditVehicleScreen = ({ navigation, route }) => {
  const { vehicleId } = route.params;
  const { vehicles, updateVehicle, isLoading } = useVehicles();

  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    contactPhone: '',
    contactMethods: {
      phone: true,
      sms: true,
      whatsapp: false,
      email: false,
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const foundVehicle = vehicles.find((v) => v._id === vehicleId);
    if (foundVehicle) {
      setVehicle(foundVehicle);
      setFormData({
        contactPhone: foundVehicle.contactPhone,
        contactMethods: foundVehicle.contactMethods,
      });
    }
  }, [vehicleId, vehicles]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Contact phone
    const phoneValidation = validatePhoneNumber(formData.contactPhone);
    if (!phoneValidation.valid) {
      newErrors.contactPhone = phoneValidation.message;
    }

    // Contact methods
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

    const result = await updateVehicle(vehicleId, formData);

    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to update vehicle');
    }
  };

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppBar title="Edit Vehicle" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Spinner size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Edit Vehicle"
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
          {/* Vehicle Info Card */}
          <Card style={styles.vehicleCard}>
            <Text style={styles.vehicleIcon}>
              {vehicle.vehicleType === '2-wheeler' ? '🏍️' : '🚗'}
            </Text>
            <View style={styles.vehicleInfo}>
              <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
              <Text style={styles.vehicleType}>{vehicle.vehicleType}</Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Plate number and vehicle type cannot be changed. Contact support if needed.
            </Text>
          </Card>

          {/* Form */}
          <View style={styles.form}>
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
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Save Changes"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
            />

            <SecondaryButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              disabled={isLoading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  vehicleIcon: {
    fontSize: 48,
    marginRight: SPACING.base,
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  vehicleType: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    marginBottom: SPACING.lg,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
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

export default EditVehicleScreen;
