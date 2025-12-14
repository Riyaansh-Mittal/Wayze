/**
 * Upload RC Screen
 * Upload RC document for ownership claim
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
import { useAuth } from '../../hooks';
import { OwnershipService } from '../../services/api';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import { validatePhoneNumber } from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PhoneInput from '../../components/common/Input/PhoneInput';
import RCUploader from '../../components/vehicle/RCUploader';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';

const UploadRCScreen = ({ navigation, route }) => {
  const { plateNumber } = route.params;
  const { user } = useAuth();

  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '');
  const [rcPhoto, setRcPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const phoneValidation = validatePhoneNumber(contactPhone);
    if (!phoneValidation.valid) {
      newErrors.contactPhone = phoneValidation.message;
    }

    if (!rcPhoto) {
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

    setIsSubmitting(true);

    try {
      // TODO: Upload RC photo to storage first
      // const uploadedUrl = await uploadRCPhoto(rcPhoto);

      const claimData = {
        userId: user._id,
        plateNumber,
        contactPhone,
        rcPhotoUrl: rcPhoto.uri, // In production, use uploaded URL
      };

      const result = await OwnershipService.create(claimData);

      if (result.success) {
        navigation.navigate('ClaimSubmitted', {
          claimId: result.data._id,
          plateNumber,
        });
      } else {
        Alert.alert('Error', 'Failed to submit claim. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Claim Ownership"
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.icon}>📋</Text>
            <Text style={styles.title}>Submit Ownership Claim</Text>
            <Text style={styles.subtitle}>
              Upload your RC document to prove ownership
            </Text>
          </View>

          {/* Plate Number Card */}
          <Card style={styles.plateCard}>
            <Text style={styles.plateLabel}>Claiming Ownership For:</Text>
            <Text style={styles.plateNumber}>{plateNumber}</Text>
          </Card>

          {/* Form */}
          <View style={styles.form}>
            <PhoneInput
              value={contactPhone}
              onChangeText={(value) => {
                setContactPhone(value);
                setErrors((prev) => ({ ...prev, contactPhone: '' }));
              }}
              error={errors.contactPhone}
              required
              helperText="We'll contact you on this number for verification"
            />

            <RCUploader
              value={rcPhoto}
              onChange={(value) => {
                setRcPhoto(value);
                setErrors((prev) => ({ ...prev, rcPhoto: '' }));
              }}
              error={errors.rcPhoto}
            />
          </View>

          {/* Info Cards */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Verification Time</Text>
              <Text style={styles.infoText}>
                Claims are usually processed within 24-48 hours
              </Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔒</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Privacy</Text>
              <Text style={styles.infoText}>
                Your RC details are secure and only used for verification
              </Text>
            </View>
          </Card>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Submit Claim"
              onPress={handleSubmit}
              loading={isSubmitting}
              fullWidth
              icon={<Text style={{ color: COLORS.white }}>→</Text>}
            />

            <SecondaryButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
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
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  icon: {
    fontSize: 60,
    marginBottom: SPACING.base,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  plateCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  plateLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  plateNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    marginTop: SPACING.xl,
  },
});

export default UploadRCScreen;
