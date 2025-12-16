/**
 * Edit Vehicle Screen
 * FULLY CORRECTED
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import {validatePhoneNumber} from '../../utils/validators';
import AppBar from '../../components/navigation/AppBar';
import TextInput from '../../components/common/Input/TextInput';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Spinner from '../../components/common/Loading/Spinner';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';

const VEHICLE_TYPES = [
  {value: '2-wheeler', icon: <VehicleIcon type="2-wheeler" size={64} />},
  {value: '3-wheeler', icon: <VehicleIcon type="3-wheeler" size={64} />},
  {value: '4-wheeler', icon: <VehicleIcon type="4-wheeler" size={64} />},
];

const EditVehicleScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {vehicleId} = route.params;
  const {getVehicleById, updateVehicle, isLoading} = useVehicles();

  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleType: '',
    contactPhone: '',
    contactMethods: {
      phone: true,
      sms: true,
      whatsapp: false,
    },
  });
  const [errors, setErrors] = useState({});
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);

  useEffect(() => {
    const loadVehicle = async () => {
      setIsLoadingVehicle(true);
      const v = await getVehicleById(vehicleId);
      if (v) {
        setVehicle(v);
        setFormData({
          vehicleType: v.vehicleType,
          contactPhone: v.contactPhone,
          contactMethods: v.contactMethods || {
            phone: true,
            sms: true,
            whatsapp: false,
          },
        });
      }
      setIsLoadingVehicle(false);
    };

    loadVehicle();
  }, [vehicleId, getVehicleById]);

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

    if (!formData.vehicleType) {
      newErrors.vehicleType = t('validation.required');
    }

    const phoneValidation = validatePhoneNumber(formData.contactPhone);
    if (!phoneValidation.valid) {
      newErrors.contactPhone = t('validation.invalidPhone');
    }

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

    const result = await updateVehicle(vehicleId, formData);

    if (result.success) {
      Alert.alert(t('common.success'), t('vehicles.form.updateSuccess'), [
        {
          text: t('common.ok'),
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert(
        t('common.error'),
        result.error || t('vehicles.form.updateFailed'),
      );
    }
  };

  if (isLoadingVehicle) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}
        edges={['top']}>
        <AppBar
          title={t('vehicles.editButton')}
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Spinner size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}
        edges={['top']}>
        <AppBar
          title={t('vehicles.editButton')}
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: colors.textSecondary}]}>
            {t('errors.notFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('vehicles.editButton')}
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

          {/* Registration Number - Read Only */}
          <View style={[styles.section, {marginBottom: spacing.lg}]}>
            <TextInput
              label={t('vehicles.form.plateNumber')}
              value={vehicle.plateNumber}
              onChangeText={() => {}}
              disabled
              leftIcon={<VehicleIcon type="4-wheeler" size={64} />}
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

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={t('vehicles.form.saveChangesButton')}
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
            />

            <SecondaryButton
              title={t('common.cancel')}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
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
  container: {flex: 1},
  keyboardView: {flex: 1},
  scrollView: {flex: 1},
  scrollContent: {},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  section: {},
  label: {fontSize: 13, fontWeight: '600'},
  vehicleTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  vehicleTypeIcon: {fontSize: 32},
  vehicleTypeLabel: {fontSize: 15, fontWeight: '500'},
  checkmark: {fontSize: 20, fontWeight: '700'},
  errorText: {fontSize: 13, marginTop: 4},
  helperNote: {fontSize: 12},
  methodRow: {flexDirection: 'row', alignItems: 'center'},
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCheck: {fontSize: 14, fontWeight: '700'},
  methodLabel: {fontSize: 15, flex: 1},
  buttonContainer: {},
});

export default EditVehicleScreen;
