/**
 * Vehicle Details Screen
 * FIXED - Uses getVehicleDetails from context
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Spinner from '../../components/common/Loading/Spinner';
import VehicleIcon from '../../components/common/Icon/VehicleIcon';

const VehicleDetailsScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {vehicleId} = route.params;
  const {
    vehicles,
    selectedVehicle,
    getVehicleDetails, // ✅ Use this instead
    deleteVehicle,
    isLoading: contextLoading,
  } = useVehicles();

  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      console.log('🔍 Loading vehicle with ID:', vehicleId);

      setIsLoading(true);

      // Try to find in local vehicles first
      const localVehicle = vehicles.find(v => v._id === vehicleId);

      if (localVehicle) {
        console.log('✅ Found in local state:', localVehicle);
        setVehicle(localVehicle);
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from API
      const result = await getVehicleDetails(vehicleId);

      if (result?.success && result?.data) {
        console.log('✅ Fetched from API:', result.data);
        setVehicle(result.data);
      } else {
        console.error('❌ Failed to load vehicle');
      }

      setIsLoading(false);
    };

    loadVehicle();
  }, [vehicleId, vehicles, getVehicleDetails]);

  const getVehicleIconComponent = type => {
    return <VehicleIcon type={type} size={72} />;
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeAgo = dateString => {
    if (!dateString) return t('time.justNow') || 'Just now';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('time.justNow') || 'Just now';
    if (diffMins < 60)
      return t('time.minutesAgo', {count: diffMins}) || `${diffMins}m ago`;
    if (diffHours < 24)
      return t('time.hoursAgo', {count: diffHours}) || `${diffHours}h ago`;
    if (diffDays < 7)
      return t('time.daysAgo', {count: diffDays}) || `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const handleEdit = () => {
    navigation.navigate('EditVehicle', {vehicleId});
  };

  const handleShare = () => {
    Alert.alert(
      t('common.comingSoon') || 'Coming Soon',
      t('vehicles.details.shareButton') || 'Share feature coming soon',
    );
  };

  const handleDelete = () => {
    Alert.alert(
      t('vehicles.details.deleteConfirm.title') || 'Delete Vehicle?',
      t('vehicles.details.deleteConfirm.message') ||
        "This will remove your vehicle from the network. People won't be able to find you.",
      [
        {text: t('common.cancel') || 'Cancel', style: 'cancel'},
        {
          text: t('vehicles.details.deleteConfirm.confirmButton') || 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteVehicle(vehicleId);
    setIsDeleting(false);

    if (result.success) {
      Alert.alert(
        t('common.success') || 'Success',
        t('vehicles.details.deleteConfirm.success') || 'Vehicle deleted',
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
        t('vehicles.form.deleteFailed') || 'Failed to delete vehicle',
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}
        edges={['top']}>
        <AppBar
          title={t('vehicles.details.title') || 'Vehicle Details'}
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
        style={[styles.container, {backgroundColor: colors.background}]}
        edges={['top']}>
        <AppBar
          title={t('vehicles.details.title') || 'Vehicle Details'}
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
      style={[styles.container, {backgroundColor: colors.background}]}
      edges={['top']}>
      <AppBar
        title={t('vehicles.details.title') || 'Vehicle Details'}
        showBack
        onBackPress={() => navigation.goBack()}
        rightIcon={<Text style={{fontSize: 20}}>✏️</Text>}
        onRightPress={handleEdit}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            padding: layout.screenPadding,
            paddingBottom: spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Vehicle Header */}
        <View
          style={[
            styles.header,
            {
              alignItems: 'center',
              marginBottom: spacing.xl,
            },
          ]}>
          <View style={{marginBottom: spacing.md}}>
            {getVehicleIconComponent(vehicle.vehicleType)}
          </View>
          <Text
            style={[
              styles.plateNumber,
              {
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              },
            ]}>
            {vehicle.plateNumber}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: colors.successLight,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: 16,
              },
            ]}>
            <Text style={[styles.statusText, {color: colors.success}]}>
              ✓ {t('common.active') || 'Active'}
            </Text>
          </View>
        </View>

        {/* Vehicle Information */}
        <Card style={{marginBottom: spacing.md}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.base,
              },
            ]}>
            {t('vehicles.details.vehicleInfo') || 'Vehicle Information'}
          </Text>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.registrationNumber') ||
                'Registration Number'}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.plateNumber}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.vehicleType') || 'Vehicle Type'}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {t(`vehicles.types.${vehicle.vehicleType}`) ||
                vehicle.vehicleType}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomWidth: 0}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.addedOn') || 'Added On'}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {formatDate(vehicle.createdAt)}
            </Text>
          </View>
        </Card>

        {/* Contact Information */}
        {vehicle.contactPhone && (
          <Card style={{marginBottom: spacing.md}}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                  marginBottom: spacing.base,
                },
              ]}>
              {t('vehicles.details.contactInfo') || 'Contact Information'}
            </Text>

            <View style={[styles.infoRow, {borderBottomWidth: 0}]}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
                {t('vehicles.details.phoneNumber') || 'Phone Number'}
              </Text>
              <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
                +91 {vehicle.contactPhone}
              </Text>
            </View>
          </Card>
        )}

        {/* Activity Statistics */}
        <Card style={{marginBottom: spacing.md}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.base,
              },
            ]}>
            {t('vehicles.details.activityStats') || 'Activity Statistics'}
          </Text>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.totalSearches') || 'Total Searches'}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.searches || 0}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.contactRequests') || 'Contact Requests'}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.contactRequests || 0}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomWidth: 0}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.lastSearched') || 'Last Searched'}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.lastSearched
                ? formatTimeAgo(vehicle.lastSearched)
                : t('common.never') || 'Never'}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <SecondaryButton
            title={t('vehicles.details.shareButton') || 'Share Vehicle Profile'}
            onPress={handleShare}
            fullWidth
            style={{marginBottom: spacing.md}}
            icon={<Text style={{fontSize: 18}}>📤</Text>}
          />

          <SecondaryButton
            title={t('vehicles.details.deleteButton') || 'Delete Vehicle'}
            onPress={handleDelete}
            loading={isDeleting}
            fullWidth
            style={{
              borderColor: colors.error,
            }}
            textStyle={{color: colors.error}}
            icon={<Text style={{fontSize: 18}}>🗑️</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },
  header: {},
  plateNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {},
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {},
});

export default VehicleDetailsScreen;
