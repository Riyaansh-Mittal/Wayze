/**
 * Vehicle Details Screen
 * FULLY CORRECTED - Translation Keys + Navigation
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useVehicles} from '../../contexts/VehicleContext';
import {useTheme} from '../../contexts/ThemeContext';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import PrimaryButton from '../../components/common/Button/PrimaryButton';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Spinner from '../../components/common/Loading/Spinner';

const VehicleDetailsScreen = ({navigation, route}) => {
  const {t, theme} = useTheme();
  const {colors, spacing, layout} = theme;
  const {vehicleId} = route.params;
  const {getVehicleById, deleteVehicle} = useVehicles();

  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      setIsLoading(true);
      const v = await getVehicleById(vehicleId);
      setVehicle(v);
      setIsLoading(false);
    };

    loadVehicle();
  }, [vehicleId, getVehicleById]);

  const getVehicleIcon = type => {
    switch (type) {
      case '2-wheeler':
        return '🏍️';
      case '3-wheeler':
        return '🛺';
      case '4-wheeler':
        return '🚗';
      default:
        return '🚗';
    }
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
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('time.justNow');
    if (diffMins < 60) return t('time.minutesAgo', {count: diffMins});
    if (diffHours < 24) return t('time.hoursAgo', {count: diffHours});
    if (diffDays < 7) return t('time.daysAgo', {count: diffDays});
    return formatDate(dateString);
  };

  const handleEdit = () => {
    navigation.navigate('EditVehicle', {vehicleId});
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert(t('common.comingSoon'), t('vehicles.details.shareButton'));
  };

  const handleDelete = () => {
    Alert.alert(
      t('vehicles.details.deleteConfirm.title'),
      t('vehicles.details.deleteConfirm.message'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('vehicles.details.deleteConfirm.confirmButton'),
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
        t('common.success'),
        t('vehicles.details.deleteConfirm.success'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.navigate('MyVehicles'),
          },
        ],
      );
    } else {
      Alert.alert(t('common.error'), t('vehicles.form.deleteFailed'));
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}
        edges={['top']}>
        <AppBar
          title={t('vehicles.details.title')}
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
          title={t('vehicles.details.title')}
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
        title={t('vehicles.details.title')}
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
          <Text style={[styles.vehicleIcon, {marginBottom: spacing.md}]}>
            {getVehicleIcon(vehicle.vehicleType)}
          </Text>
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
              ✓ {t('profile.verified.email').replace('✓ ', '')}
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
            {t('vehicles.details.vehicleInfo')}
          </Text>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.registrationNumber')}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.plateNumber}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.vehicleType')}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {t(`vehicles.types.${vehicle.vehicleType}`)}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomWidth: 0}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.addedOn')}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {formatDate(vehicle.createdAt)}
            </Text>
          </View>
        </Card>

        {/* Contact Information */}
        <Card style={{marginBottom: spacing.md}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: spacing.base,
              },
            ]}>
            {t('vehicles.details.contactInfo')}
          </Text>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.phoneNumber')}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              +91 {vehicle.contactPhone}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomWidth: 0}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.allowedMethods')}
            </Text>
            <View style={styles.methodsContainer}>
              {vehicle.contactMethods?.phone && (
                <View
                  style={[
                    styles.methodChip,
                    {
                      backgroundColor: colors.primaryLight,
                      marginRight: spacing.xs,
                      marginBottom: spacing.xs,
                    },
                  ]}>
                  <Text style={[styles.methodText, {color: colors.primary}]}>
                    📞 {t('common.yes')}
                  </Text>
                </View>
              )}
              {vehicle.contactMethods?.sms && (
                <View
                  style={[
                    styles.methodChip,
                    {
                      backgroundColor: colors.primaryLight,
                      marginRight: spacing.xs,
                      marginBottom: spacing.xs,
                    },
                  ]}>
                  <Text style={[styles.methodText, {color: colors.primary}]}>
                    💬 SMS
                  </Text>
                </View>
              )}
              {vehicle.contactMethods?.whatsapp && (
                <View
                  style={[
                    styles.methodChip,
                    {
                      backgroundColor: colors.primaryLight,
                      marginBottom: spacing.xs,
                    },
                  ]}>
                  <Text style={[styles.methodText, {color: colors.primary}]}>
                    📱 WhatsApp
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>

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
            {t('vehicles.details.activityStats')}
          </Text>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.totalSearches')}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.searches || 0}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomColor: colors.border}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.contactRequests')}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.contactRequests || 0}
            </Text>
          </View>

          <View style={[styles.infoRow, {borderBottomWidth: 0}]}>
            <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
              {t('vehicles.details.lastSearched')}
            </Text>
            <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
              {vehicle.lastSearched
                ? formatTimeAgo(vehicle.lastSearched)
                : t('time.justNow')}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <SecondaryButton
            title={t('vehicles.details.shareButton')}
            onPress={handleShare}
            fullWidth
            style={{marginBottom: spacing.md}}
            leftIcon={<Text>📤</Text>}
          />

          <SecondaryButton
            title={t('vehicles.details.deleteButton')}
            onPress={handleDelete}
            loading={isDeleting}
            fullWidth
            style={{
              borderColor: colors.error,
            }}
            textStyle={{color: colors.error}}
            leftIcon={<Text>🗑️</Text>}
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
  scrollContent: {
    // Dynamic
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
  },
  header: {
    // Dynamic
  },
  vehicleIcon: {
    fontSize: 72,
  },
  plateNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {
    // Dynamic
  },
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
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  methodChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    // Dynamic
  },
});

export default VehicleDetailsScreen;
