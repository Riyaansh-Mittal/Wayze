/**
 * Vehicle Details Screen
 * Detailed view of a vehicle with stats
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicles } from '../../hooks';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../config/theme';
import { formatDate } from '../../utils/formatters';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';
import SecondaryButton from '../../components/common/Button/SecondaryButton';
import Spinner from '../../components/common/Loading/Spinner';

const VehicleDetailsScreen = ({ navigation, route }) => {
  const { vehicleId } = route.params;
  const { vehicles, deleteVehicle, isLoading } = useVehicles();

  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const foundVehicle = vehicles.find((v) => v._id === vehicleId);
    if (foundVehicle) {
      setVehicle(foundVehicle);
    }
  }, [vehicleId, vehicles]);

  const handleEdit = () => {
    navigation.navigate('EditVehicle', { vehicleId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.plateNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    const result = await deleteVehicle(vehicleId);

    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
    }
  };

  const getVehicleIcon = () => {
    switch (vehicle?.vehicleType) {
      case '2-wheeler':
        return '🏍️';
      case '4-wheeler':
        return '🚗';
      case 'heavy-vehicle':
        return '🚚';
      default:
        return '🚗';
    }
  };

  const getStatusBadge = () => {
    switch (vehicle?.verificationStatus) {
      case 'verified':
        return { label: 'Verified', color: COLORS.success, icon: '✓' };
      case 'pending':
        return { label: 'Pending Verification', color: COLORS.warning, icon: '⏳' };
      case 'rejected':
        return { label: 'Rejected', color: COLORS.error, icon: '✕' };
      default:
        return { label: 'Unverified', color: COLORS.textSecondary, icon: '○' };
    }
  };

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppBar title="Vehicle Details" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Spinner size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const statusBadge = getStatusBadge();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppBar
        title="Vehicle Details"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Header */}
        <Card style={styles.headerCard}>
          <Text style={styles.vehicleIcon}>{getVehicleIcon()}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
            <Text style={styles.vehicleType}>{vehicle.vehicleType.replace('-', ' ')}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
            <Text style={styles.statusIcon}>{statusBadge.icon}</Text>
          </View>
        </Card>

        {/* Status Info */}
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, { color: statusBadge.color }]}>
              {statusBadge.label}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>RC Number:</Text>
            <Text style={styles.infoValue}>{vehicle.rcNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Phone:</Text>
            <Text style={styles.infoValue}>{vehicle.contactPhone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registered On:</Text>
            <Text style={styles.infoValue}>
              {formatDate(vehicle.createdAt, 'full')}
            </Text>
          </View>
        </Card>

        {/* Contact Methods */}
        <Card>
          <Text style={styles.sectionTitle}>Contact Methods</Text>
          <View style={styles.contactMethodsGrid}>
            {vehicle.contactMethods.phone && (
              <View style={styles.contactMethod}>
                <Text style={styles.contactMethodIcon}>📞</Text>
                <Text style={styles.contactMethodText}>Phone</Text>
              </View>
            )}
            {vehicle.contactMethods.sms && (
              <View style={styles.contactMethod}>
                <Text style={styles.contactMethodIcon}>💬</Text>
                <Text style={styles.contactMethodText}>SMS</Text>
              </View>
            )}
            {vehicle.contactMethods.whatsapp && (
              <View style={styles.contactMethod}>
                <Text style={styles.contactMethodIcon}>📱</Text>
                <Text style={styles.contactMethodText}>WhatsApp</Text>
              </View>
            )}
            {vehicle.contactMethods.email && (
              <View style={styles.contactMethod}>
                <Text style={styles.contactMethodIcon}>📧</Text>
                <Text style={styles.contactMethodText}>Email</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Statistics */}
        <Card>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{vehicle.stats.totalSearches}</Text>
              <Text style={styles.statLabel}>Total Searches</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{vehicle.stats.contactRequests}</Text>
              <Text style={styles.statLabel}>Contact Requests</Text>
            </View>
          </View>

          {vehicle.stats.lastSearched && (
            <View style={styles.lastSearched}>
              <Text style={styles.lastSearchedLabel}>Last searched:</Text>
              <Text style={styles.lastSearchedValue}>
                {formatDate(vehicle.stats.lastSearched, 'relative')}
              </Text>
            </View>
          )}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <SecondaryButton
            title="Edit Vehicle"
            onPress={handleEdit}
            disabled={isLoading}
            fullWidth
            icon={<Text style={{ color: COLORS.primary }}>✏️</Text>}
          />

          <SecondaryButton
            title="Delete Vehicle"
            onPress={handleDelete}
            disabled={isLoading}
            fullWidth
            style={[styles.deleteButton, { marginTop: SPACING.md }]}
            icon={<Text style={{ color: COLORS.error }}>🗑️</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.screenPadding,
    paddingBottom: SPACING.xxxl,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  vehicleIcon: {
    fontSize: 60,
    marginRight: SPACING.base,
  },
  headerInfo: {
    flex: 1,
  },
  plateNumber: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
  },
  vehicleType: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorder,
  },
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyBold,
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.base,
  },
  contactMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  contactMethod: {
    alignItems: 'center',
    width: '22%',
  },
  contactMethodIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  contactMethodText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.base,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  lastSearched: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralBorder,
  },
  lastSearchedLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  lastSearchedValue: {
    ...TYPOGRAPHY.captionBold,
  },
  actions: {
    marginTop: SPACING.base,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
});

export default VehicleDetailsScreen;
