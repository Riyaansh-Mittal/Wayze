/**
 * Edit Vehicle Screen
 * FIXED - Uses correct translation keys and getVehicleDetails
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
  LayoutAnimation,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  {value: '2-wheeler', label: '2 Wheeler (Bike / Scooter)'},
  {value: '3-wheeler', label: '3 Wheeler (Auto)'},
  {value: '4-wheeler', label: '4 Wheeler (Car / SUV)'},
];

const EditVehicleScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {vehicleId} = route.params;
  const {vehicles, getVehicleDetails, updateVehicle, isLoading} = useVehicles();

  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleType: '',
    contactPhone: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      setIsLoadingVehicle(true);

      // Try to find in local vehicles first
      const localVehicle = vehicles.find(v => v._id === vehicleId);

      if (localVehicle) {
        setVehicle(localVehicle);
        setFormData({
          vehicleType: localVehicle.vehicleType,
          contactPhone: localVehicle.contactPhone || '',
        });
        setIsLoadingVehicle(false);
        return;
      }

      // Otherwise fetch from API
      const result = await getVehicleDetails(vehicleId);

      if (result?.success && result?.data) {
        setVehicle(result.data);
        setFormData({
          vehicleType: result.data.vehicleType,
          contactPhone: result.data.contactPhone || '',
        });
      }

      setIsLoadingVehicle(false);
    };

    loadVehicle();
  }, [vehicleId, vehicles, getVehicleDetails]);

  const updateField = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: ''}));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleType) {
      newErrors.vehicleType =
        t('validation.required') || 'This field is required';
    }

    // Contact phone is optional, but if provided must be valid
    if (
      formData.contactPhone &&
      !validatePhoneNumber(formData.contactPhone).valid
    ) {
      newErrors.contactPhone =
        t('validation.invalidPhone') || 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        t('common.error') || 'Error',
        t('errors.validation') || 'Please fix the errors',
      );
      return;
    }

    const result = await updateVehicle(vehicleId, formData);

    if (result.success) {
      Alert.alert(
        t('common.success') || 'Success',
        t('vehicles.form.updateSuccess') || 'Changes saved',
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
        result.error ||
          t('vehicles.form.updateFailed') ||
          'Failed to save changes',
      );
    }
  };

  if (isLoadingVehicle) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.neutralLight}]}
        edges={['top']}>
        <AppBar
          title={t('vehicles.editButton') || 'Edit Vehicle'}
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Spinner size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              {color: colors.textSecondary, marginTop: spacing.md},
            ]}>
            {t('common.loading') || 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.neutralLight}]}
        edges={['top']}>
        <AppBar
          title={t('vehicles.editButton') || 'Edit Vehicle'}
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: colors.textSecondary}]}>
            {t('errors.notFound') || 'Vehicle not found'}
          </Text>
          <SecondaryButton
            title={t('common.goBack') || 'Go Back'}
            onPress={() => navigation.goBack()}
            style={{marginTop: spacing.lg}}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.neutralLight}]}
      edges={['top']}>
      <AppBar
        title={t('vehicles.editButton') || 'Edit Vehicle'}
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
          {/* Vehicle Type Dropdown */}
          <Card style={{marginBottom: spacing.lg}}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  marginBottom: spacing.sm,
                },
              ]}>
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

          {/* Registration Number - Read Only */}
          <Card style={{marginBottom: spacing.lg}}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  marginBottom: spacing.sm,
                },
              ]}>
              {t('vehicles.form.plateNumber') || 'Vehicle Number'}
            </Text>

            <View
              style={[
                styles.disabledInput,
                {
                  backgroundColor: colors.neutralLight,
                  borderColor: colors.neutralBorder,
                  padding: spacing.base,
                  borderRadius: 10,
                  borderWidth: 1,
                },
              ]}>
              <VehicleIcon
                type={formData.vehicleType || '4-wheeler'}
                size={24}
              />
              <Text
                style={{
                  marginLeft: spacing.sm,
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.textSecondary,
                  flex: 1,
                }}>
                {vehicle.plateNumber}
              </Text>
              <Icon name="lock" size={20} color={colors.textSecondary} />
            </View>

            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: spacing.xs,
              }}>
              {t('vehicles.form.plateChangeHelper') ||
                'Contact support to change plate number'}
            </Text>
          </Card>

          {/* Contact Phone Number */}
          <Card style={{marginBottom: spacing.lg}}>
            <TextInput
              label={`${t('vehicles.form.contactPhone') || 'Contact Number'} (${
                t('common.optional') || 'Optional'
              })`}
              value={formData.contactPhone}
              onChangeText={text =>
                updateField('contactPhone', text.replace(/\D/g, ''))
              }
              placeholder={
                t('vehicles.form.contactPhonePlaceholder') ||
                '10 digit mobile number'
              }
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.contactPhone}
              helperText={
                t('vehicles.form.contactPhoneHelper') ||
                'People will use this to reach you'
              }
              leftIcon={<Text style={{fontSize: 18}}>📱</Text>}
            />
          </Card>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={t('vehicles.form.saveChangesButton') || 'Save Changes'}
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
            />

            <SecondaryButton
              title={t('vehicles.form.cancelButton') || 'Cancel'}
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
  loadingText: {fontSize: 15},
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {fontSize: 15, textAlign: 'center'},
  label: {fontSize: 13, fontWeight: '600'},
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
  disabledInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {},
});

export default EditVehicleScreen;
